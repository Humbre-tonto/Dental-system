import React, { useState } from 'react';
import type { PatientDocument } from '../../types';
import { DocumentUploadModal } from './DocumentUploadModal';
import { DocumentViewerModal } from './DocumentViewerModal';
import { FolderOpen, Plus, Eye, Trash2, FileText, Download } from 'lucide-react';

interface DocumentCenterProps {
  patientId: string;
  documents: PatientDocument[];
  onUploadDocument: (doc: PatientDocument) => void;
  onRemoveDocument: (docId: string) => void;
}

export const DocumentCenter: React.FC<DocumentCenterProps> = ({
  patientId,
  documents,
  onUploadDocument,
  onRemoveDocument,
}) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<PatientDocument | null>(null);

  const tagBadgeColors: Record<string, string> = {
    'X-Ray': 'bg-purple-50 text-purple-700 border-purple-200',
    'Lab Result': 'bg-blue-50 text-blue-700 border-blue-200',
    'Prescription': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Consent Form': 'bg-amber-50 text-amber-700 border-amber-200',
    'Insurance': 'bg-slate-100 text-slate-700 border-slate-200',
    'Intraoral Photo': 'bg-sky-50 text-sky-700 border-sky-200',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b pb-4 border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-blue-600" />
            <span>Digital Attachments & X-Rays Vault</span>
          </h3>
          <p className="text-xs text-slate-500">
            Secure client documents, radiograph scans, prescriptions, and consent forms
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Attachment</span>
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12 space-y-3">
          <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">No Document Vault Attachments</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Upload radiograph scans, lab results, prescriptions, or patient consent forms stored securely in IndexedDB.
          </p>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Upload Document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => {
            const isImg = doc.fileType.startsWith('image/') || doc.dataUrl.startsWith('data:image/');

            return (
              <div
                key={doc.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                        tagBadgeColors[doc.tag] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {doc.tag}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{doc.uploadDate}</span>
                  </div>

                  {/* Thumbnail Preview Area */}
                  <div
                    onClick={() => setViewingDoc(doc)}
                    className="h-32 bg-slate-200/80 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer group relative border border-slate-300/50"
                  >
                    {isImg ? (
                      <img
                        src={doc.dataUrl}
                        alt={doc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="text-center text-slate-500 space-y-1">
                        <FileText className="w-8 h-8 text-blue-600 mx-auto" />
                        <span className="text-[10px] font-bold block">{doc.fileName}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white space-x-1 text-xs font-bold">
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-900 truncate">{doc.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono truncate">{doc.fileName}</p>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setViewingDoc(doc)}
                    className="flex items-center space-x-1 font-bold text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  <a
                    href={doc.dataUrl}
                    download={doc.fileName}
                    className="flex items-center space-x-1 font-bold text-slate-600 hover:text-slate-800"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete document "${doc.title}"?`)) {
                        onRemoveDocument(doc.id);
                      }
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <DocumentUploadModal
        patientId={patientId}
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={onUploadDocument}
      />

      {/* Viewer Modal */}
      <DocumentViewerModal document={viewingDoc} onClose={() => setViewingDoc(null)} />
    </div>
  );
};
