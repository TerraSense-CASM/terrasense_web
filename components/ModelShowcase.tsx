import React, { useState, useEffect, useRef } from 'react';
import { Icons } from './Icons';
import { ChatMessage } from '../types';
import ContextSample from '../微信图片_20251203183425_139_156.jpg';

const exampleImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800&auto=format&fit=crop",
    label: "Oriented Object Detection (Planes)",
    tag: "Task 1"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800&auto=format&fit=crop",
    label: "Urban Scene Understanding",
    tag: "Task 3"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?q=80&w=800&auto=format&fit=crop",
    label: "Land Cover Classification",
    tag: "Task 4"
  }
];

const chatSequence: ChatMessage[] = [
  {
    id: 1,
    role: 'user',
    text:
      '<image> From the perspective of remote sensing image interpretation, what is the overall land cover pattern presented in this image? Please briefly describe it, incorporating the main types of ground features and their spatial distribution characteristics.',
    delay: 500,
  },
  {
    id: 2,
    role: 'model',
    text:
      'A dense urban built-up area. The center features a train station and railway lines, surrounded by dense residential and industrial buildings with a small amount of green space interspersed, presenting a typical urban texture.',
    delay: 2500,
  },
  {
    id: 3,
    role: 'user',
    text:
      'Analyzed from the perspective of remote sensing object detection, what category does the object identified by the oriented bounding box at coordinates [455,321,533,321,533,721,455,721] belong to?',
    delay: 6500,
  },
  { id: 4, role: 'model', text: 'Train station.', delay: 8500 },
  { id: 5, role: 'user', text: 'What percentage of the image area is occupied by the train station?', delay: 10500 },
  { id: 6, role: 'model', text: '4.9%', delay: 12000 },
];

