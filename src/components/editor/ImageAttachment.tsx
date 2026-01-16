'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Plus, X, Link, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ImageData {
  id: string;
  url: string;
  caption?: string;
}

interface ImageAttachmentProps {
  images: ImageData[];
  onAddImage: (url: string, caption?: string) => void;
  onRemoveImage: (id: string) => void;
  isLocked?: boolean;
}

export function ImageAttachment({ images, onAddImage, onRemoveImage, isLocked }: ImageAttachmentProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [previewError, setPreviewError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

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

  return (
    <div className="mt-4">
      {/* Images Grid */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {images.map((img) => (
            <div
              key={img.id}
              className="relative group cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.url}
                alt={img.caption || 'Journal image'}
                className="w-20 h-20 object-cover rounded-lg border border-amber-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="%23ccc"%3E%3Crect width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="10"%3EError%3C/text%3E%3C/svg%3E';
                }}
              />
              {!isLocked && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveImage(img.id);
                  }}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
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
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 space-y-3">
              <div className="flex items-center gap-2">
                <Link className="w-4 h-4 text-amber-500" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  placeholder="Paste image URL..."
                  className="flex-1 px-2 py-1.5 text-sm rounded border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {imageUrl && !previewError && (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="max-h-40 rounded-lg border border-amber-200"
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
                className="w-full px-2 py-1.5 text-sm rounded border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setImageUrl('');
                    setCaption('');
                  }}
                  className="px-3 py-1.5 text-sm text-amber-600 hover:text-amber-800"
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
