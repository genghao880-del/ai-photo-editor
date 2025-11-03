
import React, { useCallback, useRef } from 'react';
import { ImageFile } from '../types.ts';
import { UploadIcon, TrashIcon } from './Icons.tsx';

interface ImageUploaderProps {
  imageFile: ImageFile | null;
  onImageUpload: (file: ImageFile) => void;
  onReset: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ imageFile, onImageUpload, onReset }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onImageUpload({ name: file.name, base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onImageUpload({ name: file.name, base64, mimeType: file.type });
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  if (imageFile) {
    return (
      <div className="relative w-full aspect-square rounded-lg overflow-hidden group bg-gray-900">
        <img src={imageFile.base64} alt="Uploaded preview" className="w-full h-full object-contain" />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={onReset}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            aria-label="移除图片并重置"
          >
            <TrashIcon />
            移除图片
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={triggerFileInput}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="flex-grow flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-gray-800 transition-colors duration-300"
      role="button"
      aria-label="上传图片区域"
    >
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <UploadIcon />
      <p className="mt-4 text-lg font-semibold">点击或拖拽上传图片</p>
      <p className="text-sm text-gray-400">支持 PNG, JPG, WEBP 等格式</p>
    </div>
  );
};
