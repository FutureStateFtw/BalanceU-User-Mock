'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleLogin = () => {
    const users: Record<string, { pwd: string; displayName: string }> = {
      admin: { pwd: 'July122025', displayName: 'Chris' },
      joe:   { pwd: 'July162025', displayName: 'Joe' },
      erika: {pwd: 'July222025', displayName: 'Erika'},
      drennen: {pwd: 'July232025', displayName: 'Drennen'}
    };
    const user = users[username.toLowerCase()];
    if (user && password === user.pwd) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('balanceu-user', username.toLowerCase());
      }
      router.push('/balanceu');
    } else {
      setError('Invalid credentials');
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 to-blue-700 p-6">
      <div className="w-full max-w-md text-center bg-white/10 backdrop-blur-md p-8 rounded-3xl">
        <Image
          src="/BalanceU_White_Login.png"
          alt="BalanceU Logo"
          width={320}
          height={100}
          className="mx-auto mb-10"
        />

        <input
          type="text"
          placeholder="User Name"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full mb-4 p-3 rounded-xl text-lg text-white placeholder-white bg-white/30 focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={onKeyDown}
          className="w-full mb-4 p-3 rounded-xl text-lg text-white placeholder-white bg-white/30 focus:outline-none"
        />

        <div className="flex justify-end">
          <button
            onClick={handleLogin}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition"
          >
            <ArrowRight className="text-white" />
          </button>
        </div>

        {error && <p className="text-red-200 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
