export interface CreateMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CreateMediaFormData {
  title: string;
  category: string;
  type: string;
  mediaUrl: string;
  thumbnailUrl: string;
  caption: string;
  badgeText: string;
  displayOrder: number;
  isPublished: boolean;
}

export const INITIAL_MEDIA_FORM_DATA: CreateMediaFormData = {
  title: "",
  category: "AVIATION",
  type: "IMAGE",
  mediaUrl: "",
  thumbnailUrl: "",
  caption: "",
  badgeText: "",
  displayOrder: 0,
  isPublished: true,
};

export const CATEGORY_OPTIONS = [
  { label: "Aviation", value: "AVIATION" },
  { label: "Yacht", value: "YACHT" },
  { label: "Automotive", value: "AUTOMOTIVE" },
  { label: "Real Estate", value: "REAL_ESTATE" },
  { label: "Watches", value: "WATCH" },
];

export interface CreateMediaFormProps {
  onClose: () => void;
}

export interface MediaUploadSectionProps {
  mediaUrl: string;
  mediaType: string;
  mediaInputMode: "upload" | "url";
  setMediaInputMode: (mode: "upload" | "url") => void;
  isDraggingMedia: boolean;
  setIsDraggingMedia: (dragging: boolean) => void;
  isUploading: boolean;
  onMediaUrlChange: (url: string) => void;
  onUploadFile: (file: File) => void;
  onRemoveMedia: () => void;
}

export interface ThumbnailUploadSectionProps {
  thumbnailUrl: string;
  thumbInputMode: "upload" | "url";
  setThumbInputMode: (mode: "upload" | "url") => void;
  isUploadingThumb: boolean;
  onThumbnailUrlChange: (url: string) => void;
  onUploadFile: (file: File) => void;
}

export interface MediaMetadataFieldsProps {
  formData: CreateMediaFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}