export const ModelShowcase: React.FC = () => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Carousel Auto-scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % exampleImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Chat Simulation
  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    
    const runSequence = () => {
      setVisibleMessages([]); // Reset
      
      chatSequence.forEach((msg) => {
        const timeout = setTimeout(() => {
          if (msg.role === 'model') setIsTyping(true);
          
          // Artificial typing delay for model
          setTimeout(() => {
            setVisibleMessages((prev) => [...prev, msg]);
            if (msg.role === 'model') setIsTyping(false);
            
            // Scroll to bottom
            if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
          }, msg.role === 'model' ? 800 : 0);

        }, msg.delay);
        timeouts.push(timeout);
      });
    };

    // Intersection Observer to start animation when visible could be added here
    // For now, just loop it
    runSequence();
    const loopInterval = setInterval(runSequence, 16000); // Restart every 16s

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(loopInterval);
    };
  }, []);

  return (
    <section id="showcase" className="py-24 bg-space-900 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-block p-2 rounded-full bg-brand-accent/10 text-brand-accent mb-4">
            <Icons.Layers className="w-6 h-6" />
          </div>
          <h2 className="text-4xl font-bold mb-4">TerraSense Capabilities & Example</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Showcasing <span className="font-semibold text-white">TerraSense-Base</span> on representative remote sensing tasks, including object detection, land-cover segmentation, scene classification, VQA, and bi-temporal change detection.
          </p>
        </div>

        {/* FEATURE 1: TS-Instruct DETECTION TABLES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24" id="Example">
          {/* Left: 2D bounding box detection */}
          <div className="bg-space-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
            <div className="px-5 pt-4 pb-3 border-b border-slate-700">
              <div className="text-xs font-mono uppercase tracking-wide text-brand-DEFAULT">TS-Instruct – 2D Detection</div>
              <p className="text-xs text-slate-400 mt-1">
                Result of baseline models on the test set of 2D object detection. Mean IoU is averaged over all TS-Instruct test samples.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm text-left">
                <thead className="bg-space-900 text-[11px] md:text-xs text-slate-400 uppercase border-b border-slate-700">
                  <tr>
                    <th className="px-4 md:px-5 py-2.5 font-medium">Model</th>
                    <th className="px-4 md:px-5 py-2.5 font-medium text-right">Precision</th>
                    <th className="px-4 md:px-5 py-2.5 font-medium text-right">Recall</th>
                    <th className="px-4 md:px-5 py-2.5 font-medium text-right">F1-Score</th>
                    <th className="px-4 md:px-5 py-2.5 font-medium text-right">Mean IoU</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  <tr className="hover:bg-space-900/60 transition-colors">
                    <td className="px-4 md:px-5 py-2.5 text-slate-300">GeoChat</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">6.81%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">8.87%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">7.70%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">14.84%</td>
                  </tr>
                  <tr className="hover:bg-space-900/60 transition-colors">
                    <td className="px-4 md:px-5 py-2.5 text-slate-300">TEOChat</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">23.70%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">5.70%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">9.19%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">17.70%</td>
                  </tr>
                  <tr className="hover:bg-space-900/60 transition-colors">
                    <td className="px-4 md:px-5 py-2.5 text-slate-300">Qwen3-VL-8B</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">11.76%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">36.91%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">17.83%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">24.51%</td>
                  </tr>
                  <tr className="hover:bg-space-900/60 transition-colors">
                    <td className="px-4 md:px-5 py-2.5 text-slate-300">Qwen3-VL-32B</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">36.72%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">66.38%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">47.29%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">45.02%</td>
                  </tr>
                  <tr className="bg-brand-DEFAULT/5 hover:bg-brand-DEFAULT/10 transition-colors">
                    <td className="px-4 md:px-5 py-2.5 font-semibold text-brand-DEFAULT">TerraSense</td>
                    <td className="px-4 md:px-5 py-2.5 text-right font-semibold text-white">78.51%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right font-semibold text-white">67.26%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right font-semibold text-white">72.45%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right font-semibold text-white">69.77%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Oriented bounding box detection */}
          <div className="bg-space-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
            <div className="px-5 pt-4 pb-3 border-b border-slate-700">
              <div className="text-xs font-mono uppercase tracking-wide text-brand-DEFAULT">TS-Instruct – Oriented Detection</div>
              <p className="text-xs text-slate-400 mt-1">
                Result of baseline models on oriented object detection. General VLMs struggle to produce meaningful rotated boxes.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm text-left">
                <thead className="bg-space-900 text-[11px] md:text-xs text-slate-400 uppercase border-b border-slate-700">
                  <tr>
                    <th className="px-4 md:px-5 py-2.5 font-medium">Model</th>
                    <th className="px-4 md:px-5 py-2.5 font-medium text-right">Precision</th>
                    <th className="px-4 md:px-5 py-2.5 font-medium text-right">Recall</th>
                    <th className="px-4 md:px-5 py-2.5 font-medium text-right">F1-Score</th>
                    <th className="px-4 md:px-5 py-2.5 font-medium text-right">Mean IoU</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  <tr className="hover:bg-space-900/60 transition-colors">
                    <td className="px-4 md:px-5 py-2.5 text-slate-300">GeoChat</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">0.48%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">0.55%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">0.51%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">0.65%</td>
                  </tr>
                  <tr className="hover:bg-space-900/60 transition-colors">
                    <td className="px-4 md:px-5 py-2.5 text-slate-300">TEOChat</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">2.31%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">1.68%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">1.94%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">5.73%</td>
                  </tr>
                  <tr className="hover:bg-space-900/60 transition-colors">
                    <td className="px-4 md:px-5 py-2.5 text-slate-300">Qwen3-VL-8B</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">0.08%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">0.04%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">0.06%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">0.07%</td>
                  </tr>
                  <tr className="hover:bg-space-900/60 transition-colors">
                    <td className="px-4 md:px-5 py-2.5 text-slate-300">Qwen3-VL-32B</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">0.55%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">0.17%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">0.26%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right text-slate-300">0.34%</td>
                  </tr>
                  <tr className="bg-brand-DEFAULT/5 hover:bg-brand-DEFAULT/10 transition-colors">
                    <td className="px-4 md:px-5 py-2.5 font-semibold text-brand-DEFAULT">TerraSense</td>
                    <td className="px-4 md:px-5 py-2.5 text-right font-semibold text-white">72.27%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right font-semibold text-white">59.88%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right font-semibold text-white">65.49%</td>
                    <td className="px-4 md:px-5 py-2.5 text-right font-semibold text-white">79.02%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FEATURE 2: INTERACTIVE AGENT SIMULATION */}
        <div className="relative rounded-3xl bg-space-800 border border-slate-700 p-1 md:p-4 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-DEFAULT to-transparent opacity-50"></div>
          
          <div className="bg-space-900/80 backdrop-blur rounded-2xl flex flex-col md:flex-row overflow-hidden h-[600px]">
            {/* Left: Context Image */}
            <div className="w-full md:w-1/2 bg-black relative border-r border-slate-800">
              <img 
                src={ContextSample} 
                alt="TerraSense detection context" 
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div className="w-3/4 h-3/4 border border-dashed border-white/30 rounded-lg relative">
                    <div className="absolute top-0 left-0 bg-brand-DEFAULT/20 text-brand-DEFAULT text-xs px-2 py-1">Region of Interest</div>
                 </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/80 px-4 py-2 rounded-lg text-xs font-mono text-brand-DEFAULT border border-brand-DEFAULT/30">
                AGENT_MODE: ACTIVE<br/>
                IMG_SOURCE: OPTICAL
              </div>
            </div>

            {/* Right: Chat Interface */}
            <div className="w-full md:w-1/2 flex flex-col">
              <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-space-900">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-brand-DEFAULT flex items-center justify-center">
                    <Icons.Cpu className="w-5 h-5 text-space-900" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">TerraSense-Base</div>
                    <div className="text-xs text-green-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                      Online
                    </div>
                  </div>
                </div>
                <Icons.MessageSquare className="text-slate-600 w-5 h-5" />
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-6" ref={scrollRef}>
                {visibleMessages.map((msg) => (
                  <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-float`}>
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.role === 'user' ? 'bg-slate-700' : 'bg-brand-DEFAULT/10'}`}>
                      {msg.role === 'user' ? <Icons.Eye className="w-4 h-4 text-slate-300" /> : <Icons.Satellite className="w-4 h-4 text-brand-DEFAULT" />}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-slate-800 text-white rounded-tr-none border border-slate-700' 
                        : 'bg-brand-DEFAULT/5 text-slate-200 rounded-tl-none border border-brand-DEFAULT/10'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-brand-DEFAULT/10 flex-shrink-0 flex items-center justify-center">
                       <Icons.Satellite className="w-4 h-4 text-brand-DEFAULT" />
                     </div>
                     <div className="bg-brand-DEFAULT/5 rounded-2xl rounded-tl-none p-4 border border-brand-DEFAULT/10 flex gap-1 items-center h-12">
                        <span className="w-1.5 h-1.5 bg-brand-DEFAULT rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-brand-DEFAULT rounded-full animate-bounce delay-100"></span>
                        <span className="w-1.5 h-1.5 bg-brand-DEFAULT rounded-full animate-bounce delay-200"></span>
                     </div>
                  </div>
                )}
              </div>

              {/* Fake Input Area */}
              <div className="p-4 bg-space-900 border-t border-slate-800">
                <div className="bg-space-800 rounded-xl p-3 border border-slate-700 flex justify-between items-center opacity-50 cursor-not-allowed">
                  <span className="text-slate-500 text-sm">Simulated interaction...</span>
                  <Icons.ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};