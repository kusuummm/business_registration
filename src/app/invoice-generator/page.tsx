'use client';

import React, { useState, useMemo } from 'react';
import Header from '@/components/Header';
import { 
  Receipt, 
  Plus, 
  Trash2, 
  Printer, 
  Copy, 
  Check, 
  Building2, 
  FileCheck2, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { GST_STATE_CODES } from '@/data/gstinData';

interface InvoiceItem {
  id: string;
  description: string;
  hsn: string;
  qty: number;
  rate: number;
  gstRate: number; // e.g. 18 for 18%
}

export default function InvoiceGeneratorPage() {
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-0042');
  const [invoiceDate, setInvoiceDate] = useState('2026-11-01');
  const [dueDate, setDueDate] = useState('2026-11-15');

  // Seller Details
  const [sellerName, setSellerName] = useState('Apex Corporate Cloud Private Limited');
  const [sellerGstin, setSellerGstin] = useState('27AAACR1234M1Z5');
  const [sellerStateCode, setSellerStateCode] = useState('27');
  const [sellerAddress, setSellerAddress] = useState('Level 4, Nariman Point, Mumbai, Maharashtra 400021');

  // Buyer Details
  const [buyerName, setBuyerName] = useState('TechVentures Digital LLP');
  const [buyerGstin, setBuyerGstin] = useState('29AABCF9876K1Z2');
  const [buyerStateCode, setBuyerStateCode] = useState('29');
  const [buyerAddress, setBuyerAddress] = useState('Indiranagar 100ft Road, Bengaluru, Karnataka 560038');

  // Bank Details
  const [bankName, setBankName] = useState('ICICI Bank Limited');
  const [bankAccountNo, setBankAccountNo] = useState('001105029384');
  const [bankIfsc, setBankIfsc] = useState('ICIC0000011');
  const [upiId, setUpiId] = useState('corporatecloud@icici');

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      description: 'Cloud Infrastructure Architecture & SaaS Consulting',
      hsn: '998313',
      qty: 1,
      rate: 75000,
      gstRate: 18
    },
    {
      id: '2',
      description: 'Annual Corporate Compliance & Secretarial Retainer',
      hsn: '998221',
      qty: 1,
      rate: 25000,
      gstRate: 18
    }
  ]);

  const isIntraState = sellerStateCode === buyerStateCode;

  const calculation = useMemo(() => {
    let subtotal = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;

    items.forEach((item) => {
      const lineTaxable = item.qty * item.rate;
      subtotal += lineTaxable;

      if (isIntraState) {
        const halfRate = item.gstRate / 2;
        totalCgst += (lineTaxable * halfRate) / 100;
        totalSgst += (lineTaxable * halfRate) / 100;
      } else {
        totalIgst += (lineTaxable * item.gstRate) / 100;
      }
    });

    const grandTotal = Math.round(subtotal + totalCgst + totalSgst + totalIgst);

    return {
      subtotal,
      totalCgst,
      totalSgst,
      totalIgst,
      grandTotal
    };
  }, [items, isIntraState]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        description: 'New Professional Service / Product',
        hsn: '998313',
        qty: 1,
        rate: 10000,
        gstRate: 18
      }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, val: any) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: val } : it))
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900">
      <div className="print:hidden">
        <Header />
      </div>

      {/* Hero Banner (hidden in print) */}
      <section className="print:hidden bg-gradient-to-b from-blue-50/80 via-teal-50/30 to-white border-b border-slate-200 py-10 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-900 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>GSTN Compliant Tax Invoicing • Auto CGST/SGST/IGST Decomposition</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Startup GST Invoicing & Billing Suite
          </h1>

          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            Generate print-ready, CBIC-compliant GST Tax Invoices. Automatically detects inter-state vs intra-state supply, computes tax splits, and embeds bank payment details.
          </p>
        </div>
      </section>

      {/* Main Studio Container */}
      <main className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 flex-1 space-y-8">
        {/* Action Bar (hidden in print) */}
        <div className="print:hidden flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
              isIntraState 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}>
              {isIntraState 
                ? `Intra-State Supply (CGST + SGST) • ${GST_STATE_CODES[sellerStateCode] || 'State'}`
                : `Inter-State Supply (IGST) • ${GST_STATE_CODES[sellerStateCode]} to ${GST_STATE_CODES[buyerStateCode]}`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={addItem}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Line Item</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md shadow-emerald-600/20 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* PRINTABLE GST INVOICE SHEET                               */}
        {/* ========================================================= */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-sm space-y-8 text-xs text-slate-800 font-sans print:border-none print:p-0 print:shadow-none">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-slate-900">
            <div className="space-y-1.5 max-w-md">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600">
                TAX INVOICE
              </span>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {sellerName}
              </h2>
              <p className="text-slate-600 leading-relaxed">
                {sellerAddress}
              </p>
              <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px]">
                <span><strong>GSTIN:</strong> {sellerGstin}</span>
                <span><strong>State:</strong> {GST_STATE_CODES[sellerStateCode]} ({sellerStateCode})</span>
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="sm:text-right space-y-1 font-mono text-xs shrink-0">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-left sm:text-right">
                <div><span className="text-slate-500">Invoice No:</span> <strong className="text-slate-900 text-sm">{invoiceNumber}</strong></div>
                <div><span className="text-slate-500">Invoice Date:</span> <strong className="text-slate-900">{invoiceDate}</strong></div>
                <div><span className="text-slate-500">Due Date:</span> <strong className="text-slate-900">{dueDate}</strong></div>
                <div><span className="text-slate-500">Place of Supply:</span> <strong className="text-slate-900">{GST_STATE_CODES[buyerStateCode]}</strong></div>
              </div>
            </div>
          </div>

          {/* B2B Parties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-slate-50/70 rounded-xl border border-slate-200">
            {/* Bill To */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 block">
                BILLED TO (BUYER / RECIPIENT)
              </span>
              <div className="font-extrabold text-sm text-slate-900">{buyerName}</div>
              <p className="text-slate-600">{buyerAddress}</p>
              <div className="font-mono text-[11px] pt-1 space-y-0.5">
                <div><strong>GSTIN:</strong> {buyerGstin}</div>
                <div><strong>State:</strong> {GST_STATE_CODES[buyerStateCode]} ({buyerStateCode})</div>
              </div>
            </div>

            {/* Editable Controls (hidden when printing) */}
            <div className="print:hidden space-y-2 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Quick Editor Controls
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <label className="text-slate-500 block">Seller State</label>
                  <select
                    value={sellerStateCode}
                    onChange={(e) => setSellerStateCode(e.target.value)}
                    className="w-full p-1.5 border border-slate-300 rounded font-bold"
                  >
                    {Object.entries(GST_STATE_CODES).map(([code, name]) => (
                      <option key={code} value={code}>{code} - {name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 block">Buyer State</label>
                  <select
                    value={buyerStateCode}
                    onChange={(e) => setBuyerStateCode(e.target.value)}
                    className="w-full p-1.5 border border-slate-300 rounded font-bold"
                  >
                    {Object.entries(GST_STATE_CODES).map(([code, name]) => (
                      <option key={code} value={code}>{code} - {name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Line Items */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 bg-slate-100 text-[11px] font-black uppercase text-slate-700">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Description of Goods / Services</th>
                  <th className="py-2.5 px-3 font-mono">HSN/SAC</th>
                  <th className="py-2.5 px-3 text-right">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate (₹)</th>
                  <th className="py-2.5 px-3 text-center">GST %</th>
                  <th className="py-2.5 px-3 text-right">Taxable Amt (₹)</th>
                  <th className="py-2.5 px-2 print:hidden"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                {items.map((it, idx) => {
                  const lineTotal = it.qty * it.rate;
                  return (
                    <tr key={it.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-mono text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <input
                          type="text"
                          value={it.description}
                          onChange={(e) => updateItem(it.id, 'description', e.target.value)}
                          className="w-full bg-transparent border-none font-bold text-slate-900 p-0 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <input
                          type="text"
                          value={it.hsn}
                          onChange={(e) => updateItem(it.id, 'hsn', e.target.value)}
                          className="w-16 bg-transparent border-none text-slate-600 p-0 focus:outline-none font-mono"
                        />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          min={1}
                          value={it.qty}
                          onChange={(e) => updateItem(it.id, 'qty', Number(e.target.value))}
                          className="w-12 bg-transparent border-none text-right font-mono p-0 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        <input
                          type="number"
                          step={500}
                          value={it.rate}
                          onChange={(e) => updateItem(it.id, 'rate', Number(e.target.value))}
                          className="w-24 bg-transparent border-none text-right font-mono p-0 focus:outline-none"
                        />
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        <select
                          value={it.gstRate}
                          onChange={(e) => updateItem(it.id, 'gstRate', Number(e.target.value))}
                          className="bg-transparent border-none text-center font-bold p-0 focus:outline-none cursor-pointer"
                        >
                          <option value={0}>0%</option>
                          <option value={5}>5%</option>
                          <option value={12}>12%</option>
                          <option value={18}>18%</option>
                          <option value={28}>28%</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        ₹{lineTotal.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-2 print:hidden text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(it.id)}
                          disabled={items.length <= 1}
                          className="text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Totals & Tax Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-4 border-t-2 border-slate-900">
            {/* Left: Bank Information & Note */}
            <div className="sm:col-span-7 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-black text-slate-500 block">
                  BANK REMITTANCE & UPI DETAILS
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div><span className="text-slate-500">Bank:</span> <strong>{bankName}</strong></div>
                  <div><span className="text-slate-500">Account No:</span> <strong>{bankAccountNo}</strong></div>
                  <div><span className="text-slate-500">IFSC:</span> <strong>{bankIfsc}</strong></div>
                  <div><span className="text-slate-500">UPI VPA:</span> <strong>{upiId}</strong></div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed">
                <strong>Declaration:</strong> We declare that this invoice shows the actual price of the goods or services described and that all particulars are true and correct. Output tax is declared under Section 31 of the CGST Act, 2017.
              </div>
            </div>

            {/* Right: Calculations Breakdown */}
            <div className="sm:col-span-5 space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 text-slate-600">
                <span>Taxable Amount:</span>
                <span>₹{calculation.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {isIntraState ? (
                <>
                  <div className="flex justify-between py-1 text-slate-600">
                    <span>Central GST (CGST):</span>
                    <span>₹{calculation.totalCgst.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-600">
                    <span>State GST (SGST):</span>
                    <span>₹{calculation.totalSgst.toLocaleString('en-IN')}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Integrated GST (IGST):</span>
                  <span>₹{calculation.totalIgst.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-baseline text-sm font-black text-slate-900">
                <span>Total Invoice Value:</span>
                <span className="text-xl text-emerald-700">₹{calculation.grandTotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-4 text-right print:pt-12">
                <div className="inline-block text-center space-y-1">
                  <div className="w-44 border-b border-slate-900 pb-8 text-[10px] text-slate-400">
                    Authorised Signatory
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 block">
                    For {sellerName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
