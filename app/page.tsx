'use client';

import React, { useState } from 'react';
import { Sparkles, Video, Loader2, Download, AlertCircle } from 'lucide-react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState('5');
  const [resolution, setResolution] = useState('720p');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, duration, resolution, aspectRatio }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setVideoUrl(data.videoUrl);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="border-b border-slate-800 p-6 flex items-center justify-between bg-slate-900/50 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Higgsfield AI Studio
              </h1>
              <p className="text-xs text-slate-400">Personal Video Generation Suite</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/20 font-medium">
            Private Access
          </span>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Form */}
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Prompt / কন্টেন্ট বিবরণ
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A cinematic scene at sunset, high detailed, 4k..."
                rows={4}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="wp-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="5">5 Sec</option>
                  <option value="10">10 Sec</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Resolution</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="16:9">16:9 (Landscape)</option>
                  <option value="9:16">9:16 (Reels/Shorts)</option>
                  <option value="1:1">1:1 (Square)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Video...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Video
                </>
              )}
            </button>
          </form>

          {/* Output Preview */}
          <div className="flex flex-col justify-center items-center bg-slate-950 border border-slate-800/80 rounded-xl p-4 min-h-[280px] relative overflow-hidden">
            {loading && (
              <div className="text-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto" />
                <p className="text-xs text-slate-400">Rendering scene with AI, please wait...</p>
              </div>
            )}

            {error && (
              <div className="text-center p-4 text-rose-400 space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto opacity-80" />
                <p className="text-xs">{error}</p>
              </div>
            )}

            {!loading && !error && !videoUrl && (
              <div className="text-center text-slate-600 space-y-2">
                <Video className="w-10 h-10 mx-auto opacity-30" />
                <p className="text-xs">Your generated video will appear here</p>
              </div>
            )}

            {videoUrl && (
              <div className="w-full h-full flex flex-col items-center justify-between space-y-4">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full max-h-[220px] rounded-lg object-contain bg-black"
                />
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center justify-center gap-2 border border-slate-700 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Video
                </a>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
