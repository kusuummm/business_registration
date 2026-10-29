import { NextResponse } from 'next/server';
import { getOrderById, updateOrder } from '@/lib/serverStore';
import { notifyDocumentsApproved, notifyCertificateReleased } from '@/lib/notifications';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = getOrderById(id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

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
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (body.adminApproved === true || body.docVerificationStatus === 'Approved') {
      notifyDocumentsApproved(updated).catch((err) => console.error('Failed to dispatch notifyDocumentsApproved:', err));
    }
    if (body.action === 'release_certificate' || body.certificateUploaded === true) {
      notifyCertificateReleased(updated, body.cin).catch((err) => console.error('Failed to dispatch notifyCertificateReleased:', err));
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update order' }, { status: 500 });
  }
}
