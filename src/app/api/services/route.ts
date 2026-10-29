import { NextResponse } from 'next/server';
import { getAllServices, updateService, upsertService } from '@/lib/serverStore';

export async function GET() {
  try {
    const services = getAllServices();
    return NextResponse.json({ success: true, data: services, services, count: services.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name) {
      return NextResponse.json({ success: false, error: 'Service name is required' }, { status: 400 });
    }
    const service = upsertService(body);
    return NextResponse.json({ success: true, data: service }, { status: 200 });
  } catch (error) {
    console.error('Service save error:', error);
    return NextResponse.json({ success: false, error: 'Failed to save service' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Service ID required' }, { status: 400 });
    }
    const updated = upsertService(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Service ID required' }, { status: 400 });
    }
    const updated = updateService(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update service' }, { status: 500 });
  }
}
