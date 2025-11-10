'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Clock, ShoppingBag, Settings, User as UserIcon, Package } from 'lucide-react';
import DesignCard from '@/components/design/DesignCard';
import { useStore } from '@/lib/stores/useStore';
import { formatDate, formatPrice } from '@/lib/utils/helpers';

type Tab = 'designs' | 'favorites' | 'orders' | 'settings';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('designs');
  const { designs, user } = useStore();

  const favoriteDesigns = designs.filter(d => d.isFavorite);
  
  // Precompute particles once to avoid randomness in render (ESLint purity)
  const [particles, setParticles] = useState<{ left: string; top: string; delay: string; duration: string }[]>([]);
  useEffect(() => {
    const list = Array.from({ length: 15 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 3}s`,
    }));
    setParticles(list);
  }, []);
  
  // Mock orders data
  const orders = [
    {
      id: '1',
      date: new Date('2024-01-15'),
      total: 2499.99,
      status: 'completed' as const,
      items: 2,
    },
    {
      id: '2',
      date: new Date('2024-01-20'),
      total: 1799.99,
      status: 'processing' as const,
      items: 1,
    },
    {
      id: '3',
      date: new Date('2024-01-25'),
      total: 3299.99,
      status: 'pending' as const,
      items: 3,
    },
  ];

  const tabs = [
    { id: 'designs' as Tab, label: 'My Designs', icon: <Package className="w-5 h-5" />, count: designs.length },
    { id: 'favorites' as Tab, label: 'Favorites', icon: <Heart className="w-5 h-5" />, count: favoriteDesigns.length },
    { id: 'orders' as Tab, label: 'Orders', icon: <ShoppingBag className="w-5 h-5" />, count: orders.length },
    { id: 'settings' as Tab, label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'processing':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Background Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-emerald-50/10 via-white to-white" />
      
      {/* Animated Background Particles - Only render on client */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((p, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400 rounded-full animate-pulse"
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-6 mb-8 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-emerald-500/20" style={{ background: 'var(--glass-bg)' }}>
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 flex items-center justify-center text-black text-3xl font-bold shadow-2xl shadow-emerald-500/30"
            >
              {user?.name?.[0] || 'U'}
            </motion.div>
            <div>
              <h1 className="text-5xl font-playfair font-bold text-gray-900 mb-2">
                {user?.name || 'Welcome Back'}
              </h1>
              <p className="text-lg text-gray-600">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Package className="w-7 h-7" />, value: designs.length, label: 'Designs', gradient: 'from-violet-500 to-purple-600', bg: 'bg-violet-100 dark:bg-violet-900/30' },
              { icon: <Heart className="w-7 h-7" />, value: favoriteDesigns.length, label: 'Favorites', gradient: 'from-pink-500 to-rose-600', bg: 'bg-pink-100 dark:bg-pink-900/30' },
              { icon: <ShoppingBag className="w-7 h-7" />, value: orders.length, label: 'Orders', gradient: 'from-blue-500 to-cyan-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
              { icon: <Clock className="w-7 h-7" />, value: '24/7', label: 'Support', gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-100 dark:bg-green-900/30' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-4 ${stat.bg} rounded-xl mb-4 bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex flex-wrap gap-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-3 rounded-2xl shadow-xl">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/50'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab.icon}
                <span className="text-base">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    activeTab === tab.id
                      ? 'bg-white/20'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* My Designs Tab */}
          {activeTab === 'designs' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                My Designs
              </h2>
              {designs.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {designs.map((design) => (
                    <DesignCard key={design.id} design={design} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Package className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                    No Designs Yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 text-lg">
                    Start creating your first jewelry masterpiece
                  </p>
                  <motion.a
                    href="/design"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                  >
                    <Package className="w-5 h-5" />
                    Create Design
                  </motion.a>
                </div>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Favorite Designs
              </h2>
              {favoriteDesigns.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteDesigns.map((design) => (
                    <DesignCard key={design.id} design={design} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Heart className="w-24 h-24 text-pink-300 dark:text-pink-600 mx-auto mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
                    No Favorites Yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Save designs you love to access them quickly
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Order History
              </h2>
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                          Order #{order.id}
                        </p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          {formatDate(order.date)}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-xl text-sm font-bold ${getStatusColor(order.status)} capitalize shadow-md`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                      <div>
                        <p className="text-base text-gray-600 dark:text-gray-400 font-semibold">
                          📦 {order.items} item{order.items > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Account Settings
              </h2>
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl space-y-8">
                <div>
                  <label className="block text-base font-semibold text-gray-900 dark:text-white mb-3">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all shadow-md"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-900 dark:text-white mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all shadow-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notifications
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500" />
                      <span className="text-gray-700 dark:text-gray-300">Email notifications</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500" />
                      <span className="text-gray-700 dark:text-gray-300">Order updates</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-5 h-5 rounded text-violet-600 focus:ring-violet-500" />
                      <span className="text-gray-700 dark:text-gray-300">Marketing emails</span>
                    </label>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-violet-500/50 transition-all shadow-lg"
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

