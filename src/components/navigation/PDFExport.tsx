'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FileDown, Calendar, Loader2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { useJournal } from '@/hooks/useJournal';
import { useSettings } from '@/hooks/useSettings';
import { fonts } from '@/constants/fonts';
import { moods } from '@/constants/moods';
import { dateColors } from '@/constants/themes';

interface PDFExportProps {
  onClose: () => void;
}

type DateRange = 'week' | 'month' | 'year' | 'all' | 'custom';

export function PDFExport({ onClose }: PDFExportProps) {
  const [dateRange, setDateRange] = useState<DateRange>('month');
  const [isExporting, setIsExporting] = useState(false);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const { allEntries } = useJournal();
  const { fontFamily, dateColor } = useSettings();
  const currentFont = fonts[fontFamily] || fonts.caveat;
  const currentDateColor = dateColors[dateColor] || dateColors.brown;

  const getDateRange = () => {
    const now = new Date();
    switch (dateRange) {
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { start: weekAgo, end: now };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        return { start: yearStart, end: now };
      case 'all':
        return { start: new Date(0), end: now };
      case 'custom':
        return {
          start: customStart ? new Date(customStart) : new Date(0),
          end: customEnd ? new Date(customEnd) : now,
        };
      default:
        return { start: startOfMonth(now), end: now };
    }
  };

  const getFilteredEntries = () => {
    const { start, end } = getDateRange();
    return allEntries
      .filter((entry) => {
        const entryDate = new Date(entry.date);
        return entryDate >= start && entryDate <= end;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const { jsPDF } = await import('jspdf');
      const entries = getFilteredEntries();

      if (entries.length === 0) {
        alert('No entries found in the selected date range.');
        setIsExporting(false);
        return;
      }

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: 'letter',
      });

      const pageWidth = 8.5;
      const pageHeight = 11;
      const margin = 1;
      const contentWidth = pageWidth - 2 * margin;
      let y = margin;

      // Title page
      doc.setFontSize(28);
      doc.setTextColor(currentDateColor.color);
      doc.text('My Journal', pageWidth / 2, 4, { align: 'center' });

      const { start, end } = getDateRange();
      doc.setFontSize(14);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `${format(start, 'MMMM d, yyyy')} - ${format(end, 'MMMM d, yyyy')}`,
        pageWidth / 2,
        4.5,
        { align: 'center' }
      );

      doc.setFontSize(12);
      doc.text(`${entries.length} entries`, pageWidth / 2, 5, { align: 'center' });

      // Add entries
      entries.forEach((entry, index) => {
        doc.addPage();
        y = margin;

        // Date header
        doc.setFontSize(10);
        doc.setTextColor(currentDateColor.dayColor);
        doc.text(`— ${format(new Date(entry.date), 'EEEE')} —`, pageWidth / 2, y, { align: 'center' });
        y += 0.25;

        doc.setFontSize(16);
        doc.setTextColor(currentDateColor.color);
        doc.text(format(new Date(entry.date), 'MMMM d, yyyy'), pageWidth / 2, y, { align: 'center' });
        y += 0.15;

        // Mood
        if (entry.mood) {
          const moodData = moods[entry.mood as keyof typeof moods];
          if (moodData) {
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(`Mood: ${moodData.name}`, pageWidth / 2, y + 0.25, { align: 'center' });
            y += 0.25;
          }
        }

        y += 0.4;

        // Separator line
        doc.setDrawColor(200, 200, 200);
        doc.line(margin + 1, y, pageWidth - margin - 1, y);
        y += 0.4;

        // Content
        const plainText = entry.content.replace(/<[^>]*>/g, '\n').replace(/\n+/g, '\n').trim();
        doc.setFontSize(12);
        doc.setTextColor(30, 30, 30);

        const lines = doc.splitTextToSize(plainText, contentWidth);

        lines.forEach((line: string) => {
          if (y > pageHeight - margin - 0.5) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, margin, y);
          y += 0.25;
        });

        // Tags
        if (entry.tags && entry.tags.length > 0) {
          y += 0.3;
          if (y > pageHeight - margin - 0.5) {
            doc.addPage();
            y = margin;
          }
          doc.setFontSize(9);
          doc.setTextColor(150, 150, 150);
          doc.text(`Tags: ${entry.tags.map((t) => `#${t}`).join(' ')}`, margin, y);
        }

        // Updates
        if (entry.updates && entry.updates.length > 0) {
          y += 0.5;
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text('Updates:', margin, y);
          y += 0.25;

          entry.updates.forEach((update) => {
            if (y > pageHeight - margin - 0.5) {
              doc.addPage();
              y = margin;
            }
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(format(new Date(update.createdAt), 'MMM d, yyyy h:mm a'), margin, y);
            y += 0.2;

            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            const updateLines = doc.splitTextToSize(update.content, contentWidth - 0.25);
            updateLines.forEach((line: string) => {
              if (y > pageHeight - margin - 0.5) {
                doc.addPage();
                y = margin;
              }
              doc.text(line, margin + 0.25, y);
              y += 0.2;
            });
            y += 0.15;
          });
        }
      });

      // Save
      const filename = `journal_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }

    setIsExporting(false);
  };

  const filteredCount = getFilteredEntries().length;

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
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-amber-600" />
            <h2 className="font-semibold text-gray-800">Export to PDF</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['week', 'month', 'year', 'all'] as DateRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm capitalize transition-colors',
                    dateRange === range
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  {range === 'all' ? 'All Time' : `This ${range}`}
                </button>
              ))}
              <button
                onClick={() => setDateRange('custom')}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm transition-colors col-span-2',
                  dateRange === 'custom'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                Custom Range
              </button>
            </div>
          </div>

          {dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
            <Calendar className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-amber-800">
              {filteredCount} {filteredCount === 1 ? 'entry' : 'entries'} will be exported
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleExport}
            disabled={isExporting || filteredCount === 0}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                Export PDF
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
