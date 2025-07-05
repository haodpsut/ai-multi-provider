
import React, { useRef } from 'react';
import { UploadIcon, XIcon, SparklesIcon } from './icons/ActionIcons';

interface InputAreaProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  image: { file: File; base64: string } | null;
  setImage: (image: { file: File; base64: string } | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ prompt, setPrompt, image, setImage, onSubmit, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({ file, base64: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-base-200 rounded-xl shadow-lg p-4">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here... e.g., 'A cat wearing a superhero cape'"
          className="w-full p-4 pr-12 bg-base-300 rounded-lg text-base-content placeholder-base-content-secondary focus:ring-2 focus:ring-brand-primary focus:outline-none resize-none"
          rows={3}
          disabled={isLoading}
        />
        {image && (
          <div className="absolute bottom-2 left-2 bg-base-100 p-1 rounded-md flex items-center space-x-2">
            <img src={image.base64} alt="preview" className="h-10 w-10 object-cover rounded" />
            <span className="text-xs text-base-content-secondary max-w-[100px] truncate">{image.file.name}</span>
            <button onClick={() => setImage(null)} className="p-1 rounded-full hover:bg-base-300">
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-brand-light bg-brand-primary/20 rounded-md hover:bg-brand-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UploadIcon className="w-5 h-5" />
            <span>{image ? 'Change Image' : 'Upload Image'}</span>
          </button>
        </div>
        <button
          onClick={onSubmit}
          disabled={isLoading || !prompt}
          className="flex items-center space-x-2 px-6 py-2 text-sm font-bold text-white bg-brand-primary rounded-md hover:bg-brand-secondary disabled:bg-base-300 disabled:text-base-content-secondary disabled:cursor-not-allowed transition-colors"
        >
          <SparklesIcon className="w-5 h-5"/>
          <span>{isLoading ? 'Generating...' : 'Compare'}</span>
        </button>
      </div>
    </div>
  );
};
