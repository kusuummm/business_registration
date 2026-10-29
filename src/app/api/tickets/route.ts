import { NextResponse } from 'next/server';
import { getAllTickets, createTicket, updateTicket } from '@/lib/serverStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const customer = searchParams.get('customer');
    let tickets = getAllTickets();

    if (status) {
      tickets = tickets.filter((t) => t.status.toLowerCase() === status.toLowerCase());
    }
    if (customer) {
      tickets = tickets.filter((t) => t.customerName.toLowerCase().includes(customer.toLowerCase()));
    }

    return NextResponse.json({ success: true, data: tickets, count: tickets.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.subject) {
      return NextResponse.json({ success: false, error: 'Subject is required' }, { status: 400 });
    }

    const ticket = createTicket({
      customerName: body.customerName || 'Rahul Sharma',
      subject: body.subject,
      category: body.category || 'General Query',
      message: body.message || ''
    });

    return NextResponse.json({ success: true, data: ticket }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create ticket' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Ticket ID required' }, { status: 400 });
    }
    const updated = updateTicket(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update ticket' }, { status: 500 });
  }
}
