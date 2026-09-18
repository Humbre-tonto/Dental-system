import React, { useState } from 'react';
import type { PatientDocument, DocumentTag } from '../../types';
import { X, Upload } from 'lucide-react';

interface DocumentUploadModalProps {
  patientId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpload: (doc: PatientDocument) => void;
}

const DOCUMENT_TAGS: DocumentTag[] = [
  'X-Ray',
  'Lab Result',
  'Prescription',
  'Consent Form',
  'Insurance',
  'Intraoral Photo',
];

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  patientId,
  isOpen,
  onClose,
  onUpload,
}) => {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState<DocumentTag>('X-Ray');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;

      const newDoc: PatientDocument = {
        id: `doc-${window.crypto.randomUUID ? window.crypto.randomUUID().slice(0, 8) : Math.random()}`,
        patientId,
        title,
        tag,
        fileName: file.name,
        fileType: file.type,
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: file.size,
        dataUrl,
      };

      onUpload(newDoc);
      setIsUploading(false);
      onClose();
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <h3 className="text-base font-bold">Attach Digital Attachment / X-Ray</h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Document Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Periapical Radiograph Tooth #19"
              className="w-full text-xs border rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Document Tag / Classification</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value as DocumentTag)}
              className="w-full text-xs border rounded-xl px-3 py-2 bg-white"
            >
              {DOCUMENT_TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Local File (X-Ray, Image, PDF)</label>
            <input
              type="file"
              required
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !file}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Encrypting & Storing...' : 'Upload Attachment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
