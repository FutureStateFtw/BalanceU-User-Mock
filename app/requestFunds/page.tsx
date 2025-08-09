"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

// Theme gradients (match BalanceU)
const themeGradients: Record<string, string> = {
  sky:     'from-sky-600 to-blue-300',
  purple:  'from-purple-700 to-indigo-400',
  emerald: 'from-emerald-600 to-green-300',
  sunset:  'from-orange-600 to-red-400',
  rose:    'from-pink-600 to-rose-400',
};

// Preset deposit amounts
const presetAmounts = [10, 25, 50, 100];

// Animation variants
const container: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

// Inner component to access search params (can suspend)
const RequestFundsContent: React.FC = () => {
  // Sample data for recent deposits by others
  const recentDeposits = [
    { id: 1, from: 'Alice', bucket: 'Dining Dollars', amount: 25, date: '07/15/2025' },
    { id: 2, from: 'Bob', bucket: 'Debit Dollars', amount: 50, date: '07/14/2025' },
    { id: 3, from: 'Charlie', bucket: 'Dining Dollars', amount: 10, date: '07/13/2025' }
  ];
  const router = useRouter();
  const params = useSearchParams();
  const themeParam = params.get('theme');

  const [theme, setTheme] = useState<string>('sky');
  const [bucket, setBucket] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [shareLink, setShareLink] = useState<string>('');
  const [shareLoading, setShareLoading] = useState<boolean>(false);

  // Load theme
  useEffect(() => {
    if (themeParam && themeGradients[themeParam]) {
      setTheme(themeParam);
    } else if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('balanceu-theme');
      if (saved && themeGradients[saved]) setTheme(saved);
    }
  }, [themeParam]);

  // Generate share link when bucket & amount are set
  useEffect(() => {
    if (bucket && amount !== null) {
      const id = crypto.randomUUID();
      setShareLink(`${window.location.origin}/requestFunds?id=${id}`);
    }
  }, [bucket, amount]);

  const gradientClass = `bg-gradient-to-b ${themeGradients[theme] || themeGradients.sky}`;

  // Back button logic
  const handleBack = () => {
    if (amount !== null) {
      setAmount(null);
    } else if (bucket) {
      setBucket(null);
    } else {
      router.back();
    }
  };

  return (
    <div className={`min-h-screen ${gradientClass} text-white p-6 relative`}>
      {/* Back + Logo */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>
      <div className="absolute top-4 left-16 z-40">
        <Image src="/balanceu-logo.png" alt="BalanceU Logo" width={140} height={40} />
      </div>

      <h1 className="text-3xl font-bold mb-6 mt-24">Request Funds</h1>
      <p className="mb-6 text-white/80">Generate a unique link to allow friends or family to securely deposit funds directly into your account. Select your bucket and amount below to get started.</p>

      <AnimatePresence mode="wait">
        {amount === null ? (
          <motion.div
            key="select"
            variants={container}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-6"
          >
            {/* Bucket selection */}
            <motion.div layout variants={container} className="grid grid-cols-2 gap-4">
              {['Dining Dollars', 'Debit Dollars']
                .filter(b => !bucket || bucket === b)
                .map((b) => (
                  <motion.div
                    key={b}
                    layout
                    variants={item}
                    className={`${bucket === b ? 'col-span-2' : ''}`}
                  >
                    <Card
                      onClick={() => setBucket(bucket === b ? null : b)}
                      className={`bg-white/10 backdrop-blur-lg text-white border border-white/20 shadow-md cursor-pointer rounded-2xl ${
                        bucket === b ? 'ring-2 ring-white/50 col-span-2' : ''
                      }`}
                    >
                      <CardContent className="py-4 px-6">
                        <h2 className="text-lg font-semibold">To {b}</h2>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </motion.div>

            {/* Amount selection */}
            {bucket && (
              <motion.div layout variants={container} className="grid grid-cols-2 gap-4">
                {presetAmounts.map((a) => (
                  <motion.button
                    key={a}
                    variants={item}
                    onClick={() => setAmount(a)}
                    className="w-full bg-white/10 backdrop-blur-lg text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition"
                  >
                    ${a}
                  </motion.button>
                ))}
                <motion.div key="custom" variants={item} className="flex gap-2 col-span-2">
                  <input
                    type="number"
                    placeholder="Custom"
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    className="w-full bg-white/10 backdrop-blur-lg text-white placeholder-white/70 px-4 py-3 rounded-xl focus:outline-none"
                  />
                  <button
                    onClick={() => {} /* optional apply handler */}
                    className="bg-white/10 backdrop-blur-lg text-white font-semibold px-4 py-3 rounded-xl hover:bg-white/20 transition"
                  >
                    Apply
                  </button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="share"
            variants={container}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-4"
          >
            <motion.p variants={item} className="text-lg mb-2">
              This unique link allows someone to deposit <span className="font-semibold">${amount}</span> to your <span className="font-semibold">{bucket}</span> account.
            </motion.p>
            <motion.div variants={item} className="flex gap-2">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="w-full bg-white/10 backdrop-blur-lg text-white px-4 py-3 rounded-xl focus:outline-none"
              />
              <button
                onClick={() => navigator.clipboard.writeText(shareLink)}
                className="bg-white/10 backdrop-blur-lg text-white font-semibold px-4 py-3 rounded-xl hover:bg-white/20 transition"
              >
                Copy Link
              </button>
            </motion.div>
            {navigator.share && (
              <motion.button
                variants={item}
                onClick={async () => {
                  if (shareLoading) return;
                  setShareLoading(true);
                  try {
                    await navigator.share({ title: 'Request Funds', url: shareLink });
                  } catch {
                    /* silent */
                  } finally {
                    setShareLoading(false);
                  }
                }}
                disabled={shareLoading}
                className={`w-full bg-white/10 backdrop-blur-lg text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition ${
                  shareLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {shareLoading ? 'Sharing...' : 'Share'}
              </motion.button>
            )}
            <motion.div variants={container} className="mt-4 space-y-2">
              <motion.button variants={item} onClick={() => setAmount(null)} className="text-sm text-white/70 hover:underline">
                ← Change Amount
              </motion.button>
              <motion.button variants={item} onClick={() => setBucket(null)} className="text-sm text-white/70 hover:underline">
                ← Change Bucket
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent requests table */}
      {!bucket && amount === null && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Recent Fulfilled Requests</h2>
          <div className="overflow-x-auto bg-white/10 backdrop-blur-lg rounded-lg">
            <table className="min-w-full text-left text-white">
              <thead>
                <tr>
                  <th className="px-4 py-2">From</th>
                  <th className="px-4 py-2">Bucket</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentDeposits.map((r) => (
                  <tr key={r.id} className="border-t border-white/20">
                    <td className="px-4 py-2">{r.from}</td>
                    <td className="px-4 py-2">{r.bucket}</td>
                    <td className="px-4 py-2">${r.amount}</td>
                    <td className="px-4 py-2">{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

const RequestFundsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-sky-600 to-blue-300 text-white p-6 flex items-center justify-center">
          <div className="animate-pulse text-lg font-medium">Loading request funds...</div>
        </div>
      }
    >
      <RequestFundsContent />
    </Suspense>
  );
};

export default RequestFundsPage;
