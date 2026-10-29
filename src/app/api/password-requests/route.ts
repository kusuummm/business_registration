import { NextResponse } from 'next/server';
import { 
  getAllPasswordRequests, 
  createPasswordRequest, 
  adminResetCustomerPassword, 
  updatePasswordRequest 
} from '@/lib/serverStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const status = searchParams.get('status');

    let requests = getAllPasswordRequests();

    if (email) {
      requests = requests.filter(
        (r) => r.customerEmail.toLowerCase() === email.toLowerCase() ||
               r.customerMobile.includes(email)
      );
    }

    if (status) {
      requests = requests.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      data: requests,
      count: requests.length
    });
  } catch (error) {
    console.error('Failed to get password requests:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while fetching password requests' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.customerEmail || !body.customerName || !body.reason) {
      return NextResponse.json(
        { success: false, error: 'Customer name, email, and reason for reset are required.' },
        { status: 400 }
      );
    }

    const created = createPasswordRequest({
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerMobile: body.customerMobile || '',
      companyName: body.companyName || 'Corporate Client',
      reason: body.reason,
      urgency: body.urgency === 'Urgent' ? 'Urgent' : 'Normal'
    });

    return NextResponse.json({
      success: true,
      message: 'Password change request submitted successfully to Administrator.',
      data: created
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create password request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit password request' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { requestId, action, newPassword, adminEmail, adminNotes } = body;

    if (!requestId) {
      return NextResponse.json(
        { success: false, error: 'Request ID is required' },
        { status: 400 }
      );
    }

    // Action 1: Execute Admin Password Reset & Dispatch Email to Customer
    if (action === 'admin_reset') {
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: 'A valid new password (at least 6 characters) must be provided.' },
          { status: 400 }
        );
      }

      const result = adminResetCustomerPassword({
        requestId,
        newPassword,
        adminEmail: adminEmail || 'admin@bharatfilings.com',
        adminNotes: adminNotes || 'Administrator verified and dispatched new credentials.'
      });

      if (!result) {
        return NextResponse.json(
          { success: false, error: 'Password request not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Password changed successfully! Automated statutory email containing updated credentials has been dispatched to ${result.request.customerEmail}.`,
        data: result.request,
        emailDispatched: result.emailDispatched
      });
    }

    // Action 2: Generic status or note update
    if (body.status || body.adminNotes) {
      const updated = updatePasswordRequest(requestId, {
        status: body.status,
        adminNotes: body.adminNotes
      });
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action specified' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Failed to update password request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process password request' },
      { status: 500 }
    );
  }
}
