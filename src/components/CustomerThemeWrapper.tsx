'use client';

import React, { useState, useEffect } from 'react';

export interface CustomerThemeConfig {
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

export interface PresetColorDef {
  id: string;
  name: string;
  hue: number;
  sat: number;
  primary: string;
  defaultDarkness: number;
  description: string;
}

// 16 Rich & Dark Color Presets
export const PRESET_COLORS: PresetColorDef[] = [
  {
    id: 'navy',
    name: 'Midnight Navy Blue',
    hue: 222,
    sat: 65,
    primary: '#3b82f6',
    defaultDarkness: 80,
    description: 'Executive deep midnight blue with crisp electric accent'
  },
  {
    id: 'indigo',
    name: 'Royal Indigo Dark',
    hue: 245,
    sat: 60,
    primary: '#6366f1',
    defaultDarkness: 80,
    description: 'Prestige corporate dark indigo tone'
  },
  {
    id: 'emerald',
    name: 'Deep Forest Emerald',
    hue: 160,
    sat: 65,
    primary: '#10b981',
    defaultDarkness: 80,
    description: 'Statutory compliance forest emerald green'
  },
  {
    id: 'teal',
    name: 'Dark Ocean Teal',
    hue: 180,
    sat: 60,
    primary: '#14b8a6',
    defaultDarkness: 80,
    description: 'Deep oceanic cyan & marine teal tone'
  },
  {
    id: 'ruby',
    name: 'Crimson Ruby Red',
    hue: 348,
    sat: 65,
    primary: '#f43f5e',
    defaultDarkness: 80,
    description: 'Bold regal crimson dark ruby'
  },
  {
    id: 'burgundy',
    name: 'Luxury Burgundy Wine',
    hue: 335,
    sat: 60,
    primary: '#e11d48',
    defaultDarkness: 82,
    description: 'Rich Bordeaux wine & luxury dark burgundy'
  },
  {
    id: 'amethyst',
    name: 'Midnight Amethyst Violet',
    hue: 270,
    sat: 65,
    primary: '#a855f7',
    defaultDarkness: 80,
    description: 'Deep royal amethyst & electric violet'
  },
  {
    id: 'amber',
    name: 'Dark Espresso Amber',
    hue: 32,
    sat: 65,
    primary: '#f59e0b',
    defaultDarkness: 82,
    description: 'Warm roasted espresso & dark golden amber'
  },
  {
    id: 'azure',
    name: 'Cyberpunk Dark Azure',
    hue: 200,
    sat: 65,
    primary: '#06b6d4',
    defaultDarkness: 80,
    description: 'High-tech deep dark sapphire cyan'
  },
  {
    id: 'slate',
    name: 'Steel Slate Dark',
    hue: 215,
    sat: 25,
    primary: '#38bdf8',
    defaultDarkness: 80,
    description: 'Corporate dark slate with sky accent'
  },
  {
    id: 'charcoal',
    name: 'Charcoal Graphite',
    hue: 220,
    sat: 10,
    primary: '#94a3b8',
    defaultDarkness: 85,
    description: 'Neutral minimalist dark matte graphite'
  },
  {
    id: 'onyx',
    name: 'Pitch Black (OLED Onyx)',
    hue: 0,
    sat: 0,
    primary: '#3b82f6',
    defaultDarkness: 98,
    description: 'True 100% OLED deep pitch black mode'
  },
  {
    id: 'pine',
    name: 'Nordic Alpine Pine',
    hue: 168,
    sat: 45,
    primary: '#34d399',
    defaultDarkness: 80,
    description: 'Deep Nordic spruce & dark alpine evergreen'
  },
  {
    id: 'mocha',
    name: 'Dark Mocha Bronze',
    hue: 25,
    sat: 40,
    primary: '#fb923c',
    defaultDarkness: 82,
    description: 'Earthy dark cocoa & bronze velvet'
  },
  {
    id: 'purple',
    name: 'Imperial Royal Purple',
    hue: 285,
    sat: 65,
    primary: '#c084fc',
    defaultDarkness: 80,
    description: 'Sovereign deep imperial purple'
  },
  {
    id: 'white',
    name: 'Classic Clean Light',
    hue: 215,
    sat: 20,
    primary: '#2563eb',
    defaultDarkness: 0,
    description: 'Clean high-contrast daytime corporate white'
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

// Generate full Theme Config dynamically from hue, saturation, primary and darkness slider (0 - 100)
export function computeThemeColors(
  id: string,
  name: string,
  hue: number,
  sat: number,
  primary: string,
  darkness: number
): CustomerThemeConfig {
  const clampedDarkness = Math.max(0, Math.min(100, Math.round(darkness)));

  if (clampedDarkness <= 30) {
    // Light Mode (0% to 30%)
    const lightFactor = clampedDarkness / 30; // 0.0 to 1.0

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

    const effSat = Math.min(sat, Math.round(lightFactor * 25));
    const surfaceL = Math.round(100 - lightFactor * 4); // 96% - 100%
    const pageL = Math.round(96 - lightFactor * 6);      // 90% - 96%
    const secL = Math.round(98 - lightFactor * 5);       // 93% - 98%
    const borderL = Math.round(88 - lightFactor * 8);    // 80% - 88%

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
    const darkFactor = (clampedDarkness - 30) / 70; // 0.0 to 1.0
    const effSat = sat === 0 ? 0 : Math.max(12, Math.min(sat, 55));

    // Canvas background (pageBg) - deep rich darkness
    const pageL = Math.max(1, Math.round(14 - darkFactor * 12.5));
    // Card & surface background (surfaceBg) - slightly elevated
    const surfaceL = Math.max(3, Math.round(20 - darkFactor * 15.5));
    // Wells, inputs & nested panels (secondaryBg)
    const secL = Math.max(5, Math.round(25 - darkFactor * 18.5));
    // Subtle crisp border
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

export function getPresetTheme(presetId: string, darkness?: number): CustomerThemeConfig {
  const preset = PRESET_COLORS.find((p) => p.id === presetId) || PRESET_COLORS[0];
  const d = darkness !== undefined ? darkness : preset.defaultDarkness;
  return computeThemeColors(preset.id, preset.name, preset.hue, preset.sat, preset.primary, d);
}

export function createCustomTheme(hexColor: string, darkness: number = 80): CustomerThemeConfig {
  const rgb = hexToRgb(hexColor);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const primary = hslToHex(hsl.h, Math.max(hsl.s, 60), 55);
  return computeThemeColors('custom', 'Custom Color Theme', hsl.h, hsl.s, primary, darkness);
}

// Global default theme: Midnight Navy Blue (darkness 80%)
export const DEFAULT_THEME = getPresetTheme('navy', 80);

export default function CustomerThemeWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<CustomerThemeConfig>(DEFAULT_THEME);

  const loadThemeFromStorage = () => {
    try {
      const savedThemeId = localStorage.getItem('bharatfilings_customer_theme');
      const savedDarknessStr = localStorage.getItem('bharatfilings_customer_darkness');
      const customBg = localStorage.getItem('bharatfilings_customer_bg_color');

      const darkness = savedDarknessStr !== null ? parseInt(savedDarknessStr, 10) : undefined;

      if (savedThemeId === 'custom' && customBg) {
        setTheme(createCustomTheme(customBg, darkness !== undefined ? darkness : 80));
      } else if (savedThemeId) {
        setTheme(getPresetTheme(savedThemeId, darkness));
      } else {
        setTheme(DEFAULT_THEME);
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

    window.addEventListener('bf_customer_theme_change', handleThemeChange);
    return () => window.removeEventListener('bf_customer_theme_change', handleThemeChange);
  }, []);

  return (
    <div
      id="customer-portal-theme-root"
      className="customer-portal-root min-h-screen transition-colors duration-200"
      data-is-dark={theme.isDark ? 'true' : 'false'}
      style={{
        ['--cp-surface-bg' as any]: theme.surfaceBg,
        ['--cp-page-bg' as any]: theme.pageBg,
        ['--cp-secondary-bg' as any]: theme.secondaryBg,
        ['--cp-border' as any]: theme.borderColor,
        ['--cp-text-main' as any]: theme.textColor,
        ['--cp-primary' as any]: theme.primary,
        backgroundColor: theme.pageBg,
        color: theme.textColor
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        .customer-portal-root {
          background-color: var(--cp-page-bg, #0b1329) !important;
          color: var(--cp-text-main, #f8fafc) !important;
        }
        .customer-portal-root .bg-white {
          background-color: var(--cp-surface-bg, #131e3d) !important;
          border-color: var(--cp-border, #233363) !important;
          color: var(--cp-text-main, #f8fafc);
        }
        .customer-portal-root .bg-slate-50,
        .customer-portal-root .bg-slate-50\\/50,
        .customer-portal-root .bg-slate-50\\/70,
        .customer-portal-root .bg-slate-50\\/80 {
          background-color: var(--cp-secondary-bg, #1a2752) !important;
          border-color: var(--cp-border, #233363) !important;
        }
        .customer-portal-root .bg-slate-100,
        .customer-portal-root .bg-slate-100\\/70 {
          background-color: var(--cp-secondary-bg, #1a2752) !important;
          border-color: var(--cp-border, #233363) !important;
        }
        .customer-portal-root header {
          background-color: var(--cp-surface-bg, #131e3d) !important;
          border-color: var(--cp-border, #233363) !important;
        }
        .customer-portal-root aside,
        .customer-portal-root aside > div {
          background-color: var(--cp-surface-bg, #131e3d) !important;
          border-color: var(--cp-border, #233363) !important;
        }
        .customer-portal-root[data-is-dark="true"] {
          color: #f8fafc !important;
        }
        .customer-portal-root[data-is-dark="true"] .text-slate-900,
        .customer-portal-root[data-is-dark="true"] .text-slate-800,
        .customer-portal-root[data-is-dark="true"] .text-slate-700,
        .customer-portal-root[data-is-dark="true"] .text-black,
        .customer-portal-root[data-is-dark="true"] .text-\\[\\#000000E0\\],
        .customer-portal-root[data-is-dark="true"] .customer-nav-inactive {
          color: #f8fafc !important;
        }
        .customer-portal-root[data-is-dark="true"] .text-slate-600,
        .customer-portal-root[data-is-dark="true"] .text-slate-500 {
          color: #cbd5e1 !important;
        }
        .customer-portal-root[data-is-dark="true"] .text-slate-400 {
          color: #94a3b8 !important;
        }
        .customer-portal-root[data-is-dark="true"] .border-slate-100,
        .customer-portal-root[data-is-dark="true"] .border-slate-200,
        .customer-portal-root[data-is-dark="true"] .border-slate-300 {
          border-color: var(--cp-border, #233363) !important;
        }
        .customer-portal-root[data-is-dark="true"] .divide-slate-100 > :not([hidden]) ~ :not([hidden]),
        .customer-portal-root[data-is-dark="true"] .divide-slate-200 > :not([hidden]) ~ :not([hidden]) {
          border-color: var(--cp-border, #233363) !important;
        }
        .customer-portal-root[data-is-dark="true"] input:not([type="checkbox"]):not([type="radio"]):not([type="range"]),
        .customer-portal-root[data-is-dark="true"] select,
        .customer-portal-root[data-is-dark="true"] textarea {
          background-color: var(--cp-secondary-bg, #1a2752) !important;
          color: #f8fafc !important;
          border-color: var(--cp-border, #233363) !important;
        }
        .customer-portal-root[data-is-dark="true"] input::placeholder,
        .customer-portal-root[data-is-dark="true"] textarea::placeholder {
          color: #64748b !important;
        }
        .customer-portal-root[data-is-dark="true"] table thead {
          background-color: var(--cp-page-bg, #0b1329) !important;
          color: #94a3b8 !important;
        }
        .customer-portal-root[data-is-dark="true"] table tbody tr:hover {
          background-color: var(--cp-secondary-bg, #1a2752) !important;
        }
        .customer-portal-root[data-is-dark="true"] .customer-nav-inactive svg {
          stroke: #cbd5e1 !important;
        }
        .customer-portal-root[data-is-dark="true"] .customer-nav-inactive:hover {
          color: #ffffff !important;
          background-color: var(--cp-secondary-bg, #1a2752) !important;
        }
        .customer-portal-root[data-is-dark="true"] .customer-nav-inactive:hover svg {
          stroke: #ffffff !important;
        }
        .customer-portal-root[data-is-dark="true"] .hover\\:bg-slate-50:hover,
        .customer-portal-root[data-is-dark="true"] .hover\\:bg-slate-100:hover,
        .customer-portal-root[data-is-dark="true"] .hover\\:bg-slate-100\\/70:hover {
          background-color: var(--cp-secondary-bg, #1a2752) !important;
        }
        .customer-portal-root[data-is-dark="true"] .bg-blue-50 {
          background-color: rgba(59, 130, 246, 0.2) !important;
          color: #93c5fd !important;
          border-color: rgba(59, 130, 246, 0.35) !important;
        }
        .customer-portal-root[data-is-dark="true"] .bg-blue-50\\/80 {
          background-color: rgba(59, 130, 246, 0.25) !important;
          color: #93c5fd !important;
        }
        .customer-portal-root[data-is-dark="true"] .bg-emerald-50 {
          background-color: rgba(16, 185, 129, 0.2) !important;
          color: #6ee7b7 !important;
          border-color: rgba(16, 185, 129, 0.35) !important;
        }
        .customer-portal-root[data-is-dark="true"] .bg-amber-50 {
          background-color: rgba(245, 158, 11, 0.2) !important;
          color: #fcd34d !important;
          border-color: rgba(245, 158, 11, 0.35) !important;
        }
        .customer-portal-root[data-is-dark="true"] .bg-purple-50,
        .customer-portal-root[data-is-dark="true"] .bg-violet-50 {
          background-color: rgba(168, 85, 247, 0.2) !important;
          color: #d8b4fe !important;
          border-color: rgba(168, 85, 247, 0.35) !important;
        }
        .customer-portal-root[data-is-dark="true"] .bg-red-50,
        .customer-portal-root[data-is-dark="true"] .bg-rose-50 {
          background-color: rgba(244, 63, 94, 0.2) !important;
          color: #fda4af !important;
          border-color: rgba(244, 63, 94, 0.35) !important;
        }
      ` }} />
      {children}
    </div>
  );
}
