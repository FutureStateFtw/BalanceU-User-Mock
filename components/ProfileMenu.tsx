'use client'

import React, { useState } from 'react'
import { X, User, Palette, UserCircle } from 'lucide-react'

interface ProfileMenuProps {
  onClose: () => void
  onChangeTheme: (theme: string) => void
  onShowProfile?: () => void
  userName: string
}

interface HeaderProps {
  userName: string
}

const PROFILE_THEMES = [
  { key: 'sky',     label: 'Blue Sky'                 },
  { key: 'purple',  label: 'The Big Apple University' },
  { key: 'emerald', label: 'Emerald State College'    },
  { key: 'sunset',  label: 'Sunset Valley Institute'  },
  { key: 'rose',    label: 'Rosewood Academy'         },
  { key: 'city',    label: 'The City'                 },
  { key: 'sevenK',  label: '7000 Feet'                },
  { key: 'desert',  label: 'The Desert'               }
]

const PREVIEW_BG: Record<string, string> = {
  sky:     'bg-gradient-to-b from-sky-600 to-blue-300',
  purple:  'bg-gradient-to-b from-purple-700 to-indigo-400',
  emerald: 'bg-gradient-to-b from-emerald-600 to-green-300',
  sunset:  'bg-gradient-to-b from-orange-600 to-red-400',
  rose:    'bg-gradient-to-b from-pink-600 to-rose-400',
  // ASU: maroon to lighter red
  city:    'bg-gradient-to-b from-red-900 to-red-400',
  // NAU: dark blue to lighter blue
  sevenK:  'bg-gradient-to-b from-blue-800 to-blue-200',
  // UofA: red to lighter red
  desert:  'bg-gradient-to-b from-red-600 to-red-300'
}

// Main header with profile button and profile menu
export const Header: React.FC<HeaderProps> = ({ userName }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme]       = useState('sky')
  const [showProfileView, setShowProfileView] = useState(false)

  // Update both local state and apply global theme logic
  const handleChangeTheme = (newTheme: string) => {
    setTheme(newTheme)
    // TODO: Insert actual theme-application logic here, e.g., document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleShowProfile = () => {
    setMenuOpen(false)
    setShowProfileView(true)
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="p-2 rounded-full hover:bg-white/10 transition"
        >
          <UserCircle className="w-6 h-6 text-white" />
        </button>

        {menuOpen && (
          <div className="absolute top-12 right-2">
            <ProfileMenu
              onClose={() => setMenuOpen(false)}
              onChangeTheme={handleChangeTheme}
              onShowProfile={handleShowProfile}
              userName={userName}
            />
          </div>
        )}
      </div>

      {showProfileView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-96 bg-white rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{userName}'s Profile</h2>
              <button
                onClick={() => setShowProfileView(false)}
                className="p-1 rounded-full hover:bg-gray-200 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Full profile details here */}
            <p className="mb-2">Email: user@example.com</p>
            <p className="mb-2">Role: Student</p>
            <p className="mb-2">Member since: January 2024</p>
          </div>
        </div>
      )}
    </>
  )
}

// Profile menu component with profile link handling
const ProfileMenu: React.FC<ProfileMenuProps> = ({ onClose, onChangeTheme, onShowProfile, userName }) => {
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)

  const handleSelect = (key: string) => {
    onChangeTheme(key)
    setThemeMenuOpen(false)
    onClose()
  }

  return (
    <div className="w-72 rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-md z-50 p-4 text-white">
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-lg font-bold">Welcome {userName}</p>
          <p className="text-sm text-white/70">Student</p>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition">
          <X className="w-5 h-5 text-white/70" />
        </button>
      </div>

      <div className="text-sm text-white/70 mb-1">STUDENT ID: 123456</div>
      <div className="text-sm text-white/70 mb-4">The University of BalanceU</div>

      <hr className="border-white/20 mb-2" />

      <div
        className="flex items-center justify-between py-2 cursor-pointer hover:bg-white/10 rounded-lg px-2"
        onClick={() => { if (onShowProfile) onShowProfile(); else onClose(); }}
      >
        <span className="text-base">Profile</span>
        <User className="w-5 h-5 text-white/70" />
      </div>

      <div
        className="flex items-center justify-between py-2 cursor-pointer hover:bg-white/10 rounded-lg px-2"
        onClick={() => setThemeMenuOpen(prev => !prev)}
      >
        <span className="text-base">Theme</span>
        <Palette className="w-5 h-5 text-white/70" />
      </div>

      {themeMenuOpen && (
        <div className="mt-2 space-y-2">
          {PROFILE_THEMES.map(t => (
            <div
              key={t.key}
              className="flex items-center gap-2 py-2 px-2 hover:bg-white/10 rounded-lg cursor-pointer"
              onClick={() => handleSelect(t.key)}
            >
              <div className={`w-4 h-4 rounded-full ${PREVIEW_BG[t.key]}`}></div>
              <span className="text-base">{t.label}</span>
            </div>
          ))}
        </div>
      )}

      <hr className="border-white/20 my-2" />

      <div className="text-right">
        <button className="text-sm font-semibold text-white hover:underline">
          Log Out
        </button>
      </div>
    </div>
  )
}

export default ProfileMenu