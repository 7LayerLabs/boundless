'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Plus, X, Link, Trash2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ImageData {
  id: string;
  url: string;
  caption?: string;
  size?: number;
}

interface ImageAttachmentProps {
  images: ImageData[];
  onAddImage: (url: string, caption?: string) => void;
  onRemoveImage: (id: string) => void;
  onResizeImage?: (id: string, size: number) => void;
  isLocked?: boolean;
  darkMode?: boolean;
}

export function ImageAttachment({ images, onAddImage, onRemoveImage, onResizeImage, isLocked, darkMode }: ImageAttachmentProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [resizingImage, setResizingImage] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);
  const [resizeStartSize, setResizeStartSize] = useState(0);
  const [caption, setCaption] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert file to base64 data URL
  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle file selection
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    try {
      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/')) {
          const dataUrl = await fileToDataUrl(file);
          onAddImage(dataUrl);
        }
      }
    } catch (error) {
      console.error('Error processing image:', error);
    }
    setIsProcessing(false);
    setShowAddForm(false);
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, []);

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      onAddImage(imageUrl.trim(), caption.trim() || undefined);
      setImageUrl('');
      setCaption('');
      setShowAddForm(false);
      setPreviewError(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setPreviewError(false);
  };

  // Resize handlers
  const handleResizeStart = (e: React.MouseEvent, img: ImageData) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingImage(img.id);
    setResizeStartX(e.clientX);
    setResizeStartSize(img.size || 80);
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizingImage) return;

    const delta = e.clientX - resizeStartX;
    const newSize = Math.max(40, Math.min(300, resizeStartSize + delta));

    // Update the DOM directly for smooth resizing
    const imgElement = document.querySelector(`[data-image-id="${resizingImage}"]`) as HTMLElement;
    if (imgElement) {
      imgElement.style.width = `${newSize}px`;
      imgElement.style.height = `${newSize}px`;
    }
  }, [resizingImage, resizeStartX, resizeStartSize]);

  const handleResizeEnd = useCallback((e: MouseEvent) => {
    if (!resizingImage || !onResizeImage) return;

    const delta = e.clientX - resizeStartX;
    const newSize = Math.max(40, Math.min(300, resizeStartSize + delta));

    onResizeImage(resizingImage, newSize);
    setResizingImage(null);
  }, [resizingImage, resizeStartX, resizeStartSize, onResizeImage]);

  // Add global mouse listeners when resizing
  useEffect(() => {
    if (resizingImage) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizingImage, handleResizeMove, handleResizeEnd]);

  return (
    <div className="mt-4">
      {/* Images Grid */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((img) => {
            const size = img.size || 80;
            return (
              <div
                key={img.id}
                className="relative group"
              >
                <div
                  data-image-id={img.id}
                  className={cn(
                    'relative cursor-pointer rounded-lg overflow-hidden',
                    darkMode ? 'border-neutral-600' : 'border-amber-200',
                    'border'
                  )}
                  style={{ width: size, height: size }}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img.url}
                    alt={img.caption || 'Journal image'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="%23ccc"%3E%3Crect width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="10"%3EError%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>

                {/* Delete button */}
                {!isLocked && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveImage(img.id);
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}

                {/* Resize handle */}
                {!isLocked && onResizeImage && (
                  <div
                    onMouseDown={(e) => handleResizeStart(e, img)}
                    className={cn(
                      'absolute bottom-0 right-0 w-4 h-4 cursor-se-resize',
                      'opacity-0 group-hover:opacity-100 transition-opacity',
                      'flex items-center justify-center',
                      resizingImage === img.id && 'opacity-100'
                    )}
                    title="Drag to resize"
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      className={darkMode ? 'text-neutral-400' : 'text-amber-600'}
                    >
                      <path
                        d="M9 1L1 9M9 5L5 9M9 9L9 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Image Button */}
      {!isLocked && !showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
        >
          <Image className="w-4 h-4" />
          Add Image
        </button>
      )}

      {/* Add Image Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={cn(
              'p-3 rounded-lg border space-y-3',
              darkMode ? 'bg-neutral-800 border-neutral-600' : 'bg-amber-50 border-amber-200'
            )}>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />

              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                  isDragging
                    ? 'border-amber-500 bg-amber-100'
                    : darkMode
                    ? 'border-neutral-600 hover:border-neutral-500'
                    : 'border-amber-300 hover:border-amber-400',
                  isProcessing && 'opacity-50 pointer-events-none'
                )}
              >
                <Upload className={cn(
                  'w-8 h-8 mx-auto mb-2',
                  darkMode ? 'text-neutral-400' : 'text-amber-400'
                )} />
                <p className={cn(
                  'text-sm font-medium',
                  darkMode ? 'text-neutral-300' : 'text-amber-700'
                )}>
                  {isProcessing ? 'Processing...' : 'Drop images here or click to upload'}
                </p>
                <p className={cn(
                  'text-xs mt-1',
                  darkMode ? 'text-neutral-500' : 'text-amber-500'
                )}>
                  Supports JPG, PNG, GIF
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex-1 h-px',
                  darkMode ? 'bg-neutral-600' : 'bg-amber-200'
                )} />
                <span className={cn(
                  'text-xs',
                  darkMode ? 'text-neutral-500' : 'text-amber-400'
                )}>or paste URL</span>
                <div className={cn(
                  'flex-1 h-px',
                  darkMode ? 'bg-neutral-600' : 'bg-amber-200'
                )} />
              </div>

              {/* URL Input */}
              <div className="flex items-center gap-2">
                <Link className={cn(
                  'w-4 h-4',
                  darkMode ? 'text-neutral-400' : 'text-amber-500'
                )} />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="Paste image URL..."
                  className={cn(
                    'flex-1 px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-amber-500',
                    darkMode
                      ? 'bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-500'
                      : 'bg-white border-amber-200 text-neutral-800'
                  )}
                />
              </div>

              {imageUrl && !previewError && (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className={cn(
                      'max-h-40 rounded-lg border',
                      darkMode ? 'border-neutral-600' : 'border-amber-200'
                    )}
                    onError={() => setPreviewError(true)}
                  />
                </div>
              )}

              {previewError && (
                <p className="text-xs text-red-500">Could not load image. Please check the URL.</p>
              )}

              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Caption (optional)"
                className={cn(
                  'w-full px-2 py-1.5 text-sm rounded border focus:outline-none focus:ring-2 focus:ring-amber-500',
                  darkMode
                    ? 'bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-500'
                    : 'bg-white border-amber-200 text-neutral-800'
                )}
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setImageUrl('');
                    setCaption('');
                  }}
                  className={cn(
                    'px-3 py-1.5 text-sm',
                    darkMode ? 'text-neutral-400 hover:text-neutral-200' : 'text-amber-600 hover:text-amber-800'
                  )}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddImage}
                  disabled={!imageUrl.trim() || previewError}
                  className="px-3 py-1.5 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Image
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.caption || 'Journal image'}
                className="max-w-full max-h-[85vh] rounded-lg object-contain"
              />
              {selectedImage.caption && (
                <p className="mt-2 text-center text-white text-sm">{selectedImage.caption}</p>
              )}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-3 -right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
