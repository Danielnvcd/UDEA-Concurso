import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { validateFile } from '../utils/validation';

const TeamPhotoUploader = ({ onPhotoSelect, error, currentPhotoUrl }) => {
  const [preview, setPreview] = useState(currentPhotoUrl || null);
  const [localError, setLocalError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setLocalError(validationError);
      setPreview(null);
      onPhotoSelect(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setLocalError('');
    onPhotoSelect(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setLocalError('');
    onPhotoSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Foto del Equipo (Opcional)
      </label>
      
      {!preview ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            error || localError ? 'border-red-500/50 bg-red-500/10 hover:bg-red-500/20' : 'border-white/20 bg-white/5 hover:bg-white/10'
          }`}
        >
          <Upload className={`h-8 w-8 mb-2 ${error || localError ? 'text-red-400' : 'text-white/40'}`} />
          <p className="text-sm font-medium text-white">Click para subir foto</p>
          <p className="text-xs text-slate-400 mt-1">JPG, PNG o WebP. Máx 2MB.</p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-white/10">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-md hover:bg-red-700 transition-colors backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3">
             <div className="flex items-center text-white text-sm">
                <ImageIcon className="h-4 w-4 mr-2" />
                Foto seleccionada
             </div>
          </div>
        </div>
      )}
      
      {(error || localError) && (
        <p className="mt-2 text-sm text-red-400 font-medium">
          {error || localError}
        </p>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg, image/png, image/webp"
        className="hidden"
      />
    </div>
  );
};

export default TeamPhotoUploader;
