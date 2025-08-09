"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

// map theme keys to gradient classes (must match BalanceU)
const themeGradients: Record<string, string> = {
  sky:    'from-sky-600 to-blue-300',
  purple: 'from-purple-700 to-indigo-400',
  emerald:'from-emerald-600 to-green-300',
  sunset: 'from-orange-600 to-red-400',
  rose:   'from-pink-600 to-rose-400'
};

const presetAmounts = [10, 25, 50, 100];

// animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }
};

// Inner component that reads search params (can suspend) and holds interactive logic
const DepositContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeParam = searchParams.get('theme');

  const [theme, setTheme] = useState<string>('sky');
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');

  // initialize theme from URL or localStorage
  useEffect(() => {
    if (themeParam && themeGradients[themeParam]) {
      setTheme(themeParam);
    } else if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('balanceu-theme');
      if (stored && themeGradients[stored]) setTheme(stored);
    }
  }, [themeParam]);

  const gradientClass = `bg-gradient-to-b ${themeGradients[theme] || themeGradients.sky}`;
  const handleBack = () => {
    if (selectedAmount !== null) {
      setSelectedAmount(null);
    } else if (selectedBucket !== null) {
      setSelectedBucket(null);
    } else {
      router.back();
    }
  };

  return (
    <div className={`min-h-screen ${gradientClass} text-white p-6 relative`}>
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 z-50 p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>

      {/* Logo */}
      <div className="absolute top-4 left-16 z-40">
        <Image src="/balanceu-logo.png" alt="BalanceU Logo" width={140} height={40} />
      </div>

      <h1 className="text-3xl font-bold mb-6 mt-24">Deposit Funds</h1>

      <AnimatePresence mode="wait">
        {!selectedAmount ? (
          <motion.div
            key="step"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-4"
          >
            {/* Note: Bring in Balances to deposit tiles */}
            {/*Transfer Funds Between Buckets */}
            {/* Bucket selection */}
            {[ 'Dining Dollars', 'Debit Dollars' ]
              .filter(bucket => !selectedBucket || selectedBucket === bucket)
              .map(bucket => (
                <motion.div key={bucket} variants={itemVariants}>
                  <Card
                    className="bg-white/10 backdrop-blur-lg text-white border border-white/20 shadow-md cursor-pointer rounded-2xl"
                    onClick={() => setSelectedBucket(selectedBucket === bucket ? null : bucket)}
                  >
                    <CardContent className="py-4 px-6 flex justify-between items-center">
                      <h2 className="text-lg font-semibold">Deposit to {bucket}</h2>
                    </CardContent>
                  </Card>
                </motion.div>
            ))}

            {/* Amount tiles + custom input when bucket selected */}
            {selectedBucket && (
              <motion.div variants={containerVariants} className="mt-4 grid grid-cols-2 gap-4">
                {presetAmounts.map(amount => (
                  <motion.button
                    key={amount}
                    variants={itemVariants}
                    onClick={() => setSelectedAmount(amount)}
                    className="w-full bg-white/10 backdrop-blur-lg text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition"
                  >
                    ${amount}
                  </motion.button>
                ))}

                <motion.div variants={itemVariants} className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Custom"
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    className="w-full bg-white/10 backdrop-blur-lg text-white placeholder-white/70 px-4 py-3 rounded-xl focus:outline-none"
                  />
                  <button
                    onClick={() => setSelectedAmount(parseFloat(customAmount))}
                    disabled={!customAmount}
                    className="bg-white/10 backdrop-blur-lg text-white font-semibold px-4 py-3 rounded-xl hover:bg-white/20 transition disabled:opacity-50"
                  >Set</button>
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  onClick={() => setSelectedBucket(null)}
                  className="col-span-2 text-center mt-2 text-sm text-white/70 hover:underline"
                >
                  ← Change Bucket
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          // Payment options
          <motion.div
            key="payment"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.p variants={itemVariants} className="text-lg mb-4">
              You’re depositing <span className="font-semibold">${selectedAmount.toFixed(2)}</span> to{' '}
              <span className="font-semibold">{selectedBucket}</span>.
            </motion.p>
            <motion.div variants={containerVariants} className="space-y-4">
              <motion.button variants={itemVariants} className="w-full bg-white/10 backdrop-blur-lg text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition">
                Pay with Apple Pay
              </motion.button>
              <motion.button variants={itemVariants} className="w-full bg-white/10 backdrop-blur-lg text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition">
                Pay with Credit Card
              </motion.button>
            </motion.div>
            <motion.div variants={containerVariants} className="mt-4 space-y-2">
              <motion.button variants={itemVariants}
                onClick={() => setSelectedAmount(null)}
                className="text-sm text-white/70 hover:underline"
              >
                ← Change Amount
              </motion.button>
              <motion.button variants={itemVariants}
                onClick={() => { setSelectedBucket(null); setSelectedAmount(null); }}
                className="text-sm text-white/70 hover:underline"
              >
                ← Change Bucket
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Page component: wraps the param-reading child in Suspense as recommended for hooks that can suspend.
const DepositPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-gray-600 to-gray-400 text-white flex items-center justify-center">
          <div className="animate-pulse text-lg font-medium">Loading deposit interface...</div>
        </div>
      }
    >
      <DepositContent />
    </Suspense>
  );
};

export default DepositPage;

