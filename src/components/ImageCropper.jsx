import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { motion } from 'framer-motion';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';
import { getCroppedImg } from '../utils/cropImage';

const ImageCropper = ({ imageSrc, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    try {
      setIsProcessing(true);
      const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImageFile);
    } catch (e) {
      console.error('Error cropping image:', e);
      // If error, we just return the original but we can't do that easily as a file from dataUrl.
      // So we'll just close it or show error.
      onCancel();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0a0f0d] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 flex flex-col"
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#070b0a]">
          <h3 className="text-lg font-bold text-white">Recortar Foto</h3>
          <button
            onClick={onCancel}
            className="text-white/50 hover:text-white transition-colors p-1"
            disabled={isProcessing}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full h-[60vh] min-h-[300px] max-h-[500px] bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteHandler}
            onZoomChange={onZoomChange}
            objectFit="contain"
          />
        </div>

        <div className="p-6 bg-[#070b0a]">
          <div className="flex items-center gap-4 mb-6">
            <ZoomOut className="w-5 h-5 text-white/50" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => {
                setZoom(e.target.value);
              }}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <ZoomIn className="w-5 h-5 text-white/50" />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg font-bold text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="px-6 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Procesando...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Aplicar Recorte
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageCropper;
