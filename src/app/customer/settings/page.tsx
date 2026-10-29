'use client';

import React, { useState, useEffect } from 'react';
import CustomerNavbar from '@/components/CustomerNavbar';
import CustomerSidebar from '@/components/CustomerSidebar';
import { 
  User, 
  Palette, 
  Bell, 
  Lock, 
  ShieldCheck, 
  Check, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Mail, 
  Phone, 
  Building2, 
  Landmark, 
  Key, 
  Moon, 
  Sun, 
  Laptop, 
  FileText, 
  Download, 
  AlertCircle, 
  Save, 
  Sparkles,
  ShieldAlert,
  Clock,
  Fingerprint,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Send
} from 'lucide-react';
import { 
  PRESET_COLORS, 
  getPresetTheme, 
  computeThemeColors,
  createCustomTheme, 
  CustomerThemeConfig,
  PresetColorDef,
  DEFAULT_THEME 
} from '@/components/CustomerThemeWrapper';

type SettingsTab = 'profile' | 'theme' | 'notifications' | 'security' | 'privacy';

export default function CustomerSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [successBanner, setSuccessBanner] = useState<string>('');

  // 1. Profile State
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    mobile: '',
    designation: 'Director',
    companyName: '',
    din: '',
    registeredCity: ''
  });

  // 2. Theme State (Dynamic Background Transformation & Dark Mode Slider)
  const [selectedTheme, setSelectedTheme] = useState<string>('navy');
  const [darknessLevel, setDarknessLevel] = useState<number>(80);
  const [customHex, setCustomHex] = useState<string>('#1e3a8a');
  const [currentThemeConfig, setCurrentThemeConfig] = useState<CustomerThemeConfig>(DEFAULT_THEME);
  const [compactDensity, setCompactDensity] = useState<boolean>(false);

  // 3. Notification Preferences State
  const [notifications, setNotifications] = useState({
    // WhatsApp
    whatsappMilestones: true,
    whatsappQueries: true,
    whatsappCoiRelease: true,
    whatsappDueDates: true,
    // SMS (TRAI DLT)
    smsOtp: true, // Always locked on
    smsFilingReceipt: true,
    smsRenewals: true,
    // Email
    emailInvoices: true,
    emailDockets: true,
    emailMonthlyDigest: true,
    emailNewsletter: false,
    // Quiet hours
    dndEnabled: true
  });

  // 4. Password & Security State (Admin-governed reset requests)
  const [resetReason, setResetReason] = useState('Routine Security Rotation');
  const [resetUrgency, setResetUrgency] = useState<'Normal' | 'Urgent'>('Normal');
  const [resetNotes, setResetNotes] = useState('');
  const [directorConsent, setDirectorConsent] = useState(false);
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const [passwordRequests, setPasswordRequests] = useState<any[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [passwordLastChanged, setPasswordLastChanged] = useState('October 14, 2026');

  const fetchPasswordRequests = () => {
    setIsLoadingRequests(true);
    fetch('/api/password-requests')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPasswordRequests(data.data);
        }
      })
      .catch((err) => console.error('Failed to load password requests:', err))
      .finally(() => setIsLoadingRequests(false));
  };

  // Load saved preferences on mount
  useEffect(() => {
    try {
      // User profile
      const storedUser = localStorage.getItem('bharatfilings_customer_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setProfile((prev) => ({
          ...prev,
          name: parsed.name || prev.name,
          email: parsed.email || prev.email,
          mobile: parsed.mobile || prev.mobile,
          companyName: parsed.companyName || prev.companyName,
          designation: parsed.designation || prev.designation,
          din: parsed.din || prev.din
        }));
      }

      // Theme & Background Color & Darkness Level
      const storedTheme = localStorage.getItem('bharatfilings_customer_theme');
      const storedDarkness = localStorage.getItem('bharatfilings_customer_darkness');
      const customBg = localStorage.getItem('bharatfilings_customer_bg_color');

      const initialDarkness = storedDarkness !== null ? parseInt(storedDarkness, 10) : 80;
      setDarknessLevel(initialDarkness);

      if (storedTheme === 'custom' && customBg) {
        setSelectedTheme('custom');
        setCustomHex(customBg);
        setCurrentThemeConfig(createCustomTheme(customBg, initialDarkness));
      } else if (storedTheme) {
        setSelectedTheme(storedTheme);
        setCurrentThemeConfig(getPresetTheme(storedTheme, initialDarkness));
      } else {
        setSelectedTheme('navy');
        setCurrentThemeConfig(getPresetTheme('navy', 80));
      }

      const storedDensity = localStorage.getItem('bharatfilings_customer_density');
      if (storedDensity) setCompactDensity(storedDensity === 'true');

      // Notifications
      const storedNotifs = localStorage.getItem('bharatfilings_customer_notifications');
      if (storedNotifs) setNotifications(JSON.parse(storedNotifs));

      fetchPasswordRequests();
    } catch (e) {
      console.error('Failed to load settings:', e);
    }

    // Dynamic live polling every 4 seconds to sync admin actions automatically
    const pollTimer = setInterval(() => {
      fetchPasswordRequests();
    }, 4000);

    return () => clearInterval(pollTimer);
  }, []);

  const showNotification = (msg: string) => {
    setSuccessBanner(msg);
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('bharatfilings_customer_user', JSON.stringify(profile));
      window.dispatchEvent(new CustomEvent('bf_customer_user_updated'));
      showNotification('Profile and company contact details updated successfully.');
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  // Darkness Slider Change (Continuous Dark Mode Intensity)
  const handleDarknessChange = (newDarkness: number) => {
    setDarknessLevel(newDarkness);
    let updatedConfig: CustomerThemeConfig;

    if (selectedTheme === 'custom') {
      updatedConfig = createCustomTheme(customHex, newDarkness);
    } else {
      updatedConfig = getPresetTheme(selectedTheme, newDarkness);
    }

    setCurrentThemeConfig(updatedConfig);
    try {
      localStorage.setItem('bharatfilings_customer_darkness', String(newDarkness));
      localStorage.setItem('bharatfilings_customer_bg_color', updatedConfig.surfaceBg);
      window.dispatchEvent(new CustomEvent('bf_customer_theme_change', { detail: { themeConfig: updatedConfig } }));
    } catch (err) {
      console.error('Failed to update darkness level:', err);
    }
  };

  // Preset Theme Selection
  const handleSelectPreset = (preset: PresetColorDef) => {
    setSelectedTheme(preset.id);
    let targetDarkness = darknessLevel;
    // Auto-align darkness if moving from light to dark or vice versa
    if (preset.id === 'white' && darknessLevel > 30) {
      targetDarkness = 0;
    } else if (preset.id !== 'white' && darknessLevel <= 30) {
      targetDarkness = preset.defaultDarkness;
    }

    setDarknessLevel(targetDarkness);
    const updatedConfig = computeThemeColors(
      preset.id,
      preset.name,
      preset.hue,
      preset.sat,
      preset.primary,
      targetDarkness
    );
    setCurrentThemeConfig(updatedConfig);

    try {
      localStorage.setItem('bharatfilings_customer_theme', preset.id);
      localStorage.setItem('bharatfilings_customer_darkness', String(targetDarkness));
      localStorage.setItem('bharatfilings_customer_bg_color', updatedConfig.surfaceBg);
      window.dispatchEvent(new CustomEvent('bf_customer_theme_change', { detail: { themeConfig: updatedConfig } }));
      showNotification(`Theme changed to "${preset.name}". Background set to ${updatedConfig.surfaceBg} (${targetDarkness}% darkness).`);
    } catch (err) {
      console.error('Failed to save theme:', err);
    }
  };

  // Custom Color Application
  const handleApplyCustomColor = (hex: string) => {
    setCustomHex(hex);
    setSelectedTheme('custom');
    const customConfig = createCustomTheme(hex, darknessLevel);
    setCurrentThemeConfig(customConfig);
    try {
      localStorage.setItem('bharatfilings_customer_theme', 'custom');
      localStorage.setItem('bharatfilings_customer_bg_color', hex);
      localStorage.setItem('bharatfilings_customer_darkness', String(darknessLevel));
      window.dispatchEvent(new CustomEvent('bf_customer_theme_change', { detail: { themeConfig: customConfig } }));
      showNotification(`Custom color applied (${hex}) at ${darknessLevel}% darkness.`);
    } catch (err) {
      console.error('Failed to save custom color:', err);
    }
  };

  // Notification Toggle & Save
  const handleToggleNotification = (key: keyof typeof notifications) => {
    if (key === 'smsOtp') return; // Cannot disable security OTP
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    try {
      localStorage.setItem('bharatfilings_customer_notifications', JSON.stringify(updated));
      showNotification('Notification preferences saved.');
    } catch (err) {
      console.error('Failed to save notifications:', err);
    }
  };

  // Submit Password Change Request to Security Admin
  const handleRequestPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directorConsent) {
      alert('Please confirm the statutory director authorization checkbox to proceed.');
      return;
    }

    setIsSubmittingReset(true);
    try {
      const res = await fetch('/api/password-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: profile.name || 'Rahul Sharma',
          customerEmail: profile.email || 'client@example.com',
          customerMobile: profile.mobile || '9876543210',
          companyName: profile.companyName || 'Corporate Client',
          reason: resetReason + (resetNotes ? ` - ${resetNotes}` : ''),
          urgency: resetUrgency
        })
      });
      const json = await res.json();
      if (json.success) {
        setResetNotes('');
        setDirectorConsent(false);
        showNotification(`Password reset request ${json.data.id} submitted! The Security Administrator will review and email updated credentials to ${profile.email || 'your email'}.`);
        fetchPasswordRequests();
      } else {
        alert(json.error || 'Failed to submit request.');
      }
    } catch (err) {
      console.error('Error submitting password reset request:', err);
      alert('Network error while submitting request.');
    } finally {
      setIsSubmittingReset(false);
    }
  };

  // Export Customer Data (JSON)
  const handleExportData = () => {
    const exportPayload = {
      platform: 'BharatFilings',
      exportedAt: new Date().toISOString(),
      userProfile: profile,
      preferences: {
        theme: selectedTheme,
        mode: currentThemeConfig.isDark ? 'dark' : 'light',
        backgroundColor: currentThemeConfig.surfaceBg,
        notifications
      },
      dpdpConsent: {
        status: 'Active',
        act: 'Digital Personal Data Protection Act, 2023',
        consentTimestamp: '2026-10-15T10:00:00.000Z'
      }
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bharatfilings-account-${profile.din || 'data'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Account data archive exported as JSON.');
  };

  const segoeStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  const activeThemeObj = currentThemeConfig;

  return (
    <div style={segoeStyle} className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      <CustomerNavbar currentTitle="Account & Portal Settings" />

      <div className="flex-1 flex flex-row min-w-0">
        <CustomerSidebar activeItem="settings" />

        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <main className="max-w-5xl mx-auto w-full py-6 px-4 sm:px-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-slate-700" />
                  <span>Account & Portal Settings</span>
                </h1>
                <p className="text-xs text-slate-500">
                  Manage your personal identity, theme appearance, multi-channel notifications, and security keys.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>DPDP Act 2023 Compliant</span>
                </span>
              </div>
            </div>

            {/* Success Banner */}
            {successBanner && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-2xs animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successBanner}</span>
              </div>
            )}

            {/* Settings Horizontal Navigation Tabs */}
            <div className="bg-white border border-slate-200 rounded-xl p-1.5 flex items-center gap-1 overflow-x-auto shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                  activeTab === 'profile'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-black hover:bg-slate-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Name & Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('theme')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                  activeTab === 'theme'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-black hover:bg-slate-100'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Theme & Color</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                  activeTab === 'notifications'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-black hover:bg-slate-100'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Notifications</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                  activeTab === 'security'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-black hover:bg-slate-100'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Password & Security</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                  activeTab === 'privacy'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-black hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Data & Privacy</span>
              </button>
            </div>

            {/* TAB 1: NAME & PROFILE EDITING */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Signatory & Director Information</h2>
                    <p className="text-xs text-slate-500">Edit your official legal name, email, phone and corporate credentials.</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center border border-slate-800 shadow-2xs">
                    {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'RS'}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">
                      Full Legal Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                    />
                    <span className="text-[11px] text-slate-400">As printed on your Permanent Account Number (PAN) Card</span>
                  </div>

                  {/* Designation */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">
                      Corporate Designation / Role
                    </label>
                    <select
                      value={profile.designation}
                      onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs cursor-pointer"
                    >
                      <option value="Managing Director">Managing Director</option>
                      <option value="Director">Director</option>
                      <option value="Designated Partner">Designated Partner (LLP)</option>
                      <option value="Authorized Signatory">Authorized Signatory</option>
                      <option value="Sole Proprietor">Sole Proprietor</option>
                      <option value="Founder & CEO">Founder & CEO</option>
                    </select>
                    <span className="text-[11px] text-slate-400">Used for signatory declarations in Ministry filings</span>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center justify-between">
                      <span>Email Address <span className="text-red-500">*</span></span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                        Verified
                      </span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400">Official tax invoices and digital certificates will be sent here</span>
                  </div>

                  {/* Mobile Phone */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 flex items-center justify-between">
                      <span>Mobile Number <span className="text-red-500">*</span></span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                        OTP Verified
                      </span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={profile.mobile}
                        onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400">Linked to WhatsApp updates and statutory TRAI DLT alerts</span>
                  </div>

                  {/* Company Legal Entity */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">
                      Registered Corporate Entity Name
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={profile.companyName}
                        onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400">Entity registered with Ministry of Corporate Affairs</span>
                  </div>

                  {/* Director Identification Number (DIN) */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700 block">
                      Director Identification Number (DIN / DPIN)
                    </label>
                    <div className="relative">
                      <Landmark className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={profile.din}
                        onChange={(e) => setProfile({ ...profile, din: e.target.value })}
                        placeholder="8-digit MCA DIN (e.g. 09841234)"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400">Issued by Ministry of Corporate Affairs (optional for new applicants)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-500 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Identity details verified with DigiLocker Aadhaar e-KYC</span>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center gap-2 shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: THEME & COLOR CUSTOMIZATION */}
            {activeTab === 'theme' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-7">
                {/* Header */}
                <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Palette className="w-4 h-4 text-blue-600" />
                      <span>Portal Background, Dark Tones & Dark Mode Engine</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Choose from 16 rich darker tones, adjust continuous darkness with the slider, or input custom hex shades to customize your Customer Portal.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                      Active: {activeThemeObj.name}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
                      {darknessLevel}% Darkness
                    </span>
                  </div>
                </div>

                {/* FEATURE 1: DARK MODE & CONTRAST INTENSITY SLIDER */}
                <div className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
                        {darknessLevel > 30 ? (
                          <Moon className="w-4 h-4" />
                        ) : (
                          <Sun className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                          <span>Dark Mode & Luminance Slider</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                            Continuous Control
                          </span>
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          Slide continuously to regulate background depth, ambient luminance, and contrast across all portal surfaces.
                        </span>
                      </div>
                    </div>

                    {/* Live Mode Readout Tag */}
                    <div className="shrink-0">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                        darknessLevel >= 85
                          ? 'bg-slate-950 text-white border-slate-800'
                          : darknessLevel >= 50
                          ? 'bg-indigo-900 text-indigo-100 border-indigo-700'
                          : darknessLevel >= 31
                          ? 'bg-blue-900 text-blue-100 border-blue-700'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}>
                        <Sparkles className="w-3 h-3" />
                        <span>
                          {darknessLevel >= 85
                            ? `🌌 Ultra Midnight Dark (${darknessLevel}%)`
                            : darknessLevel >= 50
                            ? `🌙 Deep Dark Mode (${darknessLevel}%)`
                            : darknessLevel >= 31
                            ? `🌗 Balanced Medium (${darknessLevel}%)`
                            : `☀️ Clean Light Mode (${darknessLevel}%)`}
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
                        value={darknessLevel}
                        onChange={(e) => handleDarknessChange(Number(e.target.value))}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none shadow-inner"
                        style={{
                          background: 'linear-gradient(to right, #ffffff 0%, #93c5fd 25%, #2563eb 50%, #1e293b 75%, #030712 100%)'
                        }}
                      />
                    </div>

                    {/* Scale Markings */}
                    <div className="flex justify-between text-[10px] font-mono font-semibold text-slate-500 px-1">
                      <span>0% (Pure Light)</span>
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
                      onClick={() => handleDarknessChange(0)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                        darknessLevel === 0
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      ☀️ Light (0%)
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDarknessChange(25)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                        darknessLevel === 25
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      🌤️ Soft (25%)
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDarknessChange(50)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                        darknessLevel === 50
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      🌗 Balanced (50%)
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDarknessChange(80)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                        darknessLevel === 80
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      🌙 Deep Dark (80%) ★
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDarknessChange(98)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition cursor-pointer ${
                        darknessLevel >= 95
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      🌌 Pitch Black (100%)
                    </button>
                  </div>
                </div>

                {/* FEATURE 2: 16 DARKER & RICH COLOR PRESETS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-xs font-bold text-slate-800 block">
                        Select Dark & Rich Theme Palette (16 Options):
                      </label>
                      <span className="text-[11px] text-slate-500">
                        Darker tones replace white backgrounds with saturated, high-contrast dark themes.
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      16 Styles Available
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {PRESET_COLORS.map((preset) => {
                      const isSelected = selectedTheme === preset.id;
                      // Preview what this preset looks like with current darkness level
                      const previewTheme = computeThemeColors(
                        preset.id,
                        preset.name,
                        preset.hue,
                        preset.sat,
                        preset.primary,
                        preset.id === 'white' && darknessLevel > 30 ? 0 : darknessLevel
                      );

                      return (
                        <div
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all duration-150 flex flex-col justify-between gap-2.5 ${
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
                        <span>Custom Color Hex Picker</span>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Pick any custom hex shade. The darkness slider will automatically calibrate surface depth and text contrast.
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={customHex}
                        onChange={(e) => setCustomHex(e.target.value)}
                        className="w-9 h-9 rounded-lg border border-slate-300 p-0.5 cursor-pointer bg-white shrink-0 shadow-2xs"
                        title="Pick custom color"
                      />
                      <input
                        type="text"
                        value={customHex}
                        onChange={(e) => setCustomHex(e.target.value)}
                        placeholder="#1e3a8a"
                        className="w-24 px-2.5 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCustomColor(customHex)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs shrink-0"
                      >
                        Apply Shade
                      </button>
                    </div>
                  </div>
                </div>

                {/* FEATURE 4: LIVE PORTAL SURFACE & ACCESSIBILITY PREVIEW */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 block">
                      Live Surface, Contrast & Accessibility Preview:
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                      AAA Contrast Verified
                    </span>
                  </div>

                  <div 
                    className="p-5 rounded-xl border transition-colors duration-150 space-y-3.5 shadow-xs"
                    style={{
                      backgroundColor: activeThemeObj.surfaceBg,
                      borderColor: activeThemeObj.borderColor,
                      color: activeThemeObj.textColor
                    }}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2.5">
                        <span 
                          className="w-3.5 h-3.5 rounded-full shadow-2xs" 
                          style={{ backgroundColor: activeThemeObj.primary }}
                        />
                        <span className="text-xs font-bold">
                          SPICe+ Part B MCA Docket • {profile.companyName || 'Corporate Filing Services'}
                        </span>
                      </div>
                      <span 
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: activeThemeObj.pageBg,
                          borderColor: activeThemeObj.borderColor,
                          color: activeThemeObj.textColor
                        }}
                      >
                        {activeThemeObj.name} • {darknessLevel}% Darkness
                      </span>
                    </div>

                    <p className="text-xs opacity-85 leading-relaxed">
                      All white cards, tables, input fields, and sidebar rails in your Customer Portal are transformed into this {activeThemeObj.name} background color. Font contrast is calibrated for high legibility.
                    </p>

                    <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          style={{ backgroundColor: activeThemeObj.primary }}
                          className="px-3.5 py-1.5 text-white font-bold rounded-lg text-xs shadow-xs cursor-pointer"
                        >
                          Sample Action Button
                        </button>
                        <span 
                          className="text-xs px-2.5 py-1 rounded-lg border font-mono text-[11px]"
                          style={{
                            backgroundColor: activeThemeObj.secondaryBg,
                            borderColor: activeThemeObj.borderColor
                          }}
                        >
                          Input / Well Area
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] font-mono opacity-80">
                        <span>Surface: <strong>{activeThemeObj.surfaceBg}</strong></span>
                        <span>Canvas: <strong>{activeThemeObj.pageBg}</strong></span>
                        <span>Border: <strong>{activeThemeObj.borderColor}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: NOTIFICATIONS TURN ON / OFF */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Multi-Channel Notification Dispatcher</h2>
                    <p className="text-xs text-slate-500">
                      Configure your preferred alert channels for ROC filing milestones, CA/CS queries, and invoices.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md font-bold">
                    Meta Cloud + TRAI DLT Active
                  </span>
                </div>

                {/* Section A: WhatsApp Business Alerts */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp Business Automated Updates</span>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                    <div className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50/70 transition">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Filing Milestones & ROC Acknowledgments</span>
                        <span className="text-[11px] text-slate-500 block">Instant WhatsApp template notifications when SPICe+ Part A/B steps complete</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.whatsappMilestones}
                        onChange={() => handleToggleNotification('whatsappMilestones')}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50/70 transition">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">CA / CS Direct Inquiries & Missing Document Alerts</span>
                        <span className="text-[11px] text-slate-500 block">Immediate alert if an attached address proof or director KYC needs clarification</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.whatsappQueries}
                        onChange={() => handleToggleNotification('whatsappQueries')}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50/70 transition">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Certificate of Incorporation (COI) Release Alert</span>
                        <span className="text-[11px] text-slate-500 block">Receive instant WhatsApp message with CIN allotment and download link</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.whatsappCoiRelease}
                        onChange={() => handleToggleNotification('whatsappCoiRelease')}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50/70 transition">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Statutory Compliance Calendar Reminders</span>
                        <span className="text-[11px] text-slate-500 block">Gentle alert 5 days before GSTR-3B, AOC-4, and MGT-7 statutory due dates</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.whatsappDueDates}
                        onChange={() => handleToggleNotification('whatsappDueDates')}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: TRAI DLT Compliant SMS */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>TRAI DLT Registered SMS (Header: BHRTFL)</span>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                    <div className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50/70 transition">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                          <span>Security Login OTP & Critical Authentication</span>
                          <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded font-bold border border-amber-200">
                            Statutory Lock
                          </span>
                        </span>
                        <span className="text-[11px] text-slate-500 block">Mandatory two-factor SMS OTP as required by Indian cyber security norms</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="w-4 h-4 text-slate-400 rounded cursor-not-allowed opacity-60"
                      />
                    </div>

                    <div className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50/70 transition">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Ministry SPICe+ Docket Challan SMS</span>
                        <span className="text-[11px] text-slate-500 block">SMS confirmation containing MCA SRN number on government portal submission</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.smsFilingReceipt}
                        onChange={() => handleToggleNotification('smsFilingReceipt')}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Section C: Transactional Email */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                    <Mail className="w-4 h-4 text-slate-700" />
                    <span>Transactional Email Dispatches</span>
                  </div>

                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                    <div className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50/70 transition">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">GST Tax Invoices & Payment Receipts</span>
                        <span className="text-[11px] text-slate-500 block">PDF tax invoice automatically attached for input tax credit (ITC) claims</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailInvoices}
                        onChange={() => handleToggleNotification('emailInvoices')}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50/70 transition">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Signed Corporate Dockets & MOA/AOA Copies</span>
                        <span className="text-[11px] text-slate-500 block">Formal digital copies of company charter documents sent directly to your inbox</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailDockets}
                        onChange={() => handleToggleNotification('emailDockets')}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                      />
                    </div>

                    <div className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50/70 transition">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Legal Advisory & Corporate Tax Updates</span>
                        <span className="text-[11px] text-slate-500 block">Monthly briefing on Budget changes, DPIIT startup tax holidays, and SEBI circulars</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.emailNewsletter}
                        onChange={() => handleToggleNotification('emailNewsletter')}
                        className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Section D: Quiet Hours */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-600" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Do Not Disturb (DND) Hours</span>
                      <span className="text-[11px] text-slate-500 block">
                        Silence non-critical alerts between 9:00 PM and 8:00 AM IST. OTPs and urgent filing deadlines are never delayed.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.dndEnabled}
                    onChange={() => handleToggleNotification('dndEnabled')}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: PASSWORD & AUTHENTICATION SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                {/* Statutory Security Policy Banner */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-amber-500 uppercase tracking-wide text-[11px]">
                        Statutory Credential Security Policy
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-500 font-bold px-2 py-0.5 rounded-full">
                        MCA V3 & DPDP Act 2023
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      To safeguard company incorporation records, Director Identification Numbers (DIN), and digital sign-in vaults against unauthorized takeovers, <strong>customers cannot directly overwrite passwords</strong>. 
                      All password change requests are reviewed and executed by the platform Security Administrator. Once updated, your new credentials are authenticated and dispatched directly to your registered email.
                    </p>
                  </div>
                </div>

                {/* Dynamic Alert of Completed Admin Dispatch */}
                {passwordRequests.some((r) => r.status === 'Completed') && (
                  <div className="bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-emerald-800 text-xs block">
                          Administrator Has Dispatched Updated Credentials!
                        </span>
                        <span className="text-[11px] text-emerald-700/90 block">
                          A statutory notification with your new login key was sent from <strong>admin@bharatfilings.com</strong>. View it via the mailbox ✉️ icon in the top navbar.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Request Password Reset from Administrator */}
                <form onSubmit={handleRequestPasswordReset} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
                  <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Key className="w-4 h-4 text-blue-600" />
                        <span>Request Password Reset from Administrator</span>
                      </h2>
                      <p className="text-xs text-slate-500">
                        Submit a verified request. The Administrator will regenerate credentials and dispatch them to your email.
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/80">
                      Registered: {profile.email || 'client@example.com'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Reason for Password Reset */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 block">
                        Reason for Password Reset <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={resetReason}
                        onChange={(e) => setResetReason(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs"
                      >
                        <option value="Routine Security Rotation">Routine Security Rotation</option>
                        <option value="Forgot Previous Access Password">Forgot Previous Access Password</option>
                        <option value="Suspected Credential Leak / Security Precaution">Suspected Credential Leak / Security Precaution</option>
                        <option value="Change of Authorized Signatory / Director Transfer">Change of Authorized Signatory / Director Transfer</option>
                        <option value="New Device / Portal Reconnection">New Device / Portal Reconnection</option>
                        <option value="Other Corporate Administrative Reason">Other Corporate Administrative Reason</option>
                      </select>
                    </div>

                    {/* Urgency Level */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700 block">Processing Urgency</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setResetUrgency('Normal')}
                          className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            resetUrgency === 'Normal'
                              ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Normal (24h)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setResetUrgency('Urgent')}
                          className={`py-2 px-3 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            resetUrgency === 'Urgent'
                              ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-2xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                          <span>Urgent (Immediate)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Optional Director Statement / Authorization Notes */}
                  <div className="space-y-1.5 text-xs">
                    <label className="font-bold text-slate-700 block">
                      Additional Authorization Details / Director Remark (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={resetNotes}
                      onChange={(e) => setResetNotes(e.target.value)}
                      placeholder="e.g. Please send the new password to rahul.sharma@technova.in. Co-director Amit Kumar informed."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-2xs placeholder:text-slate-400"
                    />
                  </div>

                  {/* Director Consent Checkbox */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5 text-xs">
                    <input
                      type="checkbox"
                      id="directorConsent"
                      checked={directorConsent}
                      onChange={(e) => setDirectorConsent(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-blue-600 rounded cursor-pointer accent-blue-600"
                    />
                    <label htmlFor="directorConsent" className="text-slate-600 cursor-pointer select-none leading-relaxed">
                      I solemnly confirm as the authorized representative/director of <strong>{profile.companyName || 'the registered entity'}</strong> that I am formally requesting a password reset. I authorize the platform administrator to generate new credentials and dispatch them to <strong>{profile.email || 'my registered email'}</strong>.
                    </label>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Managed under strict DPDP Act 2023 audit trails.
                    </span>
                    <button
                      type="submit"
                      disabled={isSubmittingReset || !directorConsent}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center gap-2 shadow-xs"
                    >
                      {isSubmittingReset ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Request to Administrator</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Password Reset Requests Status Tracker */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-700" />
                        <span>Password Reset Requests & Email Dispatch Status</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Track previous and pending administrative credential update tickets.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={fetchPasswordRequests}
                      disabled={isLoadingRequests}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRequests ? 'animate-spin' : ''}`} />
                      <span>Refresh Status</span>
                    </button>
                  </div>

                  {passwordRequests.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs">
                      <Key className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="font-bold text-slate-700">No active password reset requests</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Submit a request above if you require an administrator to regenerate your credentials.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                      {passwordRequests.map((req) => (
                        <div key={req.id} className="p-4 bg-white hover:bg-slate-50/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-xs font-mono">{req.id}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                req.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : req.status === 'Rejected'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {req.status === 'Completed' ? '✓ Completed & Dispatched' : req.status}
                              </span>
                              {req.urgency === 'Urgent' && (
                                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                  Urgent Priority
                                </span>
                              )}
                            </div>
                            <p className="text-slate-700 font-medium">
                              <strong>Reason:</strong> {req.reason}
                            </p>
                            <div className="text-[11px] text-slate-500 flex items-center gap-3">
                              <span>Requested on {new Date(req.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                              {req.emailDispatched && (
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                  <Mail className="w-3 h-3" /> Credentials sent to {req.customerEmail}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            {req.status === 'Completed' ? (
                              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-right space-y-0.5">
                                <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                                  Credentials Updated
                                </span>
                                <span className="text-[11px] text-emerald-900 font-semibold block">
                                  Email sent to {req.customerEmail}
                                </span>
                              </div>
                            ) : (
                              <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-right">
                                <span className="text-[11px] text-amber-800 font-bold flex items-center gap-1 justify-end">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                  Admin Review in Progress
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Two-Factor Authentication & Active Sessions */}
                <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-slate-700" />
                      <span>Multi-Factor Authentication (2FA)</span>
                    </h2>
                    <p className="text-xs text-slate-500">Protect corporate filings and documents against unauthorized sign-ins.</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 block">SMS OTP Authentication (TRAI Verified)</span>
                      <span className="text-[11px] text-slate-500 block">
                        A one-time security code is dispatched to your registered phone ({profile.mobile}) upon sign-in.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTwoFactorAuth(!twoFactorAuth);
                        showNotification(twoFactorAuth ? '2FA disabled.' : '2FA security enabled.');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        twoFactorAuth 
                          ? 'bg-emerald-600 text-white shadow-2xs' 
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      {twoFactorAuth ? 'Enabled (Active)' : 'Enable 2FA'}
                    </button>
                  </div>

                  {/* Active Sessions */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 block">Active Device Sessions</span>
                      <button
                        type="button"
                        onClick={() => showNotification('Terminated all other active browser sessions.')}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        Sign Out Other Devices
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                      <div className="p-3 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Laptop className="w-4 h-4 text-slate-600" />
                          <div>
                            <span className="font-bold text-slate-900 block">Chrome on Windows 11 (Current Device)</span>
                            <span className="text-[10px] text-slate-400">Mumbai, Maharashtra • IP: 103.21.58.12</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                          Active Now
                        </span>
                      </div>

                      <div className="p-3 bg-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-4 h-4 text-slate-600" />
                          <div>
                            <span className="font-bold text-slate-900 block">Mobile Safari on iOS (iPhone 15)</span>
                            <span className="text-[10px] text-slate-400">Bangalore, Karnataka • IP: 49.36.128.44</span>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">
                          2 days ago
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: DATA, PRIVACY & COMPLIANCE */}
            {activeTab === 'privacy' && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="pb-4 border-b border-slate-100">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Statutory Data Protection & Compliance</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Your records are handled strictly according to the Digital Personal Data Protection (DPDP) Act, 2023.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-900 block">Export Company Records (JSON)</span>
                    <p className="text-[11px] text-slate-500">
                      Download a complete machine-readable archive of your corporate profile, filed dockets, and invoice ledger.
                    </p>
                    <button
                      type="button"
                      onClick={handleExportData}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Archive (.json)</span>
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-900 block">DigiLocker Encryption Standard</span>
                    <p className="text-[11px] text-slate-500">
                      All uploaded Director PAN, Aadhaar, and registered premises proofs are encrypted at rest using AES-256 GCM.
                    </p>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs pt-1">
                      <ShieldCheck className="w-4 h-4" />
                      <span>AES-256 Vault Encryption Active</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-2 text-amber-900">
                  <span className="font-bold block flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    Statutory Corporate Record Retention Notice
                  </span>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    Under Section 128 of the Companies Act, 2013 and Rule 28 of the Companies (Incorporation) Rules, 2014, books of account, incorporation dockets, and statutory declarations must be preserved by registered entities for a minimum statutory period of eight (8) financial years.
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
