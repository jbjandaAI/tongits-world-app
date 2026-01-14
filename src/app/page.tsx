'use client';

import { useState, useEffect } from 'react';
import { GameTable } from '@/components/game/GameTable';
import { VerifyBlock } from '@/components/game/VerifyBlock';

export default function Home() {
  const [isVerified, setIsVerified] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gray-950 text-white">
      <div className="w-full max-w-md flex-1 flex flex-col">
        {!isVerified ? (
          <div className="flex-1 flex items-center justify-center">
            <VerifyBlock onVerified={() => setIsVerified(true)} />
          </div>
        ) : (
          <GameTable />
        )}
      </div>
    </main>
  );
}
