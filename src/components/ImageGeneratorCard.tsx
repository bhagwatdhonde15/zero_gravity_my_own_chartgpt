import React, { useState } from 'react';
import { Download, Sparkles, Maximize2, X, Check, Copy, RefreshCw } from 'lucide-react';
import { GeneratedImageData } from '../types/chat';

interface ImageGeneratorCardProps {
  data: GeneratedImageData;
}

export const ImageGeneratorCard: React.FC<ImageGeneratorCardProps> = ({ data }) => {
  const [zoomOpen, setZoomOpen] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(data.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nanobana_${data.prompt.slice(0, 20).replace(/[^a-z0-9]/gi, '_')}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      window.open(data.imageUrl, '_blank');
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(data.prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="my-4 p-4 bg-[#0f172a] border border-[#1e3a8a]/60 rounded-3xl shadow-2xl space-y-3 font-sans select-none max-w-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-xl bg-blue-500/20 text-cyan-300 border border-blue-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
              <span>NanoBana AI Image Engine</span>
              <span className="text-[10px] text-cyan-300 bg-blue-500/20 border border-blue-500/40 px-1.5 py-0.2 rounded font-mono uppercase">
                FLUX Pro
              </span>
            </h4>
            <p className="text-[10px] text-[#94a3b8]">Ultra High Resolution Synthesis</p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleCopyPrompt}
            className="p-1.5 text-[#94a3b8] hover:text-white rounded-lg hover:bg-[#1e293b] transition-colors"
            title="Copy prompt"
          >
            {copiedPrompt ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 text-[#94a3b8] hover:text-white rounded-lg hover:bg-[#1e293b] transition-colors"
            title="Download Image"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Image Preview Container */}
      <div className="relative rounded-2xl overflow-hidden bg-[#090d16] border border-[#1e293b] group min-h-[240px] flex items-center justify-center">
        {!imageLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 text-xs text-[#94a3b8]">
            <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
            <span>NanoBana FLUX generating high-res image...</span>
          </div>
        )}

        <img
          src={data.imageUrl}
          alt={data.prompt}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-auto object-cover transition-all duration-300 ${
            imageLoaded ? 'opacity-100 group-hover:scale-[1.02]' : 'opacity-0'
          }`}
        />

        {/* Hover Action Overlay */}
        {imageLoaded && (
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 backdrop-blur-xs">
            <button
              onClick={() => setZoomOpen(true)}
              className="p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors backdrop-blur-md"
              title="Zoom Image"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors shadow-lg"
              title="Download Image"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Prompt Footer */}
      <div className="px-1 text-xs text-[#94a3b8] space-y-1">
        <p className="line-clamp-2 italic text-[#f8fafc]">"{data.prompt}"</p>
        <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300">
          <span>Style: {data.style || 'Photorealistic'}</span>
          <span>Ratio: {data.aspectRatio || '1:1'}</span>
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 p-3 text-white rounded-full bg-[#1e293b] hover:bg-[#334155] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={data.imageUrl}
            alt={data.prompt}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
