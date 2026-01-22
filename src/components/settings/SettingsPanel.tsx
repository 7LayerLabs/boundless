'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Sliders, Palette, Shield, Eye, EyeOff, Key } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useSettings } from '@/hooks/useSettings';
import { FeaturesSection, DisplaySection, SecuritySection, AppearanceSection } from './sections';

type SettingsTab = 'features' | 'display' | 'appearance' | 'security';

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'features', label: 'Features', icon: <Sliders className="w-4 h-4" /> },
  { id: 'display', label: 'Display', icon: <Eye className="w-4 h-4" /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
  { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
];

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('features');
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  const {
    bindingColor,
    claspStyle,
    pageColor,
    pageLines,
    fontFamily,
    fontSize,
    inkColor,
    showMoodSelector,
    aiReflectionEnabled,
    aiApiKey,
    aiTone,
    dateFormat,
    dateColor,
    simpleMode,
    pinHash,
    showWritingStats,
    showEntryTemplates,
    showGuidedPrograms,
    showDailyQuote,
    updateSetting,
  } = useSettings();

  // Initialize temp API key when settings load
  useEffect(() => {
    setTempApiKey(aiApiKey);
  }, [aiApiKey]);

  const handleSaveApiKey = () => {
    updateSetting('aiApiKey', tempApiKey);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="h-full w-[480px] bg-white shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="bg-neutral-900 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-medium text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-neutral-100 border-b border-neutral-200 px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-px',
                  activeTab === tab.id
                    ? 'text-neutral-900 border-neutral-900 bg-white'
                    : 'text-neutral-500 border-transparent hover:text-neutral-700 hover:bg-neutral-50'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'features' && (
            <FeaturesSection
              showMoodSelector={showMoodSelector}
              aiReflectionEnabled={aiReflectionEnabled}
              aiTone={aiTone}
              showWritingStats={showWritingStats}
              showEntryTemplates={showEntryTemplates}
              showGuidedPrograms={showGuidedPrograms}
              showDailyQuote={showDailyQuote}
              updateSetting={updateSetting}
            />
          )}

          {activeTab === 'display' && (
            <DisplaySection
              dateFormat={dateFormat}
              dateColor={dateColor}
              simpleMode={simpleMode}
              updateSetting={updateSetting}
            />
          )}

          {activeTab === 'appearance' && (
            <AppearanceSection
              bindingColor={bindingColor}
              claspStyle={claspStyle}
              pageColor={pageColor}
              pageLines={pageLines}
              fontFamily={fontFamily}
              fontSize={fontSize}
              inkColor={inkColor}
              updateSetting={updateSetting}
            />
          )}

          {activeTab === 'security' && (
            <SecuritySection
              pinHash={pinHash}
              updateSetting={updateSetting}
            />
          )}
        </div>

        {/* API Key Footer - Always visible at bottom */}
        <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-4 h-4 text-neutral-500" />
            <p className="text-sm font-medium text-neutral-700">Gemini API Key</p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-500 hover:text-neutral-700 underline ml-auto"
            >
              Get a key (free)
            </a>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full px-3 py-2 pr-10 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-400 bg-white"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={handleSaveApiKey}
              disabled={tempApiKey === aiApiKey}
              className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save
            </button>
          </div>
          {aiApiKey && (
            <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              API key configured
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
