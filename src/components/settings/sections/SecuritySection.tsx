'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check } from 'lucide-react';

// Hash function using SHA-256
async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface SecuritySectionProps {
  pinHash: string | undefined;
  updateSetting: (key: any, value: any) => Promise<void> | void;
}

export function SecuritySection({ pinHash, updateSetting }: SecuritySectionProps) {
  const [showPinChange, setShowPinChange] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  const handleChangePinClick = () => {
    setShowPinChange(true);
    setCurrentPin('');
    setNewPin('');
    setConfirmNewPin('');
    setPinError('');
    setPinSuccess(false);
  };

  const handlePinChange = async () => {
    setPinError('');
    setPinSuccess(false);

    // Validate current PIN
    if (pinHash) {
      const currentHash = await hashPin(currentPin);
      if (currentHash !== pinHash) {
        setPinError('Current PIN is incorrect');
        return;
      }
    }

    // Validate new PIN
    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setPinError('PIN must be exactly 4 digits');
      return;
    }

    if (newPin !== confirmNewPin) {
      setPinError('New PINs do not match');
      return;
    }

    // Save new PIN
    const newHash = await hashPin(newPin);
    await updateSetting('pinHash', newHash);

    setPinSuccess(true);
    setTimeout(() => {
      setShowPinChange(false);
      setPinSuccess(false);
    }, 1500);
  };

  return (
    <section className="pb-6 border-b border-amber-100">
      <h3 className="text-sm font-medium text-amber-800 mb-4">Security</h3>

      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-800">Privacy PIN</p>
            <p className="text-xs text-amber-500">
              {pinHash ? 'PIN is set - click to change' : 'Add extra security to your journal'}
            </p>
          </div>
        </div>
        <button
          onClick={handleChangePinClick}
          className="px-3 py-1.5 text-sm font-medium text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
        >
          {pinHash ? 'Change PIN' : 'Set PIN'}
        </button>
      </div>

      {/* PIN Change Form */}
      <AnimatePresence>
        {showPinChange && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200 overflow-hidden"
          >
            {pinSuccess ? (
              <div className="flex items-center justify-center gap-2 py-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm font-medium text-green-600">PIN updated successfully!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pinHash && (
                  <div>
                    <label className="block text-xs text-amber-600 mb-1">Current PIN</label>
                    <input
                      type="password"
                      value={currentPin}
                      onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="••••"
                      maxLength={4}
                      className="w-full px-3 py-2 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-center tracking-[0.5em] font-mono"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-amber-600 mb-1">New PIN</label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    maxLength={4}
                    className="w-full px-3 py-2 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-center tracking-[0.5em] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-amber-600 mb-1">Confirm New PIN</label>
                  <input
                    type="password"
                    value={confirmNewPin}
                    onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    maxLength={4}
                    className="w-full px-3 py-2 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-center tracking-[0.5em] font-mono"
                  />
                </div>

                {pinError && (
                  <p className="text-xs text-red-500 text-center">{pinError}</p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowPinChange(false)}
                    className="flex-1 px-3 py-2 text-sm text-amber-700 bg-white border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePinChange}
                    disabled={newPin.length !== 4 || confirmNewPin.length !== 4}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Save PIN
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
