'use client';

import { useState } from 'react';
import { Project } from '@/types/project';
import { PrintConfig, PrintConfiguration } from './PrintConfig';
import { PrintPreview } from './PrintPreview';
import { X } from 'lucide-react';

interface PrintManagerProps {
  projects: Project[];
  onClose: () => void;
}

export function PrintManager({ projects, onClose }: PrintManagerProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [config, setConfig] = useState<PrintConfiguration | null>(null);

  const handlePrint = (printConfig: PrintConfiguration) => {
    setConfig(printConfig);
    setShowPreview(true);
  };

  const handleActualPrint = () => {
    window.print();
  };

  if (showPreview && config) {
    return (
      <>
        {/* Screen Preview Modal */}
        <div className="fixed inset-0 bg-gray-100 z-50 screen-only" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
          {/* Header */}
          <div className="bg-gray-900 text-white p-4" style={{ flexShrink: 0 }}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <h2 className="text-xl font-bold">Print Preview</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Back to Config
                </button>
                <button
                  onClick={handleActualPrint}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-semibold"
                >
                  Print to PDF
                </button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content - visible on screen */}
          <div className="bg-white" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0, WebkitOverflowScrolling: 'touch' }}>
            <PrintPreview projects={projects} config={config} />
          </div>
        </div>

        {/* Print-only content - at root level */}
        <div className="print-only-content">
          <PrintPreview projects={projects} config={config} />
        </div>
      </>
    );
  }

  return <PrintConfig projects={projects} onClose={onClose} onPrint={handlePrint} />;
}
