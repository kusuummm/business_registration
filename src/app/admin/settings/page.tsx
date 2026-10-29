'use client';

import React, { useState, useEffect } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Settings, 
  ShieldCheck, 
  CheckCircle2, 
  KeyRound, 
  Server, 
  Bell, 
  Lock, 
  Database,
  Save,
  RefreshCw,
  Landmark,
  Building2,
  Mail,
  Phone,
  MessageSquare,
  Check,
  AlertTriangle,
  Download,
  Copy,
  Eye,
  EyeOff,
  Cpu,
  Clock,
  Sliders,
  FileText,
  Users,
  Globe,
  Radio,
  FileCheck,
  Palette,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';
import { DEFAULT_SETTINGS, PlatformSettings } from '@/data/settingsData';
import { 
  ADMIN_PRESET_COLORS, 
  getAdminPresetTheme, 
  computeAdminThemeColors, 
  createAdminCustomTheme, 
  AdminThemeConfig,
  AdminPresetColorDef,
  DEFAULT_ADMIN_THEME 
} from '@/components/AdminThemeWrapper';

type SettingsTab = 'general' | 'theme' | 'verification' | 'gateways' | 'payments' | 'notifications' | 'security';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [formData, setFormData] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedBanner, setSavedBanner] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Visibility toggles for sensitive credentials
  const [showRazorpaySecret, setShowRazorpaySecret] = useState(false);
  const [showDigilockerSecret, setShowDigilockerSecret] = useState(false);
  const [showWhatsappToken, setShowWhatsappToken] = useState(false);

  // Gateway test state
  const [isTestingMca, setIsTestingMca] = useState(false);
  const [mcaTestResult, setMcaTestResult] = useState<{ status: string; latency: number; msg: string } | null>(null);

  // Email test state
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState<string | null>(null);

  // Export backup state
  const [isExporting, setIsExporting] = useState(false);

  // Admin Theme & Appearance State (Curated Executive Options)
  const [selectedAdminTheme, setSelectedAdminTheme] = useState<string>('navy');
  const [adminDarknessLevel, setAdminDarknessLevel] = useState<number>(80);
  const [adminCustomHex, setAdminCustomHex] = useState<string>('#0f172a');
  const [currentAdminThemeConfig, setCurrentAdminThemeConfig] = useState<AdminThemeConfig>(DEFAULT_ADMIN_THEME);

  // Load Admin Theme on Mount
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('bharatfilings_admin_theme');
      const storedDarkness = localStorage.getItem('bharatfilings_admin_darkness');
      const customBg = localStorage.getItem('bharatfilings_admin_bg_color');

      const initialDarkness = storedDarkness !== null ? parseInt(storedDarkness, 10) : 80;
      setAdminDarknessLevel(initialDarkness);

      if (storedTheme === 'custom' && customBg) {
        setSelectedAdminTheme('custom');
        setAdminCustomHex(customBg);
        setCurrentAdminThemeConfig(createAdminCustomTheme(customBg, initialDarkness));
      } else if (storedTheme) {
        setSelectedAdminTheme(storedTheme);
        setCurrentAdminThemeConfig(getAdminPresetTheme(storedTheme, initialDarkness));
      } else {
        setSelectedAdminTheme('navy');
        setCurrentAdminThemeConfig(getAdminPresetTheme('navy', 80));
      }
    } catch {}
  }, []);

  const handleAdminDarknessChange = (newDarkness: number) => {
    setAdminDarknessLevel(newDarkness);
    let updatedConfig: AdminThemeConfig;

    if (selectedAdminTheme === 'custom') {
      updatedConfig = createAdminCustomTheme(adminCustomHex, newDarkness);
    } else {
      updatedConfig = getAdminPresetTheme(selectedAdminTheme, newDarkness);
    }

    setCurrentAdminThemeConfig(updatedConfig);
    try {
      localStorage.setItem('bharatfilings_admin_darkness', String(newDarkness));
      localStorage.setItem('bharatfilings_admin_bg_color', updatedConfig.surfaceBg);
      window.dispatchEvent(new CustomEvent('bf_admin_theme_change', { detail: { themeConfig: updatedConfig } }));
    } catch (err) {
      console.error('Failed to update admin darkness:', err);
    }
  };

  const handleSelectAdminPreset = (preset: AdminPresetColorDef) => {
    setSelectedAdminTheme(preset.id);
    let targetDarkness = adminDarknessLevel;
    if (preset.id === 'white' && adminDarknessLevel > 30) {
      targetDarkness = 0;
    } else if (preset.id !== 'white' && adminDarknessLevel <= 30) {
      targetDarkness = preset.defaultDarkness;
    }

    setAdminDarknessLevel(targetDarkness);
    const updatedConfig = computeAdminThemeColors(
      preset.id,
      preset.name,
      preset.hue,
      preset.sat,
      preset.primary,
      targetDarkness
    );
    setCurrentAdminThemeConfig(updatedConfig);

    try {
      localStorage.setItem('bharatfilings_admin_theme', preset.id);
      localStorage.setItem('bharatfilings_admin_darkness', String(targetDarkness));
      localStorage.setItem('bharatfilings_admin_bg_color', updatedConfig.surfaceBg);
      window.dispatchEvent(new CustomEvent('bf_admin_theme_change', { detail: { themeConfig: updatedConfig } }));
      setSavedBanner(`Admin theme switched to "${preset.name}" (${targetDarkness}% darkness).`);
      setTimeout(() => setSavedBanner(''), 4000);
    } catch (err) {
      console.error('Failed to save admin preset:', err);
    }
  };

  const handleApplyAdminCustomColor = (hex: string) => {
    setAdminCustomHex(hex);
    setSelectedAdminTheme('custom');
    const customConfig = createAdminCustomTheme(hex, adminDarknessLevel);
    setCurrentAdminThemeConfig(customConfig);
    try {
      localStorage.setItem('bharatfilings_admin_theme', 'custom');
      localStorage.setItem('bharatfilings_admin_bg_color', hex);
      localStorage.setItem('bharatfilings_admin_darkness', String(adminDarknessLevel));
      window.dispatchEvent(new CustomEvent('bf_admin_theme_change', { detail: { themeConfig: customConfig } }));
      setSavedBanner(`Custom admin color applied (${hex}) at ${adminDarknessLevel}% darkness.`);
      setTimeout(() => setSavedBanner(''), 4000);
    } catch (err) {
      console.error('Failed to save admin custom color:', err);
    }
  };

  // Fetch live settings on mount
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setFormData(json.data);
        }
      })
      .catch((err) => {
        console.error('Failed to load settings:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleChange = (field: keyof PlatformSettings, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSavedBanner('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSavedBanner('Settings saved and synchronized with BharatFilings secure configuration vault.');
        setTimeout(() => setSavedBanner(''), 5000);
      }
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Test MCA Gateway Connectivity
  const handleTestMca = async () => {
    setIsTestingMca(true);
    setMcaTestResult(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_mca', endpoint: formData.mcaGatewayEndpoint })
      });
      const data = await res.json();
      if (data.success) {
        setMcaTestResult({
          status: 'CONNECTED (200 OK)',
          latency: data.latencyMs,
          msg: data.message
        });
      }
    } catch (err) {
      setMcaTestResult({
        status: 'FAILED',
        latency: 0,
        msg: 'Connection to MCA V3 CRC Gateway timed out.'
      });
    } finally {
      setIsTestingMca(false);
    }
  };

  // Test Transactional Email
  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    setEmailTestResult(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_email', email: formData.supportEmail })
      });
      const data = await res.json();
      if (data.success) {
        setEmailTestResult(`Test email delivered to ${formData.supportEmail} via ${formData.emailSmtpHost}`);
        setTimeout(() => setEmailTestResult(null), 6000);
      }
    } catch (err) {
      setEmailTestResult('Failed to deliver test email. Verify SMTP credentials.');
    } finally {
      setIsTestingEmail(false);
    }
  };

  // Export Full Platform Backup
  const handleExportBackup = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'export_backup' })
      });
      const data = await res.json();
      if (data.success && data.data) {
        const jsonStr = JSON.stringify(data.data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `BharatFilings_System_Backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Backup export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const segoeStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'general', label: 'General & Profile', icon: Building2 },
    { id: 'theme', label: 'Theme & Appearance', icon: Palette, badge: 'Color' },
    { id: 'verification', label: 'Document QC & Rules', icon: FileCheck, badge: 'Crucial' },
    { id: 'gateways', label: 'Govt & API Gateways', icon: Server },
    { id: 'payments', label: 'Payments & Escrow', icon: Landmark },
    { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
    { id: 'security', label: 'Security & Backup', icon: Lock }
  ];

  return (
    <div style={segoeStyle} className="h-screen max-h-screen overflow-hidden bg-slate-100 flex flex-col text-slate-900">
      {/* Top Navbar */}
      <AdminNavbar currentTitle="Platform Settings & Governance" />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-row min-w-0 overflow-hidden">
        <AdminSidebar activeItem="settings" />

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overscroll-contain custom-scrollbar">
          {/* Action Header Banner */}
          <div className="bg-white border-b border-slate-200 px-6 py-5">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
                    System Configuration
                  </span>
                  <span className="text-[12px] text-slate-500 font-medium">
                    Root Tier-1 Control
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    AES-256 Vault Active
                  </span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Platform Settings & Statutory Configuration
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage Ministry filing endpoints, Document QC verification parameters, payment gateways, and DPDP compliance rules.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  disabled={isExporting}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  title="Export complete system database as JSON backup"
                >
                  <Download className={`w-3.5 h-3.5 text-slate-600 ${isExporting ? 'animate-bounce' : ''}`} />
                  <span>{isExporting ? 'Exporting...' : 'Export Snapshot'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSave()}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-60"
                >
                  <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
                  <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
                </button>
              </div>
            </div>

            {/* Segmented Tab Navigation Bar */}
            <div className="max-w-6xl mx-auto mt-6 pt-3 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider ${
                        isActive ? 'bg-amber-400 text-slate-900' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Success Notification Alert */}
          {savedBanner && (
            <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-medium py-2.5 px-6 flex items-center justify-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{savedBanner}</span>
            </div>
          )}

          {/* Main Content Workspace Form */}
          <main className="max-w-6xl mx-auto w-full py-6 px-4 sm:px-6">
            <form onSubmit={handleSave} className="space-y-6">

              {/* ======================================================== */}
              {/* TAB 1: GENERAL & CORPORATE PROFILE                       */}
              {/* ======================================================== */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  {/* Card 1: Official Corporate Identity */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                        <Building2 className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Official Company Profile & Statutory Credentials</h3>
                        <p className="text-xs text-slate-500">Corporate identity details stamped on client invoices, MOA/AOA drafts, and statutory filing covers.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">Company Registered Legal Name</label>
                        <input
                          type="text"
                          value={formData.companyLegalName}
                          onChange={(e) => handleChange('companyLegalName', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Corporate Identification Number (CIN)</label>
                        <input
                          type="text"
                          value={formData.cin}
                          onChange={(e) => handleChange('cin', e.target.value)}
                          className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs uppercase focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">GSTIN Identification Number</label>
                        <input
                          type="text"
                          value={formData.gstin}
                          onChange={(e) => handleChange('gstin', e.target.value)}
                          className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs uppercase focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Corporate PAN</label>
                        <input
                          type="text"
                          value={formData.pan}
                          onChange={(e) => handleChange('pan', e.target.value)}
                          className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs uppercase focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Corporate TAN (TDS Number)</label>
                        <input
                          type="text"
                          value={formData.tan}
                          onChange={(e) => handleChange('tan', e.target.value)}
                          className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs uppercase focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">Registered Headquarters Address</label>
                        <textarea
                          rows={2}
                          value={formData.registeredAddress}
                          onChange={(e) => handleChange('registeredAddress', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Operations & Invoicing Configuration */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                        <Sliders className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Support Helpdesks & Invoicing Parameters</h3>
                        <p className="text-xs text-slate-500">Customer communication channels, default timezone, and order numbering format.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Support Phone Helpline</label>
                        <input
                          type="text"
                          value={formData.supportPhone}
                          onChange={(e) => handleChange('supportPhone', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Support Official Email</label>
                        <input
                          type="email"
                          value={formData.supportEmail}
                          onChange={(e) => handleChange('supportEmail', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">WhatsApp Advisory Number</label>
                        <input
                          type="text"
                          value={formData.whatsappSupportNumber}
                          onChange={(e) => handleChange('whatsappSupportNumber', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Order & Invoice Prefix</label>
                        <input
                          type="text"
                          value={formData.invoicePrefix}
                          onChange={(e) => handleChange('invoicePrefix', e.target.value)}
                          className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-bold focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Financial Year Cycle</label>
                        <select
                          value={formData.financialYear}
                          onChange={(e) => handleChange('financialYear', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
                        >
                          <option value="2025-26">FY 2025-26</option>
                          <option value="2026-27">FY 2026-27 (Current)</option>
                          <option value="2027-28">FY 2027-28</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Standard Billing Currency</label>
                        <input
                          type="text"
                          value={formData.currency}
                          disabled
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 text-xs font-bold cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 2: THEME & COLOR CUSTOMIZATION (ADMIN DESK)          */}
              {/* ======================================================== */}
              {activeTab === 'theme' && (
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-7">
                  {/* Header */}
                  <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Palette className="w-4 h-4 text-blue-600" />
                        <span>Admin Console Theme & Executive Appearance</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Customize the operational color theme and luminance for the Super Admin Desk. Select from 6 curated enterprise dark palettes or calibrate with the slider.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                        Active: {currentAdminThemeConfig.name}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                        {adminDarknessLevel}% Darkness
                      </span>
                    </div>
                  </div>

                  {/* FEATURE 1: DARK MODE & CONTRAST INTENSITY SLIDER */}
                  <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
                          {adminDarknessLevel > 30 ? (
                            <Moon className="w-4 h-4" />
                          ) : (
                            <Sun className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                            <span>Console Dark Mode & Luminance Slider</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                              Continuous Control
                            </span>
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Regulate ambient background depth, table contrast, and elevation across all admin console views.
                          </span>
                        </div>
                      </div>

                      {/* Live Mode Readout Tag */}
                      <div className="shrink-0">
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                          adminDarknessLevel >= 85
                            ? 'bg-slate-950 text-white border-slate-800'
                            : adminDarknessLevel >= 50
                            ? 'bg-indigo-900 text-indigo-100 border-indigo-700'
                            : adminDarknessLevel >= 31
                            ? 'bg-blue-900 text-blue-100 border-blue-700'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}>
                          <Sparkles className="w-3 h-3" />
                          <span>
                            {adminDarknessLevel >= 85
                              ? `🌌 Ultra Midnight Dark (${adminDarknessLevel}%)`
                              : adminDarknessLevel >= 50
                              ? `🌙 Deep Dark Mode (${adminDarknessLevel}%)`
                              : adminDarknessLevel >= 31
                              ? `🌗 Balanced Medium (${adminDarknessLevel}%)`
                              : `☀️ Daytime Light (${adminDarknessLevel}%)`}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Range Slider Track */}
                    <div className="space-y-2 pt-1">
                      <div className="relative flex items-center">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="1"
                          value={adminDarknessLevel}
                          onChange={(e) => handleAdminDarknessChange(Number(e.target.value))}
                          className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none shadow-inner"
                          style={{
                            background: 'linear-gradient(to right, #ffffff 0%, #93c5fd 25%, #2563eb 50%, #1e293b 75%, #030712 100%)'
                          }}
                        />
                      </div>

                      {/* Scale Markings */}
                      <div className="flex justify-between text-[10px] font-mono font-semibold text-slate-500 px-1">
                        <span>0% (Daytime Light)</span>
                        <span>25% (Soft Tint)</span>
                        <span>50% (Balanced)</span>
                        <span>75% (Deep Dark)</span>
                        <span>100% (Pitch Black)</span>
                      </div>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] font-bold text-slate-600 mr-1">Quick Levels:</span>
                      
                      <button
                        type="button"
                        onClick={() => handleAdminDarknessChange(0)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                          adminDarknessLevel === 0
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        ☀️ Light (0%)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdminDarknessChange(25)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                          adminDarknessLevel === 25
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        🌤️ Soft (25%)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdminDarknessChange(50)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                          adminDarknessLevel === 50
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        🌗 Balanced (50%)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdminDarknessChange(80)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                          adminDarknessLevel === 80
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        🌙 Deep Dark (80%) ★
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAdminDarknessChange(98)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                          adminDarknessLevel >= 95
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        🌌 Pitch Black (100%)
                      </button>
                    </div>
                  </div>

                  {/* FEATURE 2: 6 CURATED EXECUTIVE COLOR PALETTES */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-bold text-slate-800 block">
                          Executive Admin Color Palettes (6 Curated Options):
                        </label>
                        <span className="text-[11px] text-slate-500">
                          Curated high-contrast palettes designed for institutional operations and long monitoring sessions.
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        6 Enterprise Options
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {ADMIN_PRESET_COLORS.map((preset) => {
                        const isSelected = selectedAdminTheme === preset.id;
                        const previewTheme = computeAdminThemeColors(
                          preset.id,
                          preset.name,
                          preset.hue,
                          preset.sat,
                          preset.primary,
                          preset.id === 'white' && adminDarknessLevel > 30 ? 0 : adminDarknessLevel
                        );

                        return (
                          <div
                            key={preset.id}
                            onClick={() => handleSelectAdminPreset(preset)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-150 flex flex-col justify-between gap-3 ${
                              isSelected
                                ? 'ring-2 ring-blue-500 shadow-md scale-[1.01]'
                                : 'hover:scale-[1.01] hover:shadow-xs'
                            }`}
                            style={{
                              backgroundColor: previewTheme.surfaceBg,
                              borderColor: isSelected ? '#3b82f6' : previewTheme.borderColor,
                              color: previewTheme.textColor
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 min-w-0">
                                <div
                                  className="w-5 h-5 rounded-full shrink-0 shadow-2xs flex items-center justify-center text-white border border-white/20"
                                  style={{ backgroundColor: preset.primary }}
                                >
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className="text-xs font-bold truncate">
                                  {preset.name}
                                </span>
                              </div>

                              {isSelected && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                  ACTIVE
                                </span>
                              )}
                            </div>

                            <div className="space-y-1">
                              <p className="text-[10px] opacity-75 line-clamp-1 leading-tight">
                                {preset.description}
                              </p>
                              <div className="flex items-center justify-between text-[10px] font-mono opacity-65">
                                <span>Hex: {previewTheme.surfaceBg}</span>
                                <span>{previewTheme.isDark ? 'Dark Tone' : 'Light Tone'}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* FEATURE 3: CUSTOM COLOR PICKER */}
                  <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                          <Sliders className="w-3.5 h-3.5 text-blue-600" />
                          <span>Custom Administrator Color Picker</span>
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Pick any custom hex shade. The darkness slider will automatically calibrate surface depth, input wells, and border contrast.
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={adminCustomHex}
                          onChange={(e) => setAdminCustomHex(e.target.value)}
                          className="w-9 h-9 rounded-lg border border-slate-300 p-0.5 cursor-pointer bg-white shrink-0 shadow-2xs"
                          title="Pick custom color"
                        />
                        <input
                          type="text"
                          value={adminCustomHex}
                          onChange={(e) => setAdminCustomHex(e.target.value)}
                          placeholder="#0f172a"
                          className="w-24 px-2.5 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                        />
                        <button
                          type="button"
                          onClick={() => handleApplyAdminCustomColor(adminCustomHex)}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs shrink-0"
                        >
                          Apply Shade
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* FEATURE 4: LIVE ADMIN CONSOLE SURFACE PREVIEW */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 block">
                        Live Admin Console Surface & Contrast Preview:
                      </span>
                      <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                        AAA Contrast Verified
                      </span>
                    </div>

                    <div 
                      className="p-5 rounded-xl border transition-colors duration-150 space-y-3.5 shadow-xs"
                      style={{
                        backgroundColor: currentAdminThemeConfig.surfaceBg,
                        borderColor: currentAdminThemeConfig.borderColor,
                        color: currentAdminThemeConfig.textColor
                      }}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="w-3.5 h-3.5 rounded-full shadow-2xs" 
                            style={{ backgroundColor: currentAdminThemeConfig.primary }}
                          />
                          <span className="text-xs font-bold">
                            Ministry ROC Queue • Form SPICe+ Part B Inspection Desk
                          </span>
                        </div>
                        <span 
                          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
                          style={{
                            backgroundColor: currentAdminThemeConfig.pageBg,
                            borderColor: currentAdminThemeConfig.borderColor,
                            color: currentAdminThemeConfig.textColor
                          }}
                        >
                          {currentAdminThemeConfig.name} • {adminDarknessLevel}% Darkness
                        </span>
                      </div>

                      <p className="text-xs opacity-85 leading-relaxed">
                        All white cards, filing review dockets, tables, and sidebar navigation on the Super Admin Desk are transformed into this {currentAdminThemeConfig.name} background color.
                      </p>

                      <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            style={{ backgroundColor: currentAdminThemeConfig.primary }}
                            className="px-3.5 py-1.5 text-white font-bold rounded-lg text-xs shadow-xs cursor-pointer"
                          >
                            Approve Filing QC
                          </button>
                          <span 
                            className="text-xs px-2.5 py-1 rounded-lg border font-mono text-[11px]"
                            style={{
                              backgroundColor: currentAdminThemeConfig.secondaryBg,
                              borderColor: currentAdminThemeConfig.borderColor
                            }}
                          >
                            Input / Data Grid Area
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] font-mono opacity-80">
                          <span>Surface: <strong>{currentAdminThemeConfig.surfaceBg}</strong></span>
                          <span>Canvas: <strong>{currentAdminThemeConfig.pageBg}</strong></span>
                          <span>Border: <strong>{currentAdminThemeConfig.borderColor}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* ======================================================== */}
              {activeTab === 'verification' && (
                <div className="space-y-6">
                  {/* Card 1: Registration Approval & Document Verification Enforcement */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                        <FileCheck className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">Document Verification & QC Governance</h3>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.2 rounded-full">
                            Active Policy
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">Rules governing mandatory Admin verification before user registrations are confirmed and legally queued.</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      {/* Rule 1: Mandatory Admin Approval */}
                      <div className="flex items-center justify-between p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/80">
                        <div className="pr-4">
                          <span className="font-bold text-amber-950 block text-xs">
                            Enforce Mandatory Admin Document Verification
                          </span>
                          <span className="text-[11px] text-amber-800 mt-0.5 block leading-relaxed">
                            When enabled, newly registered users remain in <strong>&quot;Pending Admin Verification&quot;</strong> status. Their registration will not show as successful or confirmed until an Admin reviews and approves director KYC and address proofs.
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={formData.mandatoryAdminVerification}
                            onChange={(e) => handleChange('mandatoryAdminVerification', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900" />
                        </label>
                      </div>

                      {/* Rule 2: Auto Allocate Counsel */}
                      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="pr-4">
                          <span className="font-bold text-slate-900 block text-xs">
                            Auto-Assign Certified CA/CS Partner on Order Creation
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Automatically allocates incoming filings to verified practicing partners (CS Priya Sharma / CA Manish Agrawal) based on state jurisdiction and bandwidth.
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={formData.autoAssignCounsel}
                            onChange={(e) => handleChange('autoAssignCounsel', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900" />
                        </label>
                      </div>

                      {/* Rule 3: DigiLocker Validation */}
                      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="pr-4">
                          <span className="font-bold text-slate-900 block text-xs">
                            Real-Time DigiLocker e-KYC Verification Gate
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Cross-checks director Aadhaar and PAN numbers against the government DigiLocker sandbox to prevent fabricated KYC uploads.
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={formData.digilockerAutoValidation}
                            onChange={(e) => handleChange('digilockerAutoValidation', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900" />
                        </label>
                      </div>

                      {/* Rule 4: Regulated Names Guard */}
                      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="pr-4">
                          <span className="font-bold text-slate-900 block text-xs">
                            Strict MCA Regulated Words Name Screening
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Flag entity name choices containing restricted words (&quot;Bank&quot;, &quot;Insurance&quot;, &quot;Trust&quot;, &quot;National&quot;, &quot;Chit Fund&quot;) requiring RBI/SEBI regulatory NOCs before admin signoff.
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={formData.flagRegulatedNames}
                            onChange={(e) => handleChange('flagRegulatedNames', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900" />
                        </label>
                      </div>

                      {/* Rule 5: Duplicate KYC Shield */}
                      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="pr-4">
                          <span className="font-bold text-slate-900 block text-xs">
                            Duplicate KYC & Mobile Prevention Shield
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Warn admin if an applicant attempts multiple registrations with the exact same Director PAN or Mobile number within a 14-day window.
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={formData.preventDuplicateKyc}
                            onChange={(e) => handleChange('preventDuplicateKyc', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900" />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Document Aging & Statutory Limits */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                        <Clock className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Document Statutory Validity Limits</h3>
                        <p className="text-xs text-slate-500">Configure MCA legal validity windows for registered office utility bills and address proofs.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Max Acceptable Utility Bill Age (ROC Rule)
                        </label>
                        <select
                          value={formData.maxUtilityBillAgeDays}
                          onChange={(e) => handleChange('maxUtilityBillAgeDays', Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
                        >
                          <option value="30">30 Days (Ultra Strict)</option>
                          <option value="60">60 Days (MCA SPICe+ Standard - Recommended)</option>
                          <option value="90">90 Days (Flexible)</option>
                        </select>
                        <p className="text-[11px] text-slate-400 mt-1">Bills older than this threshold will be flagged as requiring resubmission during Admin QC.</p>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Class-3 DSC Token Expiry Warning
                        </label>
                        <select
                          defaultValue="30"
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
                        >
                          <option value="15">15 Days Before Expiry</option>
                          <option value="30">30 Days Before Expiry (Recommended)</option>
                          <option value="60">60 Days Before Expiry</option>
                        </select>
                        <p className="text-[11px] text-slate-400 mt-1">Alert CA/CS partners when client director DSC USB tokens are nearing renewal.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: GOVT & STATUTORY API GATEWAYS                     */}
              {/* ======================================================== */}
              {activeTab === 'gateways' && (
                <div className="space-y-6">
                  {/* Card 1: MCA V3 CRC Gateway */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                          <Server className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">MCA V3 CRC Gateway Integration</h3>
                          <p className="text-xs text-slate-500">Direct statutory API node for SPICe+ Part A/B automated filing and ROC status callbacks.</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleTestMca}
                        disabled={isTestingMca}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-60"
                      >
                        <Radio className={`w-3.5 h-3.5 text-blue-600 ${isTestingMca ? 'animate-pulse' : ''}`} />
                        <span>{isTestingMca ? 'Pinging Gateway...' : 'Ping Gateway'}</span>
                      </button>
                    </div>

                    {mcaTestResult && (
                      <div className={`p-3 rounded-lg border text-xs mb-4 flex items-center justify-between ${
                        mcaTestResult.status.includes('200')
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-current" />
                          <span className="font-bold">{mcaTestResult.status}</span>
                          <span className="text-slate-600">• {mcaTestResult.msg}</span>
                        </div>
                        <span className="font-mono font-bold">{mcaTestResult.latency} ms</span>
                      </div>
                    )}

                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Production Gateway Endpoint</label>
                        <input
                          type="text"
                          value={formData.mcaGatewayEndpoint}
                          onChange={(e) => handleChange('mcaGatewayEndpoint', e.target.value)}
                          className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Gateway Environment</label>
                          <select
                            value={formData.mcaEnvironment}
                            onChange={(e) => handleChange('mcaEnvironment', e.target.value as any)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
                          >
                            <option value="production">Production (mca.gov.in Official V3)</option>
                            <option value="sandbox">Sandbox / Staging Mock Environment</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Background Sync Frequency</label>
                          <select
                            value={formData.mcaPollingIntervalMinutes}
                            onChange={(e) => handleChange('mcaPollingIntervalMinutes', Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
                          >
                            <option value="5">Every 5 Minutes (Active Polling)</option>
                            <option value="15">Every 15 Minutes (Standard)</option>
                            <option value="30">Every 30 Minutes</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Aadhaar eSign & DigiLocker B2B Node */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                        <KeyRound className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Aadhaar eSign & DigiLocker Partner Credentials</h3>
                        <p className="text-xs text-slate-500">Government identity verification gateway credentials for automated director authentication.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Approved eSign Provider</label>
                        <select
                          value={formData.esignProvider}
                          onChange={(e) => handleChange('esignProvider', e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
                        >
                          <option value="Protean (NSDL)">Protean (Formerly NSDL e-Gov)</option>
                          <option value="eMudhra">eMudhra Consumer Trust Services</option>
                          <option value="C-DAC">C-DAC e-Hastakshar National Node</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">DigiLocker Partner Client ID</label>
                        <input
                          type="text"
                          value={formData.digilockerClientId}
                          onChange={(e) => handleChange('digilockerClientId', e.target.value)}
                          className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">DigiLocker API Secret Key</label>
                        <div className="relative">
                          <input
                            type={showDigilockerSecret ? 'text' : 'password'}
                            value={formData.digilockerClientSecret}
                            onChange={(e) => handleChange('digilockerClientSecret', e.target.value)}
                            className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs pr-10 focus:outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowDigilockerSecret(!showDigilockerSecret)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showDigilockerSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: PAYMENTS & ESCROW SETTLEMENT                      */}
              {/* ======================================================== */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  {/* Card 1: RazorpayX Escrow Credentials */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                        <Landmark className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Payment & Escrow Settlement Gateway (RazorpayX)</h3>
                        <p className="text-xs text-slate-500">Merchant credentials for client payment collection and trustee escrow disbursements to CA/CS counselors.</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Razorpay Key ID</label>
                          <input
                            type="text"
                            value={formData.razorpayKeyId}
                            onChange={(e) => handleChange('razorpayKeyId', e.target.value)}
                            className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Razorpay Key Secret</label>
                          <div className="relative">
                            <input
                              type={showRazorpaySecret ? 'text' : 'password'}
                              value={formData.razorpayKeySecret}
                              onChange={(e) => handleChange('razorpayKeySecret', e.target.value)}
                              className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs pr-10 focus:outline-none focus:border-blue-500"
                            />
                            <button
                              type="button"
                              onClick={() => setShowRazorpaySecret(!showRazorpaySecret)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              {showRazorpaySecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Razorpay Webhook Callback URL</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value="https://bharatfilings.com/api/webhooks/razorpay"
                            className="w-full font-mono bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-slate-600 text-xs"
                          />
                          <button
                            type="button"
                            onClick={() => copyToClipboard('https://bharatfilings.com/api/webhooks/razorpay', 'webhook')}
                            className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedKey === 'webhook' ? 'Copied!' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Partner Counsel Disbursement Policy */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                        <Users className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Partner Disbursement & Escrow Rules</h3>
                        <p className="text-xs text-slate-500">Automate payouts to practicing CS and CA partners upon filing completion.</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="pr-4">
                          <span className="font-bold text-slate-900 block text-xs">
                            Instant Automated Payout on Government COI Release
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Trigger direct IMPS transfer to the assigned CA/CS bank account the moment the Certificate of Incorporation is released to the client.
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={formData.autoDisburseOnCoi}
                            onChange={(e) => handleChange('autoDisburseOnCoi', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900" />
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Escrow Review Holdback Window</label>
                          <select
                            value={formData.escrowHoldbackHours}
                            onChange={(e) => handleChange('escrowHoldbackHours', Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
                          >
                            <option value="0">Instant Settlement (0 Hours Hold)</option>
                            <option value="24">24 Hours Quality Audit Hold</option>
                            <option value="48">48 Hours Standard Hold</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Minimum Batch Settlement (₹)</label>
                          <input
                            type="number"
                            value={formData.minSettlementAmount}
                            onChange={(e) => handleChange('minSettlementAmount', Number(e.target.value))}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 5: NOTIFICATIONS & WEBHOOKS                          */}
              {/* ======================================================== */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  {/* Card 1: WhatsApp Business Gateway */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">WhatsApp Automated Notification Gateway</h3>
                        <p className="text-xs text-slate-500">Send instant WhatsApp templates to applicants upon document approval, queries, and COI release.</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="pr-4">
                          <span className="font-bold text-slate-900 block text-xs">
                            Enable Automated WhatsApp Applicant Updates
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Dispatches verified template messages when Admin approves registration documents or when MCA releases the COI.
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={formData.whatsappNotificationsEnabled}
                            onChange={(e) => handleChange('whatsappNotificationsEnabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900" />
                        </label>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">WhatsApp Cloud API Bearer Token</label>
                        <div className="relative">
                          <input
                            type={showWhatsappToken ? 'text' : 'password'}
                            value={formData.whatsappApiToken}
                            onChange={(e) => handleChange('whatsappApiToken', e.target.value)}
                            className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs pr-10 focus:outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowWhatsappToken(!showWhatsappToken)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showWhatsappToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Transactional Email & DLT SMS */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                          <Mail className="w-4 h-4 stroke-[2]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Transactional Email SMTP & TRAI DLT SMS</h3>
                          <p className="text-xs text-slate-500">Official email relay for incorporation certificates and DLT-registered SMS sender IDs.</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleTestEmail}
                        disabled={isTestingEmail}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer disabled:opacity-60"
                      >
                        <Mail className={`w-3.5 h-3.5 text-blue-600 ${isTestingEmail ? 'animate-pulse' : ''}`} />
                        <span>{isTestingEmail ? 'Sending...' : 'Send Test Email'}</span>
                      </button>
                    </div>

                    {emailTestResult && (
                      <div className="p-3 rounded-lg border bg-blue-50 border-blue-200 text-blue-900 text-xs mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        <span>{emailTestResult}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">SMTP Host</label>
                        <input
                          type="text"
                          value={formData.emailSmtpHost}
                          onChange={(e) => handleChange('emailSmtpHost', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">SMTP Port</label>
                        <input
                          type="number"
                          value={formData.emailSmtpPort}
                          onChange={(e) => handleChange('emailSmtpPort', Number(e.target.value))}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Sender Address (From)</label>
                        <input
                          type="email"
                          value={formData.emailSenderAddress}
                          onChange={(e) => handleChange('emailSenderAddress', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">TRAI DLT Sender ID</label>
                        <input
                          type="text"
                          value={formData.smsSenderId}
                          onChange={(e) => handleChange('smsSenderId', e.target.value)}
                          maxLength={6}
                          className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs font-bold uppercase focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">Slack / Discord Filing Alerts Webhook</label>
                        <input
                          type="text"
                          placeholder="https://hooks.slack.com/services/..."
                          value={formData.slackWebhookUrl}
                          onChange={(e) => handleChange('slackWebhookUrl', e.target.value)}
                          className="w-full font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 6: SECURITY, DPDP ACT 2023 & MAINTENANCE            */}
              {/* ======================================================== */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  {/* Card 1: DPDP Act 2023 & Security Controls */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                        <Lock className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">Digital Personal Data Protection (DPDP) Act 2023</h3>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.2 rounded-full">
                            MeitY Compliant
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">Statutory audit trail retention, sovereign data localisation, and multi-factor authentication controls.</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      {/* Control 1: Retention */}
                      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="pr-4">
                          <span className="font-bold text-slate-900 block text-xs">
                            Audit Trail & KYC Document Retention Window
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Statutory duration to preserve immutable SHA-256 access logs and director dockets before automated cryptographic archival.
                          </span>
                        </div>
                        <select
                          value={formData.retentionDays}
                          onChange={(e) => handleChange('retentionDays', Number(e.target.value))}
                          className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs focus:outline-none shrink-0"
                        >
                          <option value="180">180 Days (6 Months)</option>
                          <option value="365">365 Days (1 Year - Standard)</option>
                          <option value="730">730 Days (2 Years)</option>
                          <option value="2555">2555 Days (7 Years Statutory Companies Act)</option>
                        </select>
                      </div>

                      {/* Control 2: 2FA */}
                      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="pr-4">
                          <span className="font-bold text-slate-900 block text-xs">
                            Enforce Two-Factor Authentication (2FA) for All Administrators
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Requires OTP verification via mobile SMS / WhatsApp for every Administrator session login.
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={formData.twoFactorAuth}
                            onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900" />
                        </label>
                      </div>

                      {/* Control 3: Data Localisation */}
                      <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
                        <div className="pr-4">
                          <span className="font-bold text-emerald-950 block text-xs">
                            Sovereign Data Localisation (India Region Only)
                          </span>
                          <span className="text-[11px] text-emerald-800 mt-0.5 block">
                            Enforces strict routing: all customer database records and documents are stored exclusively within MeitY-empaneled data centers (AWS ap-south-1 Mumbai / GCP Delhi).
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-md shrink-0">
                          Active & Locked
                        </span>
                      </div>

                      {/* Control 4: Session Timeout */}
                      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="pr-4">
                          <span className="font-bold text-slate-900 block text-xs">
                            Administrator Idle Session Inactivity Timeout
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Automatically locks the Admin dashboard if no mouse or keyboard action is detected.
                          </span>
                        </div>
                        <select
                          value={formData.sessionTimeoutMinutes}
                          onChange={(e) => handleChange('sessionTimeoutMinutes', Number(e.target.value))}
                          className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs focus:outline-none shrink-0"
                        >
                          <option value="15">15 Minutes (High Security)</option>
                          <option value="30">30 Minutes (Standard)</option>
                          <option value="60">60 Minutes</option>
                          <option value="240">4 Hours</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Platform Maintenance Mode & Snapshot Export */}
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
                    <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                        <Database className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Platform Maintenance & System Snapshot</h3>
                        <p className="text-xs text-slate-500">Scheduled maintenance toggles and direct database backup downloads.</p>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      {/* Maintenance Toggle */}
                      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="pr-4">
                          <span className="font-bold text-slate-900 block text-xs">
                            Customer Portal Scheduled Maintenance Mode
                          </span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Temporarily pauses public new order submissions while allowing Admin and partner CS/CAs full backend access.
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input
                            type="checkbox"
                            checked={formData.maintenanceMode}
                            onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600" />
                        </label>
                      </div>

                      {formData.maintenanceMode && (
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Public Maintenance Notice Message</label>
                          <textarea
                            rows={2}
                            value={formData.maintenanceNotice}
                            onChange={(e) => handleChange('maintenanceNotice', e.target.value)}
                            className="w-full bg-slate-50 border border-amber-300 rounded-lg px-3 py-2 text-slate-900 text-xs focus:outline-none"
                          />
                        </div>
                      )}

                      {/* Manual Snapshot Export Card */}
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="font-bold text-slate-900 block text-xs">Export Complete JSON System Snapshot</span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block">
                            Downloads a full, encrypted JSON export of current orders, partner profiles, services catalog, and configuration.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleExportBackup}
                          disabled={isExporting}
                          className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 disabled:opacity-60"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{isExporting ? 'Exporting...' : 'Export Backup JSON'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Save Action Floating / Anchored */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Last synchronized with BharatFilings root tier config store.
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData(DEFAULT_SETTINGS)}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer transition"
                  >
                    Reset to Recommended Defaults
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer disabled:opacity-60"
                  >
                    <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
                    <span>{isSaving ? 'Saving Changes...' : 'Save Configuration'}</span>
                  </button>
                </div>
              </div>

            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
