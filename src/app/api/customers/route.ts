import { NextResponse } from 'next/server';
import { getAllCustomers, directAdminResetPassword } from '@/lib/serverStore';

export async function GET() {
  try {
    const customers = getAllCustomers();
    return NextResponse.json({
      success: true,
      data: customers,
      count: customers.length
    });
  } catch (error) {
    console.error('Failed to get customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerEmail, newPassword, adminEmail, adminNotes } = body;

    if (!customerEmail || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Customer email and new password are required' },
        { status: 400 }
      );
    }

    const result = directAdminResetPassword({
      customerEmail,
      newPassword,
      adminEmail: adminEmail || 'admin@bharatfilings.com',
      adminNotes: adminNotes || 'Direct administrator password reset'
    });

    return NextResponse.json({
      success: true,
      message: `Password reset successfully! Updated credentials email dispatched to ${customerEmail}.`,
      data: result.customer,
      email: result.email
    });
  } catch (error) {
    console.error('Failed to execute direct customer password reset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to execute reset' },
      { status: 500 }
    );
  }
}
