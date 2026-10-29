'use client';

import React, { useState, useEffect } from 'react';

export interface AdminThemeConfig {
  id: string;
  name: string;
  hue: number;          // 0 - 360
  sat: number;          // 0 - 100
  primary: string;      // Accent / CTA color
  surfaceBg: string;    // Main card & header background
  pageBg: string;       // Canvas background
  secondaryBg: string;  // Wells & inputs background
  borderColor: string;  // Border lines
  textColor: string;    // Main text
  isDark: boolean;      // Dark mode active flag
  darkness: number;     // Active darkness level (0 - 100)
}

export interface AdminPresetColorDef {
  id: string;
  name: string;
  hue: number;
  sat: number;
  primary: string;
  defaultDarkness: number;
  description: string;
}

// 6 Curated Executive Admin Presets (Refined Enterprise Options)
export const ADMIN_PRESET_COLORS: AdminPresetColorDef[] = [
  {
    id: 'navy',
    name: 'Executive Midnight Navy',
    hue: 222,
    sat: 60,
    primary: '#3b82f6',
    defaultDarkness: 80,
    description: 'Executive deep midnight blue for high-focus root operations'
  },
  {
    id: 'slate',
    name: 'Steel Corporate Slate',
    hue: 215,
    sat: 20,
    primary: '#38bdf8',
    defaultDarkness: 80,
    description: 'Clean modern enterprise dark slate with sky accent'
  },
  {
    id: 'emerald',
    name: 'Statutory Emerald Dark',
    hue: 160,
    sat: 60,
    primary: '#10b981',
    defaultDarkness: 80,
    description: 'Statutory compliance & ROC filings audit green'
  },
  {
    id: 'indigo',
    name: 'Royal Institutional Indigo',
    hue: 245,
    sat: 55,
    primary: '#6366f1',
    defaultDarkness: 80,
    description: 'Institutional dark indigo tone for legal counsel desks'
  },
  {
    id: 'onyx',
    name: 'Onyx Jet Black (OLED)',
    hue: 0,
    sat: 0,
    primary: '#3b82f6',
    defaultDarkness: 98,
    description: '100% OLED deep pitch black for low eye fatigue'
  },
  {
    id: 'white',
    name: 'Classic Corporate White',
    hue: 215,
    sat: 15,
    primary: '#2563eb',
    defaultDarkness: 0,
    description: 'Standard daytime institutional high-contrast white'
  }
];

