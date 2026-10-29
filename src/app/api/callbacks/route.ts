import { NextResponse } from 'next/server';
import { getAllCallbacks, createCallback, updateCallbackStatus } from '@/lib/serverStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    let callbacks = getAllCallbacks();
    if (status) {
      callbacks = callbacks.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }
    return NextResponse.json({ success: true, data: callbacks, callbacks, count: callbacks.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch callbacks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.mobile) {
      return NextResponse.json({ success: false, error: 'Name and mobile are required' }, { status: 400 });
    }

    const lead = createCallback({
      name: body.name,
      mobile: body.mobile,
      service: body.service || 'Private Limited Company',
      city: body.city || 'India'
    });

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (error) {
    console.error('Callback POST error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ success: false, error: 'Lead ID and status required' }, { status: 400 });
    }
    const updated = updateCallbackStatus(body.id, body.status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update callback' }, { status: 500 });
  }
}
