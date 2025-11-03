
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { ImageUploader } from './components/ImageUploader.tsx';
import { ControlPanel } from './components/ControlPanel.tsx';
import { ResultPanel } from './components/ResultPanel.tsx';
import { useGemini } from './hooks/useGemini.ts';
import { ImageFile } from './types.ts';

export default function App() {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const { editImage, editedImage, responseText, isLoading, error, clearResult } = useGemini();

  const handleImageUpload = useCallback((file: ImageFile) => {
    setImageFile(file);
    clearResult();
  }, [clearResult]);

  const handleEdit = useCallback(async () => {
    if (!imageFile || !prompt) {
      return;
    }
    await editImage(imageFile.base64, imageFile.mimeType, prompt);
  }, [imageFile, prompt, editImage]);

  const handleReset = useCallback(() => {
    setImageFile(null);
    setPrompt('');
    clearResult();
  }, [clearResult]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left Panel */}
          <div className="flex flex-col space-y-6 bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
            <ImageUploader imageFile={imageFile} onImageUpload={handleImageUpload} onReset={handleReset} />
            {imageFile && (
              <ControlPanel
                prompt={prompt}
                onPromptChange={setPrompt}
                onEdit={handleEdit}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* Right Panel */}
          <div className="flex flex-col bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
            <ResultPanel
              editedImage={editedImage}
              responseText={responseText}
              isLoading={isLoading}
              error={error}
              hasOriginalImage={!!imageFile}
            />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>由 Google Gemini API 强力驱动</p>
      </footer>
    </div>
  );
}
