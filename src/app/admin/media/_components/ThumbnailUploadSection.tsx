import React, { useRef } from "react";
import { Image as ImageIcon, UploadCloud, Loader2 } from "lucide-react";
import { ThumbnailUploadSectionProps } from "./types";

export function ThumbnailUploadSection({
  thumbnailUrl,
  thumbInputMode,
  setThumbInputMode,
  isUploadingThumb,
  onThumbnailUrlChange,
  onUploadFile,
}: ThumbnailUploadSectionProps) {
  const thumbFileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadFile(file);
    }
    if (e.target) {
      e.target.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-gray-400" /> Thumbnail URL (Optional)
        </label>

        <div className="flex items-center gap-1 bg-[#0E0E10] border border-[#262626] p-0.5 rounded-lg text-[10px]">
          <button
            type="button"
            onClick={() => setThumbInputMode("upload")}
            className={`px-2 py-0.5 rounded-md transition-colors font-medium cursor-pointer ${
              thumbInputMode === "upload"
                ? "bg-primary text-black"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setThumbInputMode("url")}
            className={`px-2 py-0.5 rounded-md transition-colors font-medium cursor-pointer ${
              thumbInputMode === "url" ? "bg-primary text-black" : "text-gray-400 hover:text-white"
            }`}
          >
            Direct URL
          </button>
        </div>
      </div>

      {thumbInputMode === "upload" ? (
        <div className="flex items-center gap-3">
          <input
            ref={thumbFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleThumbFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => thumbFileInputRef.current?.click()}
            disabled={isUploadingThumb}
            className="px-4 py-2.5 rounded-xl border border-[#262626] bg-[#0E0E10] hover:bg-[#18181A] text-xs font-medium text-gray-300 hover:text-white transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {isUploadingThumb ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <UploadCloud className="w-4 h-4 text-primary" />
            )}
            <span>Upload Thumbnail</span>
          </button>
          {thumbnailUrl && (
            <span className="text-xs text-emerald-400 truncate max-w-xs font-mono">
              {thumbnailUrl}
            </span>
          )}
        </div>
      ) : (
        <input
          type="url"
          name="thumbnailUrl"
          value={thumbnailUrl}
          onChange={(e) => onThumbnailUrlChange(e.target.value)}
          placeholder="https://res.cloudinary.com/demo/image/upload/thumb.jpg"
          className="w-full bg-[#0E0E10] border border-[#262626] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/60 transition-colors font-mono"
        />
      )}
    </div>
  );
}

export default ThumbnailUploadSection;
