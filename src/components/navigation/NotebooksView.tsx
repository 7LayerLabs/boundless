'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Book, Plus, Check, Trash2, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { db, type Notebook } from '@/lib/db/instant';
import { id, tx } from '@instantdb/react';
import { useSettings } from '@/hooks/useSettings';

interface NotebooksViewProps {
  onClose: () => void;
  onSelectNotebook: (notebookId: string | null) => void;
}

const notebookColors = [
  { id: 'brown', color: '#6b4423', name: 'Brown' },
  { id: 'black', color: '#1a1a1a', name: 'Black' },
  { id: 'teal', color: '#2d6a6a', name: 'Teal' },
  { id: 'burgundy', color: '#722f37', name: 'Burgundy' },
  { id: 'navy', color: '#1e3a5f', name: 'Navy' },
  { id: 'forest', color: '#2d5a27', name: 'Forest' },
  { id: 'purple', color: '#5b3a6b', name: 'Purple' },
  { id: 'coral', color: '#c75d5d', name: 'Coral' },
];

export function NotebooksView({ onClose, onSelectNotebook }: NotebooksViewProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [selectedColor, setSelectedColor] = useState(notebookColors[0].id);
  const { currentNotebookId, updateSetting } = useSettings();
  const { user } = db.useAuth();

  // Query notebooks
  const query = user
    ? {
        notebooks: {
          $: {
            where: {
              userId: user.id,
            },
          },
        },
      }
    : null;

  const { data } = db.useQuery(query);
  const notebooks = (data?.notebooks || []) as Notebook[];

  const handleCreate = async () => {
    if (!user || !newName.trim()) return;

    const notebookId = id();
    await db.transact([
      tx.notebooks[notebookId].update({
        userId: user.id,
        name: newName.trim(),
        color: selectedColor,
        isDefault: notebooks.length === 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }),
    ]);

    setNewName('');
    setSelectedColor(notebookColors[0].id);
    setIsCreating(false);
  };

  const handleUpdate = async (notebookId: string, name: string) => {
    await db.transact([
      tx.notebooks[notebookId].update({
        name: name.trim(),
        updatedAt: Date.now(),
      }),
    ]);
    setEditingId(null);
  };

  const handleDelete = async (notebookId: string) => {
    if (!confirm('Are you sure you want to delete this notebook? Entries will not be deleted.')) return;

    await db.transact([tx.notebooks[notebookId].delete()]);

    if (currentNotebookId === notebookId) {
      await updateSetting('currentNotebookId', '');
      onSelectNotebook(null);
    }
  };

  const handleSelect = async (notebookId: string | null) => {
    await updateSetting('currentNotebookId', notebookId || '');
    onSelectNotebook(notebookId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-amber-600" />
            <h2 className="font-semibold text-gray-800">Notebooks</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Notebooks List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* All Entries Option */}
          <button
            onClick={() => handleSelect(null)}
            className={cn(
              'w-full flex items-center gap-3 p-3 rounded-xl transition-colors',
              !currentNotebookId
                ? 'bg-amber-100 border-2 border-amber-500'
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
            )}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#d4af37' }}
            >
              <Book className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-gray-800">All Entries</p>
              <p className="text-xs text-gray-500">View all journal entries</p>
            </div>
            {!currentNotebookId && <Check className="w-5 h-5 text-amber-600" />}
          </button>

          {/* Existing Notebooks */}
          {notebooks.map((notebook) => (
            <div
              key={notebook.id}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl transition-colors',
                currentNotebookId === notebook.id
                  ? 'bg-amber-100 border-2 border-amber-500'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              )}
            >
              <button
                onClick={() => handleSelect(notebook.id)}
                className="flex items-center gap-3 flex-1"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: notebookColors.find((c) => c.id === notebook.color)?.color || '#6b4423' }}
                >
                  <Book className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 text-left">
                  {editingId === notebook.id ? (
                    <input
                      type="text"
                      defaultValue={notebook.name}
                      autoFocus
                      className="w-full px-2 py-1 rounded border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      onBlur={(e) => handleUpdate(notebook.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdate(notebook.id, e.currentTarget.value);
                        } else if (e.key === 'Escape') {
                          setEditingId(null);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <p className="font-medium text-gray-800">{notebook.name}</p>
                  )}
                </div>
              </button>
              <div className="flex items-center gap-1">
                {currentNotebookId === notebook.id && <Check className="w-5 h-5 text-amber-600" />}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(notebook.id);
                  }}
                  className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(notebook.id);
                  }}
                  className="p-1.5 rounded hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}

          {/* Create New Notebook */}
          {isCreating ? (
            <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-amber-300">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Notebook name..."
                autoFocus
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-3"
              />
              <div className="flex flex-wrap gap-2 mb-3">
                {notebookColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={cn(
                      'w-8 h-8 rounded-lg transition-transform',
                      selectedColor === color.id && 'ring-2 ring-offset-2 ring-amber-500 scale-110'
                    )}
                    style={{ backgroundColor: color.color }}
                    title={color.name}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                  className="flex-1 px-3 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-amber-400 hover:text-amber-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create New Notebook
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
