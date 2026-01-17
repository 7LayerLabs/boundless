'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { MessageSquarePlus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Update {
  id: string;
  content: string;
  createdAt: number;
}

interface EntryUpdatesProps {
  updates: Update[];
  fontClassName: string;
  onAddUpdate: (text: string) => Promise<void>;
}

export function EntryUpdates({ updates, fontClassName, onAddUpdate }: EntryUpdatesProps) {
  const [showUpdateInput, setShowUpdateInput] = useState(false);
  const [updateText, setUpdateText] = useState('');

  const handleAddUpdate = async () => {
    if (updateText.trim()) {
      await onAddUpdate(updateText.trim());
      setUpdateText('');
      setShowUpdateInput(false);
    }
  };

  return (
    <div className="mt-6 pt-4 border-t-2 border-dashed border-amber-300">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
          <MessageSquarePlus className="w-4 h-4" />
          Updates
        </h3>
        {!showUpdateInput && (
          <button
            onClick={() => setShowUpdateInput(true)}
            className="text-xs px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-700 transition-all"
          >
            + Add Update
          </button>
        )}
      </div>

      {/* Existing Updates */}
      {updates && updates.length > 0 && (
        <div className="space-y-3 mb-4">
          {updates.map((update) => (
            <div
              key={update.id}
              className="p-3 bg-amber-50 rounded-lg border border-amber-200"
            >
              <p className="text-xs text-amber-500 mb-1">
                {format(new Date(update.createdAt), 'MMM d, yyyy h:mm a')}
              </p>
              <p className={cn('text-amber-900', fontClassName)}>
                {update.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* New Update Input */}
      {showUpdateInput && (
        <div className="p-3 bg-white rounded-lg border-2 border-amber-300">
          <textarea
            value={updateText}
            onChange={(e) => setUpdateText(e.target.value)}
            placeholder="Add an update to this entry..."
            className={cn(
              'w-full min-h-[80px] p-2 rounded border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none',
              fontClassName
            )}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                setShowUpdateInput(false);
                setUpdateText('');
              }}
              className="px-3 py-1 text-sm text-amber-600 hover:text-amber-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUpdate}
              disabled={!updateText.trim()}
              className="px-4 py-1 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Update
            </button>
          </div>
        </div>
      )}

      {!updates?.length && !showUpdateInput && (
        <p className="text-sm text-amber-400 italic">
          No updates yet. Add one to note how things changed.
        </p>
      )}
    </div>
  );
}
