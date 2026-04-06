'use client';
import { useState, useCallback } from 'react';

type Props = {
  photos: string[];
  onChange: (photos: string[]) => void;
};

export default function ImageUploader({ photos, onChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files: FileList) => {
    const newPhotos: string[] = [...photos];
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        if (base64) {
          newPhotos.push(base64);
          onChange([...newPhotos]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="image-uploader-container">
      <div 
        className={`dropzone ${isDragging ? 'dragging' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input 
          id="fileInput"
          type="file" 
          multiple 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="dropzone-content">
          <span className="dropzone-icon">⏏</span>
          <p>Drag & drop product photos here</p>
          <span className="text-sm text-muted">or click to browse files</span>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="photo-previews">
          {photos.map((photo, i) => (
            <div key={i} className="photo-preview-item">
              <img src={photo} alt={`Preview ${i}`} />
              <button className="photo-remove" onClick={(e) => { e.stopPropagation(); removePhoto(i); }}>×</button>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .image-uploader-container {
          width: 100%;
          margin-top: 8px;
        }
        .dropzone {
          border: 2px dashed #e5e7eb;
          border-radius: 12px;
          padding: 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f9fafb;
        }
        .dropzone.dragging {
          border-color: var(--black);
          background: #f3f4f6;
          transform: scale(1.01);
        }
        .dropzone-icon {
          font-size: 24px;
          display: block;
          margin-bottom: 8px;
          color: #9ca3af;
        }
        .dropzone-content p {
          margin: 0;
          font-weight: 500;
          color: #374151;
        }
        .photo-previews {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          overflow-x: auto;
          padding-bottom: 8px;
        }
        .photo-preview-item {
          position: relative;
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e5e7eb;
        }
        .photo-preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .photo-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          line-height: 1;
          z-index: 5;
          transition: background 0.2s;
        }
        .photo-remove:hover {
          background: var(--red, #ef4444);
        }
      `}</style>
    </div>
  );
}
