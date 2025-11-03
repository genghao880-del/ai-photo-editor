
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="p-4 text-center border-b border-gray-700">
      <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
        AI 一键修图
      </h1>
      <p className="text-gray-400 mt-1">上传图片，输入指令，见证魔法</p>
    </header>
  );
};
