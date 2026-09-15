"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Star, Trash2 } from "lucide-react";

export interface UploadedMediaItem {
  id: string;
  url: string;
  type: string;
  displayOrder: number;
  isCover: boolean;
}

interface SortableMediaGalleryProps {
  mediaList: UploadedMediaItem[];
  setMediaList: React.Dispatch<React.SetStateAction<UploadedMediaItem[]>>;
  onRemove: (index: number) => void;
  onSetCover: (index: number) => void;
}

interface SortableMediaCardProps {
  item: UploadedMediaItem;
  index: number;
  isCover: boolean;
  onRemove: (index: number) => void;
  onSetCover: (index: number) => void;
}

function SortableMediaCard({
  item,
  index,
  isCover,
  onRemove,
  onSetCover,
}: SortableMediaCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 0 : 1,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative aspect-square rounded-xl border overflow-hidden shadow-md cursor-grab active:cursor-grabbing select-none transition-shadow ${
        isDragging
          ? "border-dashed border-primary bg-primary/5"
          : isCover
            ? "border-primary ring-1 ring-primary/40 bg-[#1c1c1e]"
            : "border-[#2C2C2E] bg-[#1c1c1e] hover:border-gray-600"
      }`}
    >
      <img
        src={item.url}
        alt={`Upload ${index + 1}`}
        className="w-full h-full object-cover pointer-events-none transition-transform duration-300 group-hover:scale-105"
      />

      {/* Top Gradient Overlay */}
      <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />

      {/* Order Badge & Drag Handle */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
        <div className="px-2 py-0.5 bg-black/80 backdrop-blur-md rounded-md text-[10px] text-primary font-mono font-bold border border-primary/20 flex items-center gap-1">
          <GripVertical className="w-3 h-3 text-gray-400 group-hover:text-primary transition-colors" />
          #{item.displayOrder}
        </div>
      </div>

      {/* Delete Button */}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        className="absolute top-2 right-2 p-1.5 bg-black/80 backdrop-blur-md hover:bg-red-500 text-gray-300 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-20 shadow-md"
        title="Remove image"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Bottom Gradient & Cover Status / Button */}
      <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-between z-10">
        {isCover ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary text-black font-bold rounded text-[10px] shadow-md">
            <Star className="w-3 h-3 fill-black text-black" /> Cover
          </span>
        ) : (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onSetCover(index);
            }}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-black/80 hover:bg-primary hover:text-black text-gray-300 rounded text-[10px] font-medium transition-all backdrop-blur-md cursor-pointer border border-[#2C2C2E] hover:border-primary opacity-0 group-hover:opacity-100"
          >
            <Star className="w-3 h-3 text-primary" /> Set Cover
          </button>
        )}
      </div>
    </div>
  );
}

export default function SortableMediaGallery({
  mediaList,
  setMediaList,
  onRemove,
  onSetCover,
}: SortableMediaGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setMediaList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);
        return reordered.map((item, idx) => ({
          ...item,
          displayOrder: idx + 1,
        }));
      });
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeItem = activeId
    ? mediaList.find((item) => item.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={mediaList.map((m) => m.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {mediaList.map((item, idx) => {
            const isCover =
              Boolean(item.isCover) ||
              (mediaList.every((x) => !x.isCover) && idx === 0);

            return (
              <SortableMediaCard
                key={item.id}
                item={item}
                index={idx}
                isCover={isCover}
                onRemove={onRemove}
                onSetCover={onSetCover}
              />
            );
          })}
        </div>
      </SortableContext>

      <DragOverlay dropAnimation={{ duration: 250, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
        {activeItem ? (
          <div className="aspect-square rounded-xl border-2 border-primary bg-[#1c1c1e] overflow-hidden shadow-2xl scale-105 rotate-1 ring-4 ring-primary/20 pointer-events-none">
            <img
              src={activeItem.url}
              alt="Dragging"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/90 backdrop-blur-md rounded-md text-[10px] text-primary font-mono font-bold border border-primary/30 flex items-center gap-1">
              <GripVertical className="w-3 h-3 text-primary" />
              #{activeItem.displayOrder}
            </div>
            {Boolean(activeItem.isCover) && (
              <div className="absolute bottom-2 left-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary text-black font-bold rounded text-[10px] shadow-md">
                  <Star className="w-3 h-3 fill-black text-black" /> Cover
                </span>
              </div>
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
