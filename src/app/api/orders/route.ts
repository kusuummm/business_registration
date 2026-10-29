import { NextResponse } from 'next/server';
import { getAllOrders, createOrder, updateOrder } from '@/lib/serverStore';
import { notifyOrderPlaced, notifyDocumentsApproved, notifyCertificateReleased } from '@/lib/notifications';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mobile = searchParams.get('mobile');
    const email = searchParams.get('email');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let orders = getAllOrders();

    if (mobile) {
      const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
      orders = orders.filter((o) => {
        const orderMobile = (o.auth?.mobile || '').replace(/\D/g, '').slice(-10);
        return orderMobile === cleanMobile;
      });
    }

    if (email) {
      orders = orders.filter((o) => o.auth?.email?.toLowerCase() === email.toLowerCase());
    }

    if (status) {
      orders = orders.filter((o) => (o.status || '').toLowerCase().includes(status.toLowerCase()));
    }

    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter((o) => 
        (o.orderId || '').toLowerCase().includes(q) ||
        (o.company?.primaryName || '').toLowerCase().includes(q) ||
        (o.auth?.name || '').toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, data: orders, orders, count: orders.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.company || !body.auth) {
      return NextResponse.json({ success: false, error: 'Missing company or auth details' }, { status: 400 });
    }

    const newOrder = createOrder(body);
    if (newOrder) {
      notifyOrderPlaced(newOrder).catch((err) => console.error('Failed to dispatch notifyOrderPlaced:', err));
    }
    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const id = body.orderId || body.id;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    let updates = { ...body };
    if (body.action === 'release_certificate') {
      updates = {
        ...updates,
        certificateUploaded: true,
        status: 'Incorporated & Completed',
        docsPending: 'None (Completed)',
        coiReleasedAt: new Date().toISOString()
      };
    }

    const updated = updateOrder(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: `Order #${id} not found` }, { status: 404 });
    }

    if (body.adminApproved === true || body.docVerificationStatus === 'Approved') {
      notifyDocumentsApproved(updated).catch((err) => console.error('Failed to dispatch notifyDocumentsApproved:', err));
    }
    if (body.action === 'release_certificate' || body.certificateUploaded === true) {
      notifyCertificateReleased(updated, body.cin).catch((err) => console.error('Failed to dispatch notifyCertificateReleased:', err));
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
