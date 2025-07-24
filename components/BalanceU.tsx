'use client'

import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { Card, CardContent } from '@/components/ui/card'
import { X, Wallet, Gift, MessageSquareDot, ArrowDown, ArrowRight, ArrowLeft } from 'lucide-react'
import BottomMenu from '@/components/BottomMenu'
import ProfileMenu from '@/components/ProfileMenu'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface Transaction {
  name: string
  datetime: string
  amount: string
}

const themeGradients: Record<string, string> = {
  sky:     'bg-gradient-to-b from-sky-600 to-blue-300',
  purple:  'bg-gradient-to-b from-purple-700 to-indigo-400',
  emerald: 'bg-gradient-to-b from-emerald-600 to-green-300',
  sunset:  'bg-gradient-to-b from-orange-600 to-red-400',
  rose:    'bg-gradient-to-b from-pink-600 to-rose-400',
  city:    'bg-gradient-to-b from-red-900 to-red-500',
  sevenK:  'bg-gradient-to-b from-blue-800 to-blue-200',
  desert:  'bg-gradient-to-b from-red-600 to-red-300'
}

const themeHeaderBg: Record<string, string> = {
  sky: 'bg-sky-600',
  purple: 'bg-purple-700',
  emerald: 'bg-emerald-600',
  sunset: 'bg-orange-600',
  rose: 'bg-pink-600',
  city: 'bg-red-900',
  sevenK: 'bg-blue-800',
  desert: 'bg-red-600'
}

