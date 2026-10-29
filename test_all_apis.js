// Comprehensive Deep API Verification Test Suite for BharatFilings
const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('==================================================');
  console.log('🚀 STARTING DEEP API VERIFICATION SUITE');
  console.log('Target: ' + BASE_URL);
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // -----------------------------------------------------------------
    // TEST 1: GET /api/services
    // -----------------------------------------------------------------
    console.log('--- TEST GROUP 1: /api/services ---');
    const servicesRes = await fetch(`${BASE_URL}/api/services`);
    assert(servicesRes.status === 200, `GET /api/services status 200 (got ${servicesRes.status})`);
    const servicesData = await servicesRes.json();
    assert(servicesData.success === true, 'GET /api/services returned success: true');
    assert(Array.isArray(servicesData.data) && servicesData.data.length > 0, `GET /api/services returned array (${servicesData.data?.length} items)`);

    // TEST 2: GET /api/services/[id]
    const firstService = servicesData.data[0];
    const serviceDetailRes = await fetch(`${BASE_URL}/api/services/${firstService.id}`);
    assert(serviceDetailRes.status === 200, `GET /api/services/${firstService.id} status 200`);
    const serviceDetail = await serviceDetailRes.json();
    assert(serviceDetail.data?.id === firstService.id, `GET /api/services/[id] matched ID: ${firstService.id}`);

    // TEST 3: POST /api/services (Upsert / Update pricing)
    const updatedFee = firstService.baseFee + 100;
    const postServiceRes = await fetch(`${BASE_URL}/api/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...firstService, baseFee: updatedFee })
    });
    assert(postServiceRes.status === 200, `POST /api/services status 200 (got ${postServiceRes.status})`);
    const postServiceData = await postServiceRes.json();
    assert(postServiceData.success === true, 'POST /api/services returned success: true');
    assert(postServiceData.data?.baseFee === updatedFee, `POST /api/services persisted baseFee ${updatedFee}`);

    // Revert service baseFee back
    await fetch(`${BASE_URL}/api/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(firstService)
    });

    // -----------------------------------------------------------------
    // TEST GROUP 2: /api/orders
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 2: /api/orders ---');
    const ordersRes = await fetch(`${BASE_URL}/api/orders`);
    assert(ordersRes.status === 200, `GET /api/orders status 200 (got ${ordersRes.status})`);
    const ordersData = await ordersRes.json();
    assert(ordersData.success === true, 'GET /api/orders success: true');
    assert(Array.isArray(ordersData.data), `GET /api/orders returned ${ordersData.data?.length} orders`);

    // TEST 5: POST /api/orders with invalid body (Validation check)
    const invalidOrderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert(invalidOrderRes.status === 400, `POST /api/orders rejects invalid payload with 400 (got ${invalidOrderRes.status})`);

    // TEST 6: POST /api/orders (Valid creation)
    const testOrderPayload = {
      auth: {
        mobile: '9820099999',
        email: 'deepcheck@bharatfilings.com',
        name: 'Deep Test Founder',
        isVerified: true
      },
      company: {
        entityType: 'pvt_ltd',
        stateCode: 'MH',
        authorizedCapital: 1000000,
        directorCount: 2,
        primaryName: 'Deep Test Innovations Private Limited',
        industry: 'it'
      },
      directors: [
        {
          id: 'dir-deep-1',
          fullName: 'Deep Test Founder',
          panNumber: 'ABCDE1234F',
          isDigiLockerVerified: true
        }
      ],
      pricing: {
        baseFee: 2499,
        stampDuty: 1000,
        rocFee: 0,
        dscFee: 1200,
        taxableSubtotal: 3699,
        gstAmount: 666,
        totalAmount: 5365
      },
      paymentStatus: 'success',
      paymentMethod: 'Test Card'
    };

    const createOrderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrderPayload)
    });
    assert(createOrderRes.status === 201, `POST /api/orders created new order with 201 (got ${createOrderRes.status})`);
    const createdOrderData = await createOrderRes.json();
    const createdOrderId = createdOrderData.data?.orderId;
    assert(!!createdOrderId, `Created order generated orderId: ${createdOrderId}`);

    // TEST 7: GET /api/orders/[id]
    const getSingleOrderRes = await fetch(`${BASE_URL}/api/orders/${createdOrderId}`);
    assert(getSingleOrderRes.status === 200, `GET /api/orders/${createdOrderId} status 200`);
    const singleOrder = await getSingleOrderRes.json();
    assert(singleOrder.data?.orderId === createdOrderId, `GET /api/orders/[id] retrieved correct orderId`);

    // TEST 8: PATCH /api/orders (Root PATCH used by Admin Dashboard)
    const patchRootOrderRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: createdOrderId,
        assignedPartner: 'CA Manish Agrawal (FCA #08291)',
        status: 'Drafting MoA/AoA'
      })
    });
    assert(patchRootOrderRes.status === 200, `PATCH /api/orders status 200 (got ${patchRootOrderRes.status})`);
    const patchRootData = await patchRootOrderRes.json();
    assert(patchRootData.data?.assignedPartner === 'CA Manish Agrawal (FCA #08291)', 'PATCH /api/orders assigned partner correctly');
    assert(patchRootData.data?.status === 'Drafting MoA/AoA', 'PATCH /api/orders updated status correctly');

    // TEST 9: PATCH /api/orders/[id] (Dynamic route PATCH used by Customer Portal)
    const patchDynOrderRes = await fetch(`${BASE_URL}/api/orders/${createdOrderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        docsPending: 'None (All Verified)',
        certificateUploaded: true,
        status: 'Incorporated / COI Released'
      })
    });
    assert(patchDynOrderRes.status === 200, `PATCH /api/orders/${createdOrderId} status 200`);
    const patchDynData = await patchDynOrderRes.json();
    assert(patchDynData.data?.certificateUploaded === true, 'PATCH /api/orders/[id] released certificate');

    // TEST 10: GET /api/orders with mobile filter
    const filterMobileRes = await fetch(`${BASE_URL}/api/orders?mobile=9820099999`);
    const filterMobileData = await filterMobileRes.json();
    assert(filterMobileData.data?.some(o => o.orderId === createdOrderId), 'GET /api/orders?mobile=... found order');

    // -----------------------------------------------------------------
    // TEST GROUP 3: /api/callbacks (Consultation Leads)
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 3: /api/callbacks ---');
    const callbacksRes = await fetch(`${BASE_URL}/api/callbacks`);
    assert(callbacksRes.status === 200, `GET /api/callbacks status 200`);
    const callbacksData = await callbacksRes.json();
    assert(callbacksData.success === true, 'GET /api/callbacks success: true');

    // Create lead
    const postLeadRes = await fetch(`${BASE_URL}/api/callbacks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Deep Check Applicant',
        mobile: '9820088888',
        service: 'One Person Company (OPC)',
        city: 'Hyderabad'
      })
    });
    assert(postLeadRes.status === 201, `POST /api/callbacks created lead with 201`);
    const leadData = await postLeadRes.json();
    const leadId = leadData.data?.id;
    assert(!!leadId, `Created lead ID: ${leadId}`);

    // Update lead status
    const patchLeadRes = await fetch(`${BASE_URL}/api/callbacks`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: leadId,
        status: 'Contacted'
      })
    });
    assert(patchLeadRes.status === 200, `PATCH /api/callbacks status 200`);
    const patchLeadData = await patchLeadRes.json();
    assert(patchLeadData.data?.status === 'Contacted', `Lead status updated to Contacted`);

    // -----------------------------------------------------------------
    // TEST GROUP 4: /api/partners (Partners & Payouts)
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 4: /api/partners ---');
    const partnersRes = await fetch(`${BASE_URL}/api/partners`);
    assert(partnersRes.status === 200, `GET /api/partners status 200`);
    const partnersData = await partnersRes.json();
    assert(partnersData.success === true, 'GET /api/partners success: true');
    assert(Array.isArray(partnersData.data?.partners), 'GET /api/partners returned partners list');
    assert(Array.isArray(partnersData.data?.payouts), 'GET /api/partners returned payouts list');

    // Process single payout
    const samplePayout = partnersData.data?.payouts[0];
    if (samplePayout) {
      const payoutRes = await fetch(`${BASE_URL}/api/partners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'process_payout',
          payoutId: samplePayout.id
        })
      });
      assert(payoutRes.status === 200, `POST /api/partners (process_payout) status 200`);
      const payoutData = await payoutRes.json();
      assert(payoutData.data?.status === 'Processed', `Payout ${samplePayout.id} processed`);
    }

    // Process all payouts
    const allPayoutsRes = await fetch(`${BASE_URL}/api/partners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'process_all_payouts' })
    });
    assert(allPayoutsRes.status === 200, `POST /api/partners (process_all_payouts) status 200`);

    // -----------------------------------------------------------------
    // TEST GROUP 5: /api/tickets (Customer Support Desk)
    // -----------------------------------------------------------------
    console.log('\n--- TEST GROUP 5: /api/tickets ---');
    const ticketsRes = await fetch(`${BASE_URL}/api/tickets`);
    assert(ticketsRes.status === 200, `GET /api/tickets status 200`);
    const ticketsData = await ticketsRes.json();
    assert(ticketsData.success === true, 'GET /api/tickets success: true');

    // Create ticket
    const postTicketRes = await fetch(`${BASE_URL}/api/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'Deep Check Client',
        subject: 'Deep API Test Ticket Verification',
        category: 'Statutory Verification',
        message: 'Validating end-to-end API response contract.'
      })
    });
    assert(postTicketRes.status === 201, `POST /api/tickets status 201`);
    const ticketData = await postTicketRes.json();
    const ticketId = ticketData.data?.id;
    assert(!!ticketId, `Ticket created with ID: ${ticketId}`);

    // Update ticket
    const patchTicketRes = await fetch(`${BASE_URL}/api/tickets`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: ticketId,
        status: 'Resolved'
      })
    });
    assert(patchTicketRes.status === 200, `PATCH /api/tickets status 200`);
    const patchTicketData = await patchTicketRes.json();
    assert(patchTicketData.data?.status === 'Resolved', 'Ticket status updated to Resolved');

    // -----------------------------------------------------------------
    // SUMMARY
    // -----------------------------------------------------------------
    console.log('\n==================================================');
    console.log(`📊 FINAL TEST REPORT: ${passed} PASSED / ${failed} FAILED`);
    console.log('==================================================');

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('Test execution error:', error);
    process.exit(1);
  }
}

runTests();
