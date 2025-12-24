
import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Printer, Plus, RefreshCw, Type as TypeIcon, Palette, Layers, Info } from 'lucide-react';
import { WorksheetConfig, GeminiCharData, GridType } from './types';
import { fetchCharacterDetails } from './services/geminiService';
import CharacterRow from './components/CharacterRow';

const App: React.FC = () => {
  const [inputChars, setInputChars] = useState<string>("学而时习之不亦说乎");
  const [charData, setCharData] = useState<GeminiCharData[]>([]);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<WorksheetConfig>({
    characters: [],
    gridType: 'mi',
    showPinyin: true,
    showMeaning: true,
    showTracing: true,
    showStrokeOrder: true,
    gridCount: 4,
    gridColor: '#F87171', 
    fontSize: 56,
    title: '汉字笔顺同步练习 (STROKE ORDER)',
    fontFamily: '"Kaiti", "STKaiti", "楷体", serif',
    useFontForReference: false
  });

  const generateSheet = useCallback(async () => {
    if (!inputChars.trim()) return;
    setLoading(true);
    const filtered = inputChars.replace(/[^\u4e00-\u9fa5]/g, '');
    const uniqueChars = Array.from(new Set<string>(filtered.split('')));
    
    try {
      const data = await fetchCharacterDetails(uniqueChars);
      setCharData(data);
      setConfig(prev => ({ ...prev, characters: uniqueChars }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [inputChars]);

  useEffect(() => {
    generateSheet();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <style>{`
        .hanzi-font { font-family: ${config.fontFamily} !important; }
      `}</style>

      <div className="no-print w-full md:w-80 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 overflow-y-auto z-50">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-600 rounded-lg shadow-sm">
            <TypeIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic">Hanzi Master</h1>
        </div>

        <section className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Input Text</label>
            <textarea
              className="w-full h-28 p-4 text-xl border-2 border-slate-100 rounded-xl focus:border-red-500 outline-none transition-all resize-none hanzi-font"
              placeholder="输入汉字..."
              value={inputChars}
              onChange={(e) => setInputChars(e.target.value)}
            />
            <button
              onClick={generateSheet}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-200 text-white rounded-xl font-bold transition-all shadow-md active:scale-95"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Generate Sheet
            </button>
          </div>

          <div className="pt-4 border-t-2 border-slate-50 space-y-4">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Settings className="w-3.5 h-3.5" /> Configuration
            </h2>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Font Style</label>
                <select 
                  className="w-full p-2.5 text-sm border-2 border-slate-100 rounded-lg bg-white appearance-none cursor-pointer focus:border-red-500"
                  value={config.fontFamily}
                  onChange={(e) => setConfig({ ...config, fontFamily: e.target.value })}
                >
                  <option value='"Kaiti", "STKaiti", "楷体", serif'>楷体 (Default Kaiti)</option>
                  <option value='"Ma Shan Zheng", cursive'>马山正 (Brush Style)</option>
                  <option value='"Noto Serif SC", serif'>宋体 (Noto Serif Song)</option>
                  <option value='"ZCOOL XiaoWei", serif'>小薇 (XiaoWei Stylized)</option>
                  <option value='sans-serif'>黑体 (Modern Sans-serif)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Grid Type</label>
                  <select 
                    className="w-full p-2.5 text-sm border-2 border-slate-100 rounded-lg bg-white appearance-none cursor-pointer"
                    value={config.gridType}
                    onChange={(e) => setConfig({ ...config, gridType: e.target.value as GridType })}
                  >
                    <option value="tian">Tian Zi Ge</option>
                    <option value="mi">Mi Zi Ge</option>
                    <option value="none">Blank</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Size</label>
                  <input
                    type="number"
                    className="w-full p-2.5 text-sm border-2 border-slate-100 rounded-lg focus:border-red-500"
                    value={config.fontSize}
                    onChange={(e) => setConfig({ ...config, fontSize: parseInt(e.target.value) || 32 })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-md border-2 border-slate-300 text-red-600 focus:ring-0"
                  checked={config.useFontForReference}
                  onChange={(e) => setConfig({ ...config, useFontForReference: e.target.checked })}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-600 group-hover:text-red-600 transition-colors flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Use Custom Font for Reference
                  </span>
                  <span className="text-[9px] text-slate-400 leading-tight">Apply chosen font to the first black grid</span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-md border-2 border-slate-300 text-red-600 focus:ring-0"
                  checked={config.showStrokeOrder}
                  onChange={(e) => setConfig({ ...config, showStrokeOrder: e.target.checked })}
                />
                <span className="text-sm font-bold text-slate-600 group-hover:text-red-600 transition-colors">Show Decomposition</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-md border-2 border-slate-300 text-red-600 focus:ring-0"
                  checked={config.showTracing}
                  onChange={(e) => setConfig({ ...config, showTracing: e.target.checked })}
                />
                <span className="text-sm font-bold text-slate-600 group-hover:text-red-600 transition-colors">Include Tracing Guide</span>
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                <span>Extra Grids</span>
                <span className="text-red-600">{config.gridCount}</span>
              </div>
              <input
                type="range"
                className="w-full accent-red-600 h-2 bg-slate-100 rounded-full appearance-none cursor-pointer"
                min="0"
                max="10"
                value={config.gridCount}
                onChange={(e) => setConfig({ ...config, gridCount: parseInt(e.target.value) })}
              />
            </div>
            
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                 <Palette className="w-3 h-3" /> Grid Accent Color
               </label>
               <input 
                type="color" 
                value={config.gridColor}
                onChange={(e) => setConfig({ ...config, gridColor: e.target.value })}
                className="w-full h-10 p-1 border-2 border-slate-100 rounded-xl cursor-pointer bg-white"
              />
            </div>
          </div>
        </section>

        <div className="mt-auto pt-6 border-t-2 border-slate-50 flex flex-col gap-2">
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black shadow-xl transition-all active:scale-95 group"
          >
            <Printer className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            PRINT WORKBOOK
          </button>
          <div className="flex items-start gap-2 px-2 text-[9px] text-slate-400 leading-tight">
            <Info className="w-3 h-3 mt-0.5 shrink-0" />
            <span>Tip: Select <b>"Save as PDF"</b> and enable <b>"Background graphics"</b> in print settings to export.</span>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto bg-slate-200 p-4 md:p-12 flex justify-center">
        <div className="practice-sheet w-full max-w-[210mm] bg-white shadow-2xl p-12 md:p-20 min-h-[297mm] h-fit relative">
          
          <header className="border-b-[6px] border-slate-900 pb-6 mb-12 flex justify-between items-end">
            <div className="flex-1">
              <input 
                className="text-4xl font-black text-slate-900 mb-2 w-full border-none focus:ring-0 p-0 placeholder-slate-200 hanzi-font"
                value={config.title}
                onChange={(e) => setConfig({...config, title: e.target.value.toUpperCase()})}
                placeholder="WORKSHEET TITLE"
              />
              <div className="flex gap-8">
                <p className="text-xs text-slate-400 font-bold tracking-widest border-b border-dotted border-slate-300 pb-1 flex-1 hanzi-font">NAME: ____________________</p>
                <p className="text-xs text-slate-400 font-bold tracking-widest border-b border-dotted border-slate-300 pb-1 w-32 hanzi-font">DATE: ____________</p>
              </div>
            </div>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-52 space-y-6">
              <div className="w-20 h-20 border-8 border-slate-100 border-t-red-600 rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-slate-900 font-black text-lg tracking-tight uppercase">Processing Characters</p>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Fetching Stroke Path Data...</p>
              </div>
            </div>
          ) : charData.length > 0 ? (
            <div className="space-y-2">
              {charData.map((data, idx) => (
                <CharacterRow key={idx} data={data} config={config} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-64 text-slate-100 border-[10px] border-dotted border-slate-50 rounded-[4rem]">
              <Plus className="w-32 h-32 opacity-20" />
              <p className="text-2xl font-black tracking-tighter uppercase opacity-30 mt-4">Empty Worksheet</p>
            </div>
          )}

          <footer className="mt-24 border-t-2 border-slate-100 pt-10 flex justify-between items-center opacity-40 grayscale">
            <span className="text-[10px] font-black tracking-[0.4em] text-slate-400 uppercase">Hanzi Master System v2.1</span>
            <div className="flex gap-4">
               <div className="w-3 h-3 bg-red-600 rounded-full" />
               <div className="w-3 h-3 bg-slate-900 rounded-full" />
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default App;
