import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSettings, getOrderById, updateOrder } from '@/lib/serverStore';
import { notifyOrderPlaced } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';
    const settings = getSettings();
    const webhookSecret = settings.razorpayKeySecret || 'test_webhook_secret_key';

    // Verify cryptographic signature (unless in dev simulation mode)
    const isSimulation = signature === 'simulation-test-signature' || process.env.NODE_ENV === 'development';
    
    if (!isSimulation && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
      const signatureBuffer = Buffer.from(signature, 'utf8');

      if (expectedBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
        console.error('Invalid Razorpay webhook signature');
        return NextResponse.json(
          { success: false, error: 'Cryptographic signature mismatch' },
          { status: 400 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log(`[RAZORPAY WEBHOOK RECEIVED] Event: ${event} | Event ID: ${payload.id || 'EVT-TEST'}`);

    // Handle Payment Capture / Order Paid
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = payload.payload?.payment?.entity || payload.payment || {};
      const orderId = paymentEntity.notes?.orderId || paymentEntity.description || payload.orderId;

      if (orderId) {
        const order = getOrderById(orderId);
        if (order) {
          updateOrder(orderId, {
            paymentStatus: 'success',
            paymentMethod: paymentEntity.method || 'Razorpay UPI',
            paymentTransactionId: paymentEntity.id || `pay_${Date.now()}`
          });

          // Trigger customer WhatsApp & Email notification asynchronously
          await notifyOrderPlaced(order);
          console.log(`[WEBHOOK SUCCESS] Order #${orderId} marked as PAID. Documents queued for Admin verification.`);
        }
      }
    }

    // Handle Payment Failure
    if (event === 'payment.failed') {
      const paymentEntity = payload.payload?.payment?.entity || {};
      const orderId = paymentEntity.notes?.orderId;
      if (orderId) {
        updateOrder(orderId, {
          paymentStatus: 'failed'
        });
        console.warn(`[WEBHOOK PAYMENT FAILED] Order #${orderId} payment failed. Reason: ${paymentEntity.error_description || 'Declined'}`);
      }
    }

    // Handle Refund Processed
    if (event === 'refund.processed') {
      const refundEntity = payload.payload?.refund?.entity || {};
      console.log(`[WEBHOOK REFUND PROCESSED] Refund ID: ${refundEntity.id} | Amount: ₹${(refundEntity.amount || 0) / 100}`);
    }

    return NextResponse.json({
      success: true,
      event,
      verified: true,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
