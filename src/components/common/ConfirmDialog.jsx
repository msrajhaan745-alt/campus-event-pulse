import React, { useEffect } from 'react';
import { X, AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from './Button';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmVariant = 'primary',
  loading = false,
}) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isDanger = confirmVariant === 'danger';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.2)] border border-[#e4e7ef] animate-scale-in overflow-hidden">
        {/* Top accent bar */}
        <div className={`h-1 w-full ${isDanger ? 'bg-gradient-to-r from-red-500 to-rose-500' : 'bg-gradient-to-r from-[#4f46e5] to-[#6366f1]'}`} />

        {/* Content */}
        <div className="p-6">
          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div className={`p-2.5 rounded-xl shrink-0 ${isDanger ? 'bg-red-50 text-red-600' : 'bg-[#eef2ff] text-[#4f46e5]'}`}>
              {isDanger ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                id="dialog-title"
                className="text-base font-bold text-[#0f1117] mb-1"
              >
                {title}
              </h3>
              <p className="text-sm text-[#6b7280] leading-relaxed">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[#9ca3af] hover:bg-[#f1f3f8] hover:text-[#0f1117] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant={isDanger ? 'danger' : 'primary'}
              size="md"
              onClick={onConfirm}
              loading={loading}
              disabled={loading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
