import React from 'react';
import { TaskCategory } from '../types';
import { Icons } from './Icons';

const taskCategories: TaskCategory[] = [
  {
    title: "Unified Perception & Cognition",
    tasks: [
      "Object detection, captioning, and VQA in one model",
      "Supports single- and multi-image instructions"
    ]
  },
  {
    title: "Geospatial Intelligence",
    tasks: [
      "Understands coordinates and relative positions",
      "Handles dense object clusters in overhead views"
    ]
  },
  {
    title: "Temporal Change Reasoning",
    tasks: [
      "Bi-temporal change detection with paired images",
      "Describes locations and categories of changes"
    ]
  },
  {
    title: "Comprehensive Task Spectrum",
    tasks: [
      "Integrates diverse tasks from rotated object detection to dense object counting.",
      "Unifies land cover classification, fine-grained grounding, and region-specific QA."
    ]
  }
];

export const ModelSpecs: React.FC = () => {
  return (
    <section id="tasks" className="py-24 bg-space-800 relative overflow-hidden">
       {/* Abstract Background */}
       <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
         <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
         <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
       </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            All-In-One <span className="text-brand-DEFAULT">Remote Sensing</span> Foundation
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            TerraSense-Base unifies detection, captioning, VQA, and change detection into a single multimodal model, trained on the TS-Instruct corpus derived from 21 public remote sensing datasets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {taskCategories.map((category, idx) => (
            <div key={idx} className="group p-8 rounded-2xl bg-space-900/50 border border-slate-700 hover:border-brand-DEFAULT/50 transition-all hover:-translate-y-1">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 flex items-center justify-center bg-space-800 rounded-lg text-brand-DEFAULT text-sm font-mono border border-slate-700">
                  {idx + 1}
                </span>
                {category.title}
              </h3>
              <div className="space-y-3">
                {category.tasks.map((task, tIdx) => (
                  <div key={tIdx} className="flex items-center gap-3 text-slate-400 group-hover:text-slate-200 transition-colors">
                    <Icons.CheckCircle2 className="w-4 h-4 text-brand-glow/50 group-hover:text-brand-glow" />
                    <span className="font-mono text-sm">{task}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Architecture / Detail Banner */}
        <div className="mt-16 p-1 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700">
          <div className="bg-space-900 rounded-xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">8B-Parameter Multimodal Backbone</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Built on a robust transformer architecture, TerraSense-Base is optimized for 
                  <span className="text-brand-DEFAULT"> visual-language alignment</span> and 
                  <span className="text-brand-DEFAULT"> geospatial reasoning</span>, serving as a strong backbone for remote sensing and GIS agents.
                </p>
             </div>
             <div className="flex gap-8">
                <div className="text-center">
                   <div className="text-3xl font-bold text-white font-mono">300k+</div>
                   <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">TS-Instruct Instructions</div>
                </div>
                <div className="text-center">
                   <div className="text-3xl font-bold text-brand-glow font-mono">21</div>
                   <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Public RS Datasets</div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};