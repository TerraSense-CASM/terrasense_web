import React from 'react';
import { Icons } from './Icons';

export const AccuracyMetrics: React.FC = () => {
  const slides = [
    {
      id: 1,
      title: 'TS-Instruct Detection – 2D Bounding Boxes',
      description:
        'Overall 2D object detection accuracy on TS-Instruct, comparing precision, recall, F1-score and mean IoU across GeoChat, TEOChat, Qwen2-VL and TerraSense.',
      image: 'accuracy/1.png',
    },
    {
      id: 2,
      title: 'TS-Instruct Detection – Oriented Bounding Boxes',
      description:
        'Oriented (rotated) bounding box detection results on TS-Instruct, highlighting TerraSense performance on densely packed objects such as aircraft, ships and infrastructure.',
      image: 'accuracy/2.png',
    },
    {
      id: 3,
      title: 'TS-Instruct Geolocation & Elevation Estimation',
      description:
        'Geospatial reasoning metrics on TS-Instruct, including location accuracy, mean distance error and digital elevation prediction, where TerraSense outperforms baseline vision-language models.',
      image: 'accuracy/3.png',
    },
    {
      id: 4,
      title: 'FAIIRM Dataset – Category Accuracy',
      description:
        'FAIIRM dataset evaluation showing per-category accuracy (airplanes, infrastructure, ships and sports fields), with TerraSense achieving the best scores among compared models.',
      image: 'accuracy/4.png',
    },
  ];

  return (
    <section id="accuracy" className="py-24 bg-space-800 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -left-32 top-10 w-96 h-96 bg-brand-DEFAULT/40 rounded-full blur-3xl" />
        <div className="absolute -right-32 bottom-0 w-96 h-96 bg-brand-accent/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-DEFAULT/10 border border-brand-DEFAULT/30 text-brand-DEFAULT text-xs font-mono mb-4">
            <Icons.Cpu className="w-4 h-4" />
            <span>Accuracy Metrics</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Accuracy & Benchmark Slides</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">s
            This section mirrors the accuracy slides from the TerraSense-Base report, covering TS-Instruct detection (2D and oriented boxes), geolocation & elevation estimation, and FAIIRM dataset evaluation. Each card corresponds to slides.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="group bg-space-900/80 rounded-2xl border border-slate-700 hover:border-brand-DEFAULT/60 transition-all overflow-hidden shadow-xl hover:-translate-y-1"
            >
              <div className="aspect-video bg-space-900 flex items-center justify-center overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-contain bg-space-900"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{slide.title}</h3>
                  <span className="text-xs font-mono text-slate-500">Slide {slide.id}</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {slide.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs text-slate-500 text-center">
          
        </p>
      </div>
    </section>
  );
};
