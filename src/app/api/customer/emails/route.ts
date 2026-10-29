import { NextResponse } from 'next/server';
import { getCustomerEmails, markCustomerEmailRead } from '@/lib/serverStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const identifier = searchParams.get('identifier') || searchParams.get('email') || '';

    if (!identifier) {
      return NextResponse.json({ success: true, data: [] });
    }

    const emails = getCustomerEmails(identifier);

    return NextResponse.json({
      success: true,
      data: emails,
      unreadCount: emails.filter((e) => !e.read).length
    });
  } catch (error) {
    console.error('Failed to get customer emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve emails' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { identifier, emailId } = body;

    if (!identifier || !emailId) {
      return NextResponse.json(
        { success: false, error: 'Identifier and Email ID required' },
        { status: 400 }
      );
    }

    const success = markCustomerEmailRead(identifier, emailId);

    return NextResponse.json({ success });
  } catch (error) {
    console.error('Failed to mark email read:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark email read' },
      { status: 500 }
    );
  }
}