// Color Math Utilities
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const num = parseInt(clean, 16) || 0;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  l = Math.max(0, Math.min(100, l)) / 100;
  s = Math.max(0, Math.min(100, s)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Generate full Admin Theme Config dynamically from hue, sat, primary, and darkness (0 - 100)
export function computeAdminThemeColors(
  id: string,
  name: string,
  hue: number,
  sat: number,
  primary: string,
  darkness: number
): AdminThemeConfig {
  const clampedDarkness = Math.max(0, Math.min(100, Math.round(darkness)));

  if (clampedDarkness <= 30) {
    // Light Mode (0% to 30%)
    const lightFactor = clampedDarkness / 30;

    if (clampedDarkness === 0) {
      return {
        id,
        name,
        hue,
        sat,
        primary,
        surfaceBg: '#ffffff',
        pageBg: '#f1f5f9',
        secondaryBg: '#f8fafc',
        borderColor: '#e2e8f0',
        textColor: '#0f172a',
        isDark: false,
        darkness: clampedDarkness
      };
    }

    const effSat = Math.min(sat, Math.round(lightFactor * 22));
    const surfaceL = Math.round(100 - lightFactor * 4);
    const pageL = Math.round(96 - lightFactor * 6);
    const secL = Math.round(98 - lightFactor * 5);
    const borderL = Math.round(88 - lightFactor * 8);

    return {
      id,
      name,
      hue,
      sat,
      primary,
      surfaceBg: hslToHex(hue, effSat, surfaceL),
      pageBg: hslToHex(hue, effSat, pageL),
      secondaryBg: hslToHex(hue, effSat, secL),
      borderColor: hslToHex(hue, effSat, borderL),
      textColor: '#0f172a',
      isDark: false,
      darkness: clampedDarkness
    };
  } else {
    // Dark Mode (31% to 100%)
    const darkFactor = (clampedDarkness - 30) / 70;
    const effSat = sat === 0 ? 0 : Math.max(10, Math.min(sat, 50));

    const pageL = Math.max(1, Math.round(14 - darkFactor * 12.5));
    const surfaceL = Math.max(3, Math.round(20 - darkFactor * 15.5));
    const secL = Math.max(5, Math.round(25 - darkFactor * 18.5));
    const borderL = Math.max(10, Math.round(30 - darkFactor * 18));
    const borderSat = Math.max(6, effSat - 8);

    return {
      id,
      name,
      hue,
      sat,
      primary,
      surfaceBg: hslToHex(hue, effSat, surfaceL),
      pageBg: hslToHex(hue, effSat, pageL),
      secondaryBg: hslToHex(hue, effSat, secL),
      borderColor: hslToHex(hue, borderSat, borderL),
      textColor: '#f8fafc',
      isDark: true,
      darkness: clampedDarkness
    };
  }
}

export function getAdminPresetTheme(presetId: string, darkness?: number): AdminThemeConfig {
  const preset = ADMIN_PRESET_COLORS.find((p) => p.id === presetId) || ADMIN_PRESET_COLORS[0];
  const d = darkness !== undefined ? darkness : preset.defaultDarkness;
  return computeAdminThemeColors(preset.id, preset.name, preset.hue, preset.sat, preset.primary, d);
}

export function createAdminCustomTheme(hexColor: string, darkness: number = 80): AdminThemeConfig {
  const rgb = hexToRgb(hexColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const primary = hslToHex(hsl.h, Math.max(hsl.s, 60), 55);
  return computeAdminThemeColors('custom', 'Custom Admin Theme', hsl.h, hsl.s, primary, darkness);
}

// Global default theme for Admin: Executive Midnight Navy (80% darkness)
export const DEFAULT_ADMIN_THEME = getAdminPresetTheme('navy', 80);

export default function AdminThemeWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<AdminThemeConfig>(DEFAULT_ADMIN_THEME);

  const loadThemeFromStorage = () => {
    try {
      const savedThemeId = localStorage.getItem('bharatfilings_admin_theme');
      const savedDarknessStr = localStorage.getItem('bharatfilings_admin_darkness');
      const customBg = localStorage.getItem('bharatfilings_admin_bg_color');

      const darkness = savedDarknessStr !== null ? parseInt(savedDarknessStr, 10) : undefined;

      if (savedThemeId === 'custom' && customBg) {
        setTheme(createAdminCustomTheme(customBg, darkness !== undefined ? darkness : 80));
      } else if (savedThemeId) {
        setTheme(getAdminPresetTheme(savedThemeId, darkness));
      } else {
        setTheme(DEFAULT_ADMIN_THEME);
      }
    } catch {}
  };

  useEffect(() => {
    loadThemeFromStorage();

    const handleThemeChange = (e: any) => {
      if (e.detail?.themeConfig) {
        setTheme(e.detail.themeConfig);
      } else {
        loadThemeFromStorage();
      }
    };

    window.addEventListener('bf_admin_theme_change', handleThemeChange);
    return () => window.removeEventListener('bf_admin_theme_change', handleThemeChange);
  }, []);

  return (
    <div
      id="admin-portal-theme-root"
      className="admin-portal-root min-h-screen transition-colors duration-200"
      data-is-dark={theme.isDark ? 'true' : 'false'}
      style={{
        ['--ap-surface-bg' as any]: theme.surfaceBg,
        ['--ap-page-bg' as any]: theme.pageBg,
        ['--ap-secondary-bg' as any]: theme.secondaryBg,
        ['--ap-border' as any]: theme.borderColor,
        ['--ap-text-main' as any]: theme.textColor,
        ['--ap-primary' as any]: theme.primary,
        backgroundColor: theme.pageBg,
        color: theme.textColor
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-portal-root {
          background-color: var(--ap-page-bg, #0b1329) !important;
          color: var(--ap-text-main, #f8fafc) !important;
        }
        .admin-portal-root .bg-white {
          background-color: var(--ap-surface-bg, #131e3d) !important;
          border-color: var(--ap-border, #233363) !important;
          color: var(--ap-text-main, #f8fafc);
        }
        .admin-portal-root .bg-slate-50,
        .admin-portal-root .bg-slate-50\\/50,
        .admin-portal-root .bg-slate-50\\/60,
        .admin-portal-root .bg-slate-50\\/70,
        .admin-portal-root .bg-slate-50\\/80 {
          background-color: var(--ap-secondary-bg, #1a2752) !important;
          border-color: var(--ap-border, #233363) !important;
        }
        .admin-portal-root .bg-slate-100,
        .admin-portal-root .bg-slate-100\\/70,
        .admin-portal-root .bg-slate-100\\/80 {
          background-color: var(--ap-secondary-bg, #1a2752) !important;
          border-color: var(--ap-border, #233363) !important;
        }
        .admin-portal-root header {
          background-color: var(--ap-surface-bg, #131e3d) !important;
          border-color: var(--ap-border, #233363) !important;
        }
        .admin-portal-root aside,
        .admin-portal-root aside > div {
          background-color: var(--ap-surface-bg, #131e3d) !important;
          border-color: var(--ap-border, #233363) !important;
        }
        .admin-portal-root[data-is-dark="true"] {
          color: #f8fafc !important;
        }
        .admin-portal-root[data-is-dark="true"] .text-slate-900,
        .admin-portal-root[data-is-dark="true"] .text-slate-800,
        .admin-portal-root[data-is-dark="true"] .text-slate-700,
        .admin-portal-root[data-is-dark="true"] .text-black,
        .admin-portal-root[data-is-dark="true"] .text-\\[\\#000000E0\\],
        .admin-portal-root[data-is-dark="true"] .admin-nav-inactive {
          color: #f8fafc !important;
        }
        .admin-portal-root[data-is-dark="true"] .text-slate-600,
        .admin-portal-root[data-is-dark="true"] .text-slate-500 {
          color: #cbd5e1 !important;
        }
        .admin-portal-root[data-is-dark="true"] .text-slate-400 {
          color: #94a3b8 !important;
        }
        .admin-portal-root[data-is-dark="true"] .border-slate-100,
        .admin-portal-root[data-is-dark="true"] .border-slate-200,
        .admin-portal-root[data-is-dark="true"] .border-slate-300 {
          border-color: var(--ap-border, #233363) !important;
        }
        .admin-portal-root[data-is-dark="true"] .divide-slate-100 > :not([hidden]) ~ :not([hidden]),
        .admin-portal-root[data-is-dark="true"] .divide-slate-200 > :not([hidden]) ~ :not([hidden]) {
          border-color: var(--ap-border, #233363) !important;
        }
        .admin-portal-root[data-is-dark="true"] input:not([type="checkbox"]):not([type="radio"]):not([type="range"]),
        .admin-portal-root[data-is-dark="true"] select,
        .admin-portal-root[data-is-dark="true"] textarea {
          background-color: var(--ap-secondary-bg, #1a2752) !important;
          color: #f8fafc !important;
          border-color: var(--ap-border, #233363) !important;
        }
        .admin-portal-root[data-is-dark="true"] input::placeholder,
        .admin-portal-root[data-is-dark="true"] textarea::placeholder {
          color: #64748b !important;
        }
        .admin-portal-root[data-is-dark="true"] table thead {
          background-color: var(--ap-page-bg, #0b1329) !important;
          color: #94a3b8 !important;
        }
        .admin-portal-root[data-is-dark="true"] table tbody tr:hover {
          background-color: var(--ap-secondary-bg, #1a2752) !important;
        }
        .admin-portal-root[data-is-dark="true"] .admin-nav-inactive svg {
          stroke: #cbd5e1 !important;
        }
        .admin-portal-root[data-is-dark="true"] .admin-nav-inactive:hover {
          color: #ffffff !important;
          background-color: var(--ap-secondary-bg, #1a2752) !important;
        }
        .admin-portal-root[data-is-dark="true"] .admin-nav-inactive:hover svg {
          stroke: #ffffff !important;
        }
        .admin-portal-root[data-is-dark="true"] .hover\\:bg-slate-50:hover,
        .admin-portal-root[data-is-dark="true"] .hover\\:bg-slate-100:hover,
        .admin-portal-root[data-is-dark="true"] .hover\\:bg-slate-100\\/70:hover {
          background-color: var(--ap-secondary-bg, #1a2752) !important;
        }
        .admin-portal-root[data-is-dark="true"] .bg-blue-50 {
          background-color: rgba(59, 130, 246, 0.2) !important;
          color: #93c5fd !important;
          border-color: rgba(59, 130, 246, 0.35) !important;
        }
        .admin-portal-root[data-is-dark="true"] .bg-blue-50\\/80 {
          background-color: rgba(59, 130, 246, 0.25) !important;
          color: #93c5fd !important;
        }
        .admin-portal-root[data-is-dark="true"] .bg-emerald-50 {
          background-color: rgba(16, 185, 129, 0.2) !important;
          color: #6ee7b7 !important;
          border-color: rgba(16, 185, 129, 0.35) !important;
        }
        .admin-portal-root[data-is-dark="true"] .bg-amber-50 {
          background-color: rgba(245, 158, 11, 0.2) !important;
          color: #fcd34d !important;
          border-color: rgba(245, 158, 11, 0.35) !important;
        }
      ` }} />
      {children}
    </div>
  );
}
