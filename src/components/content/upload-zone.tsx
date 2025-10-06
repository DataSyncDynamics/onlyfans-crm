"use client";

import { useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Video, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: "image" | "video";
}

interface UploadZoneProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
}

export function UploadZone({ onFilesUploaded }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((fileList: FileList) => {
    const newFiles: UploadedFile[] = [];

    Array.from(fileList).forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) return;

      const id = Math.random().toString(36).substring(7);
      const preview = URL.createObjectURL(file);

      newFiles.push({
        id,
        file,
        preview,
        type: isImage ? "image" : "video",
      });
    });

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
  }, [files, onFilesUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, [processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  }, [processFiles]);

  const removeFile = useCallback((id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesUploaded(updatedFiles);
  }, [files, onFilesUploaded]);

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-xl border-2 border-dashed transition-all duration-200",
          isDragging
            ? "border-purple-500 bg-purple-500/10"
            : "border-slate-700 bg-slate-900/30 hover:border-slate-600 hover:bg-slate-900/50"
        )}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/*,video/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
              <Upload className="h-8 w-8 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Drop files here or click to browse
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Supports JPG, PNG, HEIC, MP4, MOV • Max 100MB per file
          </p>
          <button
            type="button"
            onClick={() => document.getElementById("file-upload")?.click()}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Select Files
          </button>
        </div>
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="relative group aspect-square rounded-lg overflow-hidden bg-slate-800/50 border border-slate-700"
            >
              {file.type === "image" ? (
                <img
                  src={file.preview}
                  alt={file.file.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                  <Video className="h-8 w-8 text-slate-400" />
                </div>
              )}

              {/* File Info Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <div className="flex items-center gap-2">
                  {file.type === "image" ? (
                    <ImageIcon className="h-4 w-4 text-white" />
                  ) : (
                    <Video className="h-4 w-4 text-white" />
                  )}
                  <span className="text-xs text-white truncate flex-1">
                    {file.file.name}
                  </span>
                </div>
                <span className="text-xs text-slate-300 mt-1">
                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFile(file.id)}
                className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
