import React, { useState } from 'react';
import type { PatientDocument } from '../../types';
import { X, ZoomIn, ZoomOut, Download, FileText } from 'lucide-react';

interface DocumentViewerModalProps {
  document: PatientDocument | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ document, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [invert, setInvert] = useState(false);

  if (!document) return null;

  const isImage = document.fileType.startsWith('image/') || document.dataUrl.startsWith('data:image/');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Topbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 text-white">
          <div className="flex items-center space-x-3">
            <span className="p-2 bg-blue-600/30 text-blue-400 rounded-xl font-bold text-xs border border-blue-500/30">
              {document.tag}
            </span>
            <div>
              <h3 className="text-sm font-bold">{document.title}</h3>
              <p className="text-[10px] text-slate-400 font-mono">
                {document.fileName} • Uploaded {document.uploadDate}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isImage && (
              <>
                <button
                  onClick={() => setZoom((prev) => Math.min(prev + 0.25, 2.5))}
                  className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl hover:bg-slate-700"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoom((prev) => Math.max(prev - 0.25, 0.5))}
                  className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl hover:bg-slate-700"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setInvert((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                    invert
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title="Invert Image Contrast (For X-Rays)"
                >
                  X-Ray Invert
                </button>
              </>
            )}

            <a
              href={document.dataUrl}
              download={document.fileName}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl hover:bg-slate-700"
              title="Download File"
            >
              <Download className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl hover:bg-slate-700 ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Canvas */}
        <div className="flex-1 p-6 overflow-auto bg-slate-950 flex items-center justify-center min-h-[400px]">
          {isImage ? (
            <img
              src={document.dataUrl}
              alt={document.title}
              style={{
                transform: `scale(${zoom})`,
                filter: invert ? 'invert(1) contrast(1.2)' : 'none',
              }}
              className="max-h-[60vh] object-contain transition-transform duration-200 rounded-lg shadow-2xl border border-slate-800"
            />
          ) : (
            <div className="text-center p-12 text-slate-400 space-y-4">
              <FileText className="w-16 h-16 text-blue-500 mx-auto" />
              <p className="text-xs font-bold text-slate-200">PDF or Binary Document Stored</p>
              <a
                href={document.dataUrl}
                download={document.fileName}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-500"
              >
                <Download className="w-4 h-4" />
                <span>Download {document.fileName}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
