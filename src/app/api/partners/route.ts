import { NextResponse } from 'next/server';
import { getAllPartners, updatePartner, getAllPayouts, processPayout, processAllPayouts } from '@/lib/serverStore';

export async function GET() {
  try {
    const partners = getAllPartners();
    const payouts = getAllPayouts();
    return NextResponse.json({ success: true, data: { partners, payouts }, partners, payouts });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch partner data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.action === 'process_payout') {
      const payout = processPayout(body.payoutId);
      if (!payout) {
        return NextResponse.json({ success: false, error: 'Payout record not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: payout });
    }

    if (body.action === 'process_all_payouts') {
      const payouts = processAllPayouts();
      return NextResponse.json({ success: true, data: payouts });
    }

    if (body.partnerId && body.updates) {
      const updated = updatePartner(body.partnerId, body.updates);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid partner action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process partner request' }, { status: 500 });
  }
}
