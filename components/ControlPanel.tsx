
import React from 'react';
import { MagicWandIcon } from './Icons.tsx';

interface ControlPanelProps {
  prompt: string;
  onPromptChange: (prompt: string) => void;
  onEdit: () => void;
  isLoading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ prompt, onPromptChange, onEdit, isLoading }) => {
  return (
    <div className="flex flex-col space-y-4">
      <label htmlFor="prompt-input" className="font-semibold text-gray-300">
        2. 输入你的修图指令
      </label>
      <textarea
        id="prompt-input"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder="例如：给这只猫戴上墨镜，或者把背景换成海滩..."
        className="w-full h-24 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-gray-100 placeholder-gray-400 resize-none"
        disabled={isLoading}
      />
      <button
        onClick={onEdit}
        disabled={!prompt || isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            处理中...
          </>
        ) : (
          <>
            <MagicWandIcon />
            开始修图
          </>
        )}
      </button>
    </div>
  );
};
