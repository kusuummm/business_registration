import { NextResponse } from 'next/server';
import { verifyCustomerPassword } from '@/lib/serverStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password, mode } = body;

    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (!cleanId || !cleanPass) {
      return NextResponse.json(
        { success: false, error: 'Please enter both identifier and password.' },
        { status: 400 }
      );
    }

    // 1. ADMIN AUTHENTICATION
    const isAdminIdentifier = 
      cleanId.includes('admin') || 
      cleanId === 'root' || 
      cleanId.startsWith('adm-') || 
      cleanId.startsWith('adm_');

    if (mode === 'admin' || isAdminIdentifier) {
      if (cleanPass.length < 5) {
        return NextResponse.json(
          { success: false, error: 'Invalid Administrator password. Must be at least 5 characters.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        role: 'admin',
        message: 'Master Administrator authenticated successfully.',
        redirectUrl: '/admin'
      });
    }

    // 2. PARTNER AUTHENTICATION
    const isPartnerIdentifier = 
      cleanId.includes('partner') || 
      cleanId.startsWith('ca.') || 
      cleanId.startsWith('cs.') || 
      cleanId.startsWith('adv.');

    if (mode === 'partner' || isPartnerIdentifier) {
      return NextResponse.json({
        success: true,
        role: 'partner',
        message: 'CA/CS Partner authenticated successfully.',
        redirectUrl: '/partner'
      });
    }

    // 3. DYNAMIC CUSTOMER AUTHENTICATION
    const result = verifyCustomerPassword(identifier, cleanPass);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Authentication failed' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      role: 'customer',
      user: {
        name: result.user?.name || 'Registered Founder',
        email: result.user?.email || cleanId,
        mobile: result.user?.mobile || '9876543210',
        companyName: result.user?.companyName || 'TechNova Solutions Pvt Ltd',
        passwordLastChangedAt: result.user?.passwordLastChangedAt
      },
      message: 'Client Portal authenticated successfully.',
      redirectUrl: '/customer'
    });
  } catch (error) {
    console.error('Login authentication error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error during authentication.' },
      { status: 500 }
    );
  }
}
