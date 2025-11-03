
import { useState, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';

export const useGemini = () => {
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const editImage = useCallback(async (base64ImageData: string, mimeType: string, prompt: string) => {
    setIsLoading(true);
    setError(null);
    setEditedImage(null);
    setResponseText(null);

    if (!process.env.API_KEY) {
      setError('API 密钥未配置。');
      setIsLoading(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });
      
      const pureBase64 = base64ImageData.split(',')[1];
      if (!pureBase64) {
        throw new Error("无效的图像数据。");
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: pureBase64,
                mimeType: mimeType,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
          systemInstruction: '你是一个专业的修图师。请严格、精确地按照用户的文字指令来修改图片。只执行指令中明确要求的操作，不要添加任何额外的、未被要求的创意元素。在你的回复中，除了输出修改后的图片，还需用文字简要说明你执行了哪些具体操作来满足用户的指令。',
        },
      });

      let newImage: string | null = null;
      let newText: string | null = null;

      if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64ImageBytes = part.inlineData.data;
            newImage = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
          } else if (part.text) {
            newText = part.text;
          }
        }
      }

      if (newImage) {
        setEditedImage(newImage);
        setResponseText(newText);
      } else {
        const errorMessage = newText || 'AI 未能返回编辑后的图片。请尝试不同的提示或图片。';
        setError(errorMessage);
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : '发生未知错误。请检查控制台获取更多信息。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setEditedImage(null);
    setResponseText(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { editImage, editedImage, responseText, isLoading, error, clearResult };
};
