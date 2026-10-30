'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  MessageCircle, 
  Phone, 
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  currentStep?: number;
}

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Name & Stamp Suite', href: '/calculator' },
  { label: 'Dues', href: '/compliance-calendar' },
  { label: 'Packages', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' }
];

function resolveActiveFromPath(path: string): string {
  if (path === '/') return '/';
  if (path.startsWith('/services')) return '/services';
  if (path === '/calculator') return '/calculator';
  if (path === '/compliance-calendar') return '/compliance-calendar';
  if (path.startsWith('/pricing')) return '/pricing';
  if (path === '/about') return '/about';
  if (path === '/contact') return '/contact';
  return '';
}

export default function Header({ currentStep }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState<string>(() => resolveActiveFromPath(pathname));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pre-warm and prefetch routes into memory cache & browser cache
  const warmRoute = (href: string) => {
    try {
      router.prefetch(href);
      if (typeof window !== 'undefined') {
        fetch(href, { priority: 'low' }).catch(() => {});
      }
    } catch {}
  };

  useEffect(() => {
    // Warm all routes 300ms after initial page load
    const timer = setTimeout(() => {
      NAV_ITEMS.forEach((item) => warmRoute(item.href));
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Sync active item and turn off navigation indicator when route changes
  useEffect(() => {
    setIsNavigating(false);
    setActiveNav(resolveActiveFromPath(pathname));
  }, [pathname]);

  // Instant 0ms selection handler
  const handleSelectNav = (href: string) => {
    setActiveNav(href);
    if (href !== pathname) {
      setIsNavigating(true);
    }
  };

  const checkIsActive = (href: string) => {
    if (activeNav) {
      return activeNav === href;
    }
    return resolveActiveFromPath(pathname) === href;
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B1528] border-b border-slate-800 relative">
      {/* Instant Navigation Indicator Stripe */}
      {isNavigating && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-blue-500 to-indigo-500 animate-pulse z-50 shadow-sm shadow-blue-500/50" />
      )}

      {/* Sleek Minimal Top Strip */}
      <div className="bg-[#070E1A] border-b border-slate-800/80 text-slate-300 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-1.5 text-xs">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>MCA V3 Portal Operational</span>
            </span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">Govt Authorised Filing Desk</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] text-slate-300">
            <a
              href="tel:18008892244"
              className="hover:text-amber-300 transition flex items-center gap-1 font-medium cursor-pointer"
            >
              <Phone className="w-3 h-3 text-slate-400" />
              <span>1800-889-2244</span>
            </a>
            <span className="text-slate-700">•</span>
            <Link 
              href="/login" 
              prefetch={true}
              onMouseEnter={() => warmRoute('/login')}
              className={`hover:text-amber-300 transition cursor-pointer flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-md hover:bg-slate-800/60 ${
                pathname === '/login' ? 'text-amber-400 font-bold bg-amber-400/10 border border-amber-400/30' : 'text-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Portal Sign-In</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Crisp Institutional Navy Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-200 ${isScrolled ? 'h-16' : 'h-18 sm:h-20'}`}>
          {/* Brand Logo Slot - Leads to Home Page */}
          <Link 
            href="/" 
            prefetch={true}
            onClick={() => {
              handleSelectNav('/');
              if (pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center space-x-2.5 cursor-pointer group"
            title="Go to Home Page"
          >
            <div className="px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 text-slate-300 flex items-center space-x-2 group-hover:border-blue-500/60 transition shadow-inner">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 shadow-xs" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-200">
                Logo
              </span>
            </div>
          </Link>

          {/* Clean Primary Navigation Links with Instant Highlight on Click/Select */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs sm:text-sm">
            {NAV_ITEMS.map((item) => {
              const isActive = checkIsActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onMouseEnter={() => warmRoute(item.href)}
                  onPointerEnter={() => warmRoute(item.href)}
                  onMouseDown={() => handleSelectNav(item.href)}
                  onTouchStart={() => handleSelectNav(item.href)}
                  onClick={() => handleSelectNav(item.href)}
                  className={`cursor-pointer border-b-2 text-xs sm:text-sm select-none ${
                    isActive
                      ? 'text-amber-400 font-bold border-amber-400 pb-0.5'
                      : 'text-slate-200 hover:text-white font-semibold border-transparent pb-0.5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <Link
              href="/register"
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black shadow-md shadow-amber-500/20 transition cursor-pointer active:scale-95"
            >
              <span>Start Registration</span>
              <ArrowRight className="w-4 h-4 hidden sm:inline" />
            </Link>

            <a
              href="https://wa.me/919820012849?text=Hi%2C%20I%20need%20assistance%20with%20company%20registration"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/60 transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#070E1A] border-t border-slate-800/80 px-4 py-3 space-y-1 shadow-xl">
          {NAV_ITEMS.map((item) => {
            const isActive = checkIsActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                onMouseEnter={() => warmRoute(item.href)}
                onPointerEnter={() => warmRoute(item.href)}
                onMouseDown={() => handleSelectNav(item.href)}
                onTouchStart={() => handleSelectNav(item.href)}
                onClick={() => {
                  handleSelectNav(item.href);
                  setIsMobileMenuOpen(false);
                }}
                className={`block px-3.5 py-2.5 rounded-xl text-xs font-semibold select-none ${
                  isActive
                    ? 'bg-amber-400/10 text-amber-400 font-bold border-l-2 border-amber-400'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-800 mt-2">
            <Link
              href="/login"
              prefetch={true}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-800/90 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded-xl text-xs font-bold transition"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Sign In to Platform (Client / Admin)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
