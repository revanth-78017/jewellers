'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, Sparkles, ChevronDown } from 'lucide-react';
import { useStore } from '@/lib/stores/useStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { cart, user } = useStore();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/design', label: 'Design' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/try-on', label: 'Try On' },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-3 backdrop-blur-xl border-b border-emerald-500/20'
          : 'py-5 backdrop-blur-md'
      }`}
      style={{
        background: isScrolled
          ? 'rgba(255, 255, 255, 0.85)'
          : 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.05 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="relative flex items-center"
            >
              {/* Optional brand image (place your logo at /krk-logo.png) */}
              <img
                src="/krk-logo.png"
                alt="KRK Logo"
                className="w-10 h-10 object-contain rounded-md border border-emerald-200 shadow-sm mr-2"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/krk-logo-fallback.svg'; }}
              />

              {/* Decorative sparkles retained for motion */}
              <Sparkles className="w-6 h-6 text-emerald-400 ml-1" />
            </motion.div>

            <div>
              <span className="text-2xl font-playfair font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                KRK Jewellers
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <motion.div
                    className="relative px-5 py-2 group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span
                      className={`relative z-10 text-sm font-medium tracking-wide transition-colors duration-300 ${
                        isActive
                          ? 'text-emerald-600'
                          : 'text-gray-600 group-hover:text-emerald-600'
                      }`}
                    >
                      {link.label}
                    </span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-lg border border-emerald-500/30"
                        style={{
                          background: 'var(--glass-bg)',
                        }}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 rounded-lg bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors duration-300" />
                    
                    {/* Bottom border on hover */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent group-hover:w-full transition-all duration-300" />
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Add Product (Admin) */}
            <Link href="/admin/products">
              <motion.div
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-black font-semibold hover:opacity-90"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Add Product
              </motion.div>
            </Link>
            {/* Cart */}
            <Link href="/checkout">
              <motion.div
                className="relative p-3 rounded-lg backdrop-blur-md border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group"
                style={{
                  background: 'var(--glass-bg)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                {cart.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                  >
                    {cart.length}
                  </motion.span>
                )}
                <div className="absolute inset-0 rounded-lg bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors duration-300" />
              </motion.div>
            </Link>

            {/* User */}
            <Link href="/dashboard">
              <motion.div
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 group"
                style={{
                  background: 'var(--glass-bg)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-black font-bold text-sm">
                  {user?.name?.[0] || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">
                  {user?.name || 'Account'}
                </span>
                <div className="absolute inset-0 rounded-lg bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors duration-300" />
              </motion.div>
            </Link>

            {/* Mobile menu button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-3 rounded-lg backdrop-blur-md border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300"
              style={{
                background: 'var(--glass-bg)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-emerald-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden mt-4 mx-6 rounded-2xl overflow-hidden backdrop-blur-xl border border-emerald-500/20"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <div className="px-6 py-6 space-y-2">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-5 py-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-700'
                          : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
              
              {/* Mobile User Link */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="pt-4 border-t border-emerald-500/20"
              >
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 rounded-lg text-ivory-200 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-black font-bold">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <div>
                    <div className="font-medium">{user?.name || 'My Account'}</div>
                    <div className="text-xs text-gray-500">View Dashboard</div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

