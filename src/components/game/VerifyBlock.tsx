import React, { useCallback, useState } from 'react';
import { MiniKit, VerifyCommandInput, VerificationLevel, ISuccessResult } from '@worldcoin/minikit-js';

export const VerifyBlock = ({ onVerified }: { onVerified: () => void }) => {
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = useCallback(async () => {
    if (!MiniKit.isInstalled()) {
      console.warn("MiniKit not installed, skipping verification for dev/web");
      onVerified(); // Auto-verify in browser for testing
      return;
    }

    setIsVerifying(true);
    
    // In a real app, 'action' should be created in the World Developer Portal
    const verifyPayload: VerifyCommandInput = {
      action: 'play-tongits', 
      signal: '',
      verification_level: VerificationLevel.Orb, // Default to Orb for uniqueness
    };

    try {
      const response = await MiniKit.commandsAsync.verify(verifyPayload);
      if (response?.finalPayload?.status === 'success') {
          const payload = response.finalPayload as any;
          if (payload.verification_level) {
              // In a real app, you would send response to backend to verify proof
              console.log("Verification Success:", response);
              onVerified();
          }
      }
    } catch (error) {
      console.error("Verification failed:", error);
    } finally {
      setIsVerifying(false);
    }
  }, [onVerified]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-gray-900 rounded-xl border border-gray-700">
      <h2 className="text-xl font-bold text-white">Verify to Play</h2>
      <p className="text-gray-400 text-center text-sm">
        Verify your World ID to ensure fair play and compete with real humans.
      </p>
      <button 
        onClick={handleVerify}
        disabled={isVerifying}
        className="px-6 py-3 bg-white text-black font-bold rounded-full shadow-lg hover:bg-gray-100 disabled:opacity-50"
      >
        {isVerifying ? 'Verifying...' : 'Verify with World ID'}
      </button>
    </div>
  );
};
