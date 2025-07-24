'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wallet,
  HeartHandshake,
  ScrollText,
  Info,
  MessageSquareQuoteIcon,
  LayoutGrid,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePathname, useRouter } from 'next/navigation'

const menuItems = [
  { label: 'View Balances', icon: LayoutGrid },
  { label: 'Gift/Donate Meals', icon: HeartHandshake },
  { label: 'Deposit Funds', icon: Wallet },
  { label: 'View Transactions', icon: ScrollText },
  { label: 'Meal Plan Information', icon: Info },
  { label: 'Contact Support', icon: MessageSquareQuoteIcon },
]

const BottomMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  const isReceiptPage = pathname.includes('/transactions/')

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleItemClick = (label: string) => {
    setIsOpen(false)
    if (label === 'Deposit Funds') {
      router.push('/deposit')
    }
    // Additional navigation logic for other items…
  }

  return (
    <>
      <Button
        ref={buttonRef}
        className={`px-6 py-3 rounded-full shadow-lg transition-colors duration-200 border font-semibold text-base
          ${isReceiptPage
            ? 'bg-white text-black border-black/20 hover:bg-black/10'
            : 'bg-white/30 text-white border-white/30 hover:bg-white/40 backdrop-blur-md'}
        `}
        onClick={() => setIsOpen(true)}
      >
        Navigate
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }} animate={{ opacity: 0.01 }} exit={{ opacity: 0 }}
            />

            <motion.div
              ref={menuRef}
              className="fixed inset-x-0 bottom-0 z-50 flex justify-center"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div
                className={`relative w-full max-w-md backdrop-blur-xl rounded-t-3xl p-6 shadow-2xl z-50
                  ${isReceiptPage
                    ? 'bg-white text-black border border-black/10'
                    : 'bg-white/10 text-white border border-white/20'}`}
              >
                <nav className="space-y-4">
                  {menuItems.map(({ label, icon: Icon }, idx) => (
                    <div key={label} onClick={() => handleItemClick(label)}>
                      <div
                        className={`flex items-center gap-3 text-lg font-medium hover:opacity-90 cursor-pointer
                          ${isReceiptPage ? 'text-black' : 'text-white'}`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{label}</span>
                      </div>
                      {idx < menuItems.length - 1 && (
                        <div className={`border-b my-2 ${isReceiptPage ? 'border-black/10' : 'border-white/20'}`} />
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default BottomMenu