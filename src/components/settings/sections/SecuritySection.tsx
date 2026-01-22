'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check, Trash2, AlertTriangle } from 'lucide-react';
import { db } from '@/lib/db/instant';
import { tx } from '@instantdb/react';

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

  // Delete all entries state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const { user } = db.useAuth();

  // Query to get all entries for deletion
  const { data } = db.useQuery(user ? { entries: { $: { where: { userId: user.id } } } } : null);
  const entries = data?.entries || [];

  const handleDeleteAllEntries = async () => {
    if (deleteConfirmText !== 'DELETE' || !user) return;

    setIsDeleting(true);
    try {
      // Delete all entries in a single transaction
      const deleteOps = entries.map((entry: { id: string }) => tx.entries[entry.id].delete());
      if (deleteOps.length > 0) {
        await db.transact(deleteOps);
      }
      setDeleteSuccess(true);
      setTimeout(() => {
        setShowDeleteConfirm(false);
        setDeleteConfirmText('');
        setDeleteSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error deleting entries:', error);
    } finally {
      setIsDeleting(false);
    }
  };

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
    <section className="pb-6 border-b border-amber-200">
      <h3 className="text-sm font-medium text-stone-600 uppercase tracking-wide mb-4">Security</h3>

      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-amber-700" />
          <div>
            <p className="text-sm font-medium text-stone-800">Privacy PIN</p>
            <p className="text-xs text-stone-600">
              {pinHash ? 'PIN is set - click to change' : 'Add extra security to your journal'}
            </p>
          </div>
        </div>
        <button
          onClick={handleChangePinClick}
          className="px-3 py-1.5 text-sm font-medium text-stone-700 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors"
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
                    <label className="block text-xs text-stone-600 mb-1">Current PIN</label>
                    <input
                      type="password"
                      value={currentPin}
                      onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="••••"
                      maxLength={4}
                      className="w-full px-3 py-2 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-center tracking-[0.5em] font-mono"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-stone-600 mb-1">New PIN</label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    maxLength={4}
                    className="w-full px-3 py-2 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-center tracking-[0.5em] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Confirm New PIN</label>
                  <input
                    type="password"
                    value={confirmNewPin}
                    onChange={(e) => setConfirmNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="••••"
                    maxLength={4}
                    className="w-full px-3 py-2 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-center tracking-[0.5em] font-mono"
                  />
                </div>

                {pinError && (
                  <p className="text-xs text-red-500 text-center">{pinError}</p>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowPinChange(false)}
                    className="flex-1 px-3 py-2 text-sm text-stone-700 bg-white border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePinChange}
                    disabled={newPin.length !== 4 || confirmNewPin.length !== 4}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-stone-800 rounded-lg hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Save PIN
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Danger Zone */}
      <div className="mt-8 pt-6 border-t border-red-200">
        <h3 className="text-sm font-medium text-red-700 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Danger Zone
        </h3>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-sm font-medium text-stone-800">Delete All Entries</p>
              <p className="text-xs text-stone-600">
                Permanently delete all {entries.length} journal {entries.length === 1 ? 'entry' : 'entries'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={entries.length === 0}
            className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete All
          </button>
        </div>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200 overflow-hidden"
            >
              {deleteSuccess ? (
                <div className="flex items-center justify-center gap-2 py-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-green-600">All entries deleted!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2 p-3 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">This action cannot be undone</p>
                      <p className="text-xs text-red-600 mt-1">
                        All {entries.length} journal {entries.length === 1 ? 'entry' : 'entries'} will be permanently deleted.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-red-600 mb-1">
                      Type DELETE to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                      placeholder="DELETE"
                      className="w-full px-3 py-2 text-sm border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-center font-mono tracking-widest"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmText('');
                      }}
                      className="flex-1 px-3 py-2 text-sm text-stone-700 bg-white border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAllEntries}
                      disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                      className="flex-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete All Entries'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
