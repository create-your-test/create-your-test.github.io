import React from 'react';
import { Sigma } from 'lucide-react';

interface FormulaRendererProps {
  formulaText: string;
  caption?: string;
}

export const FormulaRenderer: React.FC<FormulaRendererProps> = ({ formulaText, caption }) => {
  return (
    <div className="my-3 p-4 bg-slate-900 border border-slate-800 rounded-xl text-center shadow-inner">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 border-b border-slate-800/80 pb-1.5">
        <div className="flex items-center gap-1.5">
          <Sigma className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-300">معادلة رياضية / كيميائية</span>
        </div>
        {caption && <span className="text-[11px] text-slate-400">{caption}</span>}
      </div>

      <div className="py-3 px-4 font-mono text-base md:text-lg text-emerald-400 tracking-wide select-all overflow-x-auto">
        {formulaText}
      </div>
    </div>
  );
};
