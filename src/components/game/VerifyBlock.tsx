import React, { useCallback, useState } from 'react';
import { MiniKit, VerifyCommandInput, VerificationLevel, MiniAppVerifyActionErrorPayload } from '@worldcoin/minikit-js';

export const VerifyBlock = ({ onVerified }: { onVerified: () => void }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = useCallback(async () => {
    if (!MiniKit.isInstalled()) {
      console.warn("MiniKit not installed, skipping verification for dev/web");
      onVerified(); // Auto-verify in browser for testing
      return;
    }

    setIsVerifying(true);
    setError(null);
    
    // IMPORTANT: The action must match the Identifier in the World Developer Portal
    const verifyPayload: VerifyCommandInput = {
      action: 'playtongits',
      verification_level: VerificationLevel.Device, // Use Device level for broader compatibility
    };

    try {
      const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);
      
      if (finalPayload.status === 'success') {
        // In production, you should verify this proof on your backend
        // by calling MiniKit.verifyAction() or using the /api/verify-proof endpoint
        console.log("Verification Success:", finalPayload);
        onVerified();
      } else {
        // Handle error response
        const errorPayload = finalPayload as MiniAppVerifyActionErrorPayload;
        const errorMessage = getErrorMessage(errorPayload.error_code);
        console.error("Verification error:", errorPayload);
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setError("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  }, [onVerified]);

  // Map error codes to user-friendly messages
  const getErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      'verification_rejected': 'Verification was declined. Please try again.',
      'max_verifications_reached': 'You have already verified for this action.',
      'credential_unavailable': 'Your World ID credential is not available. Please complete Orb or Device verification first.',
      'malformed_request': 'There was a configuration error. Please contact support.',
      'invalid_network': 'Network mismatch. Please ensure you are using the correct environment.',
      'inclusion_proof_pending': 'Your verification is still processing. Please wait a few minutes and try again.',
      'connection_failed': 'Connection failed. Please check your internet and try again.',
    };
    return errorMessages[errorCode] || `Verification failed: ${errorCode}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-gray-900 rounded-xl border border-gray-700">
      <h2 className="text-xl font-bold text-white">Verify to Play</h2>
      <p className="text-gray-400 text-center text-sm">
        Verify your World ID to ensure fair play and compete with real humans.
      </p>
      {error && (
        <div className="w-full p-3 bg-red-900/50 border border-red-500 rounded-lg">
          <p className="text-red-300 text-center text-sm">{error}</p>
        </div>
      )}
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