export default function BalanceU() {
  const [userId, setUserId] = useState('admin')
  const [showIntro, setShowIntro] = useState(() => typeof window !== 'undefined' && !sessionStorage.getItem('balanceu_intro_played'))
  const [transactions] = useState<Transaction[]>([
    { name: 'The Pizza Spot', datetime: '10/13/2025 @ 6:42pm', amount: '-$15.94' },
    { name: 'The Buffet',     datetime: '10/10/2025 @ 12:31pm', amount: '-1 Meal'    },
    { name: 'Coffee Place',   datetime: '10/10/2025 @ 7:04am',  amount: '-$1.27'    }
  ])
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showProfileView, setShowProfileView] = useState(false)
  const [showTransactions, setShowTransactions] = useState(false)
  const [theme, setTheme] = useState('sky')
  const [brandIndex, setBrandIndex] = useState(0)

  const textRef = useRef<HTMLHeadingElement>(null)
  const [logoWidth, setLogoWidth] = useState(0)
  const profileIconRef = useRef<HTMLDivElement>(null)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Remove scroll logic to prevent header flicker

  const userProfiles: Record<string, any> = {
    admin: { displayName: 'Chris Augustine', avatar: '/chris.png', id: '1', email: 'chris@futurestate.cloud', phone: '602-555-5555' },
    joe:   { displayName: 'Joe Harting',    avatar: '/joe.png',    id: '2', email: 'joe@futurestate.cloud',    phone: '928-555-5555' },
    erika:   { displayName: 'Erika Harting',    avatar: '/erika.png',    id: '3', email: 'erika@futurestate.cloud',    phone: '928-554-5555' },
    drennen:   { displayName: 'Drennen Brown',    avatar: '/drennen.png',    id: '4', email: 'drennen@futurestate.cloud',    phone: '928-556-5555' }
  }
  const profile = userProfiles[userId] || userProfiles.admin
  const gradientClass = themeGradients[theme] || themeGradients.sky
  const headerBg = themeHeaderBg[theme]

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!sessionStorage.getItem('balanceu_intro_played')) sessionStorage.setItem('balanceu_intro_played', 'true')
    const st = localStorage.getItem('balanceu-theme'); if (st && themeGradients[st]) setTheme(st)
    const su = localStorage.getItem('balanceu-user'); if (su) setUserId(su)
  }, [])

  useEffect(() => {
    if (!showIntro) return
    const t = setTimeout(() => setShowIntro(false), 2000)
    return () => clearTimeout(t)
  }, [showIntro])

  useEffect(() => {
    if (brandIndex === 0 && textRef.current) setLogoWidth(textRef.current.offsetWidth)
  }, [brandIndex])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node) &&
        profileIconRef.current && !profileIconRef.current.contains(e.target as Node)
      ) setShowProfileMenu(false)
    }
    if (showProfileMenu) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [showProfileMenu])

  const handleChangeTheme = (key: string) => { setTheme(key); localStorage.setItem('balanceu-theme', key); setShowProfileMenu(false) }
  const handleShowProfile = () => { setShowProfileMenu(false); setShowProfileView(true) }
  const toggleBrand = () => setBrandIndex(i => (i + 1) % 3)
  const handleTransactionClick = (tx: Transaction) => setSelectedTransaction(tx)
  const handleBack = () => setSelectedTransaction(null)
  const navigateToDeposit = () => router.push(`/deposit?theme=${theme}`)
  const navigateToRequestFunds = () => router.push(`/requestFunds?theme=${theme}`)

  return (
    <>      
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      

      {/* Pinned Header - always visible */}
      <header className={`fixed top-0 left-0 right-0 ${headerBg} pt-[constant(safe-area-inset-top)] pt-[env(safe-area-inset-top)] z-20`}>        
        <div className="px-4 py-3 flex justify-between items-start">
          <div onClick={toggleBrand} className="flex flex-col cursor-pointer">
            {brandIndex === 0 ? (
              <h1 ref={textRef} className="text-4xl font-bold text-white">Balance<span className="text-yellow-400">U</span></h1>
            ) : brandIndex === 1 ? (
              <img src="/ASU-logo.png" alt="ASU" style={{ width: logoWidth, height: 'auto' }} />
            ) : (
              <img src="/NAU_Logo.png" alt="NAU" style={{ width: logoWidth, height: 'auto' }} />
            )}
            <p className="text-white/80 text-sm mt-1">{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'})}</p>
          </div>
          <div ref={profileIconRef} className="relative flex items-center gap-2">
            <div className="text-right text-white">
              <p className="text-sm">Welcome</p>
              <p className="font-semibold text-base">{profile.displayName.split(' ')[0]}</p>
            </div>
            <button onClick={() => setShowProfileMenu(v => !v)} className="p-2 rounded-full hover:bg-white/10 transition">
              <img src={profile.avatar} alt={profile.displayName} className="w-10 h-10 rounded-full border-2 border-white object-cover" />
            </button>
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div ref={profileMenuRef} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="absolute top-full right-0 mt-2 z-50">
                  <ProfileMenu onClose={() => setShowProfileMenu(false)} onChangeTheme={handleChangeTheme} onShowProfile={handleShowProfile} userName={profile.displayName.split(' ')[0]} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className={`${gradientClass} pt-[calc(3rem+env(safe-area-inset-top))] pb-[calc(3rem+env(safe-area-inset-bottom))] min-h-screen text-white px-4`}>        
        <AnimatePresence>
          {showIntro && (
            <motion.div key="splash" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className={`${gradientClass} fixed inset-0 flex items-center justify-center z-50 text-6xl font-bold text-white`}>Welcome {profile.displayName}</motion.div>
          )}
        </AnimatePresence>

        {!showIntro && (
          <>
            {/* spacer */}
            <div className="h-[calc(3rem+env(safe-area-inset-top))]" />
            {/* profile modal */}
            <AnimatePresence>
              {showProfileView && (
                <>
                  <motion.div className="fixed inset-0 bg-black bg-opacity-60 z-50 cursor-pointer" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => setShowProfileView(false)} />
                  <motion.div className="fixed inset-0 flex items-center justify-center z-60" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div className="w-96 bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden relative backdrop-filter">
                      <button onClick={() => setShowProfileView(false)} className="absolute th top-3 right-3 p-1 rounded-full hover:bg-white/20 transition z-20">
                        <X className="w-5 h-5 text-white" />
                      </button>
                      <div className="p-6 pt-10 text-center text-white space-y-2">
                        <h2 className="text-2xl font-bold">{profile.displayName}</h2>
                        <p className="text-sm">ID: {profile.id}</p>
                        <p className="text-sm">Email: {profile.email}</p>
                        <p className="text-sm">Phone: {profile.phone}</p>
                      </div>
                      <div className="w-full h-auto relative">
                        <img src={profile.avatar} alt={profile.displayName} className="w-full h-auto object-contain" />
                        <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 py-2 px-4 rounded-full backdrop-blur-sm text-gray-800 hover:bg-opacity-90 transition">Update Photo</button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Main content / Transactions */}
            <AnimatePresence mode="wait">
              {!selectedTransaction ? (
                <motion.div
                  key="main"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-semibold mb-3">Overview</h2>
                  <section className="space-y-2">
                    {/* Dining Dollars Card */}
                    <Card className="rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-md">
                      <CardContent className="flex items-center justify-between px-4 py-2 h-[56px]">
                        <div className="leading-tight">
                          <div className="text-2xl font-extrabold text-white">$1.12</div>
                          <div className="text-sm text-white/70 mt-0.5">Dining Dollars</div>
                        </div>
                        <div
                          className="flex flex-col items-center text-white/90 hover:text-white transition cursor-pointer"
                          onClick={navigateToDeposit}
                        >
                          <Wallet className="w-5 h-5 mb-1" />
                          <span className="text-xs font-medium">Deposit</span>
                        </div>
                      </CardContent>
                    </Card>

              {/* Debit Dollars Card */}
              <Card className="rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-md">
                <CardContent className="flex items-center justify-between px-4 py-2 h-[56px]">
                  <div className="leading-tight">
                    <div className="text-2xl font-extrabold text-white">$177.73</div>
                    <div className="text-sm text-white/70 mt-0.5">Debit Dollars</div>
                  </div>
                  <div
                    className="flex flex-col items-center text-white/90 hover:text-white transition cursor-pointer"
                    onClick={navigateToDeposit}
                  >
                    <Wallet className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium">Deposit</span>
                  </div>
                </CardContent>
              </Card>

              {/* Meal Taps Card */}
              <Card className="rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-md">
                <CardContent className="flex items-center justify-between px-4 py-2 h-[56px]">
                  <div className="leading-tight">
                    <div className="text-2xl font-extrabold text-white">121</div>
                    <div className="text-sm text-white/70 mt-0.5">Meal Taps</div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-white/70">Available This Week</span>
                    <div className="text-xl font-bold leading-tight text-white">4</div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Recent Transactions Section */}
            <section className="mt-6">
              <Card className="bg-white/10 text-white backdrop-blur-lg border border-white/20 shadow-md rounded-2xl">
                <CardContent
                  className="flex justify-between items-center py-3 cursor-pointer"
                  onClick={() => setShowTransactions(!showTransactions)}
                >
                  <div className="font-semibold text-lg">Recent Transactions</div>
                  <ArrowDown
                    className={`transition-transform ${showTransactions ? 'rotate-180' : 'rotate-0'}`}
                  />
                </CardContent>
                <AnimatePresence initial={false}>
                  {showTransactions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="px-4 pb-3 space-y-2"
                    >
                      {transactions.map((tx, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center border-b border-white/20 pb-1 text-base hover:bg-white/10 px-2 py-1 rounded-lg transition cursor-pointer"
                          onClick={() => handleTransactionClick(tx)}
                        >
                          <div>
                            <div className="font-semibold text-base flex items-center gap-2">
                              {tx.name}
                            </div>
                            <div className="text-sm text-white/60">{tx.datetime}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-right font-semibold text-base">{tx.amount}</div>
                            <ArrowRight size={18} className="text-white/60" />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </section>

            {/* Quick Actions Section */}
            <section className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
              <div className="grid grid-cols-3 gap-4">
                <Card
                  onClick={navigateToRequestFunds}
                  className="bg-white/10 text-white backdrop-blur-lg border border-white/20 shadow-md text-center py-4 rounded-2xl cursor-pointer"
                >
                  <CardContent>
                    <MessageSquareDot className="mx-auto mb-2" size={32} />
                    <div className="font-semibold">Request Funds</div>
                  </CardContent>
                </Card>
                <Card
                  onClick={navigateToDeposit}
                  className="bg-white/10 text-white backdrop-blur-lg border border-white/20 shadow-md text-center py-4 rounded-2xl cursor-pointer"
                >
                  <CardContent>
                    <Wallet className="mx-auto mb-2" size={32} />
                    <div className="font-semibold">Deposit Funds</div>
                  </CardContent>
                </Card>
                <Card className="bg-white/10 text-white backdrop-blur-lg border border-white/20 shadow-md text-center py-4 rounded-2xl">
                  <CardContent>
                    <Gift className="mx-auto mb-2" size={32} />
                    <div className="font-semibold">Gift Meals</div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </motion.div>
        ) : selectedTransaction?.name === 'The Pizza Spot' ? (
          <motion.div
            key="pizzaReceipt"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl overflow-hidden"
          >
            <img src="/pizza-header.png" alt="Pizza" className="w-full h-56 object-cover" />
            <div className="bg-white text-black p-4">
              <button onClick={handleBack} className="mb-2 flex items-center text-blue-600 hover:underline">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </button>
              <h2 className="text-2xl font-bold">The Pizza Spot</h2>
              <p className="text-sm text-gray-500">4 hours ago</p>
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <p>2 Slice Combo + Drink</p>
                  <p className="font-semibold">$7.34</p>
                </div>
                <div className="flex justify-between items-center">
                  <p>6 Wings</p>
                  <p className="font-semibold">$5.34</p>
                </div>
                <div className="border-t border-gray-300 my-2"></div>
                <div className="flex justify-between items-center">
                  <p className="font-bold">Total</p>
                  <p className="font-bold">$12.68</p>
                </div>
                <p className="text-sm text-gray-500">Dining Dollars</p>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold">Location Transaction History</h3>
                <ul className="divide-y divide-gray-200">
                  <li className="flex justify-between py-2">
                    <span>5/13/2025</span>
                    <span>$15.94</span>
                  </li>
                  <li className="flex justify-between py-2">
                    <span>4/10/2025</span>
                    <span>$9.27</span>
                  </li>
                  <li className="flex justify-between py-2">
                    <span>4/10/2025</span>
                    <span>$1.27</span>
                  </li>
                </ul>
                <p className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer">
                  View All
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

            {/* Bottom Menu */}
            <div className="fixed bottom-4 inset-x-0 flex justify-center z-50">
              <BottomMenu />
            </div>
          </>
        )}
      </div>
    </>
  )
}
