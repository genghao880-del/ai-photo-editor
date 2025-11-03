
import React from 'react';
import { DownloadIcon, ImageIcon, InfoIcon } from './Icons.tsx';

interface ResultPanelProps {
  editedImage: string | null;
  responseText: string | null;
  isLoading: boolean;
  error: string | null;
  hasOriginalImage: boolean;
}

const LoadingIndicator: React.FC = () => {
  const messages = [
    "AI 正在施展魔法...",
    "正在混合像素...",
    "即将完成，请稍候...",
    "生成创意中...",
  ];
  const [message, setMessage] = React.useState(messages[0]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
      <p className="mt-4 text-lg font-semibold text-gray-300">{message}</p>
    </div>
  );
};

export const ResultPanel: React.FC<ResultPanelProps> = ({ editedImage, responseText, isLoading, error, hasOriginalImage }) => {
  const handleDownload = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = `edited-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-red-400">
          <p className="font-bold">出错了</p>
          <p className="mt-2 text-sm max-w-md">{error}</p>
        </div>
      );
    }
    if (editedImage) {
      return (
        <div className="w-full flex flex-col">
          <div className="w-full aspect-square relative rounded-lg overflow-hidden bg-gray-900">
            <img src={editedImage} alt="Edited result" className="w-full h-full object-contain" />
          </div>
          
          {responseText && (
            <div className="mt-4 p-3 bg-gray-900/70 rounded-lg border border-gray-700">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">
                <InfoIcon />
                AI 执行说明
              </h3>
              <p className="text-sm text-gray-400 whitespace-pre-wrap">{responseText}</p>
            </div>
          )}

          <button
            onClick={handleDownload}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            <DownloadIcon />
            下载图片
          </button>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
        <ImageIcon />
        <p className="mt-4 text-lg font-semibold">
          {hasOriginalImage ? '编辑后的图片将显示在这里' : '请先上传一张图片'}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold text-gray-300 mb-4 text-center">输出结果</h2>
      <div className="flex-grow w-full bg-gray-900/50 rounded-lg p-4 flex items-center justify-center overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};
