'use client';

import { motion } from 'framer-motion';
import { X, FileText, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { entryTemplates, type EntryTemplate } from '@/constants/templates';

interface EntryTemplatesModalProps {
  onClose: () => void;
  onSelectTemplate: (template: EntryTemplate) => void;
}

export function EntryTemplatesModal({ onClose, onSelectTemplate }: EntryTemplatesModalProps) {
  const handleSelect = (template: EntryTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-lg">
              <FileText className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Entry Templates</h2>
              <p className="text-sm text-neutral-500">Quick-start formats for your journal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {entryTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelect(template)}
                className={cn(
                  'text-left p-4 rounded-xl border-2 transition-all hover:shadow-md',
                  'hover:border-neutral-400',
                  template.color
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{template.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900">{template.name}</h3>
                    <p className="text-sm text-neutral-600 mt-1">{template.description}</p>
                  </div>
                  <div className="p-1.5 rounded-full bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Check className="w-4 h-4 text-neutral-700" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Info text */}
          <p className="mt-6 text-sm text-neutral-500 text-center">
            Select a template to add it to your current entry
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
