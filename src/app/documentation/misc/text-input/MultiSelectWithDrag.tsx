"use client";

import { useState, useEffect } from "react";
import Select, { components } from "react-select";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// 1. Komponen Tag yang bisa di-sort
const SortableMultiValue = (props: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props.data.value,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <components.MultiValue {...props} />
    </div>
  );
};

export default function MultiSelectWithDrag() {
  const [selected, setSelected] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragStart = (event: any) => setActiveId(event.active.id);

  const onDragEnd = (event: any) => {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSelected((items) => {
        const oldIndex = items.findIndex((i) => i.value === active.id);
        const newIndex = items.findIndex((i) => i.value === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-md">
      <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5 ml-0.5">
        Pilih & Urutkan Kota
      </label>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={selected}
          strategy={horizontalListSortingStrategy}
        >
          <Select
            isMulti
            instanceId="dnd-select"
            value={selected}
            onChange={(val) => setSelected([...val])}
            options={[
              { value: "jakarta", label: "Jakarta" },
              { value: "bandung", label: "Bandung" },
              { value: "surabaya", label: "Surabaya" },
            ]}
            components={{ MultiValue: SortableMultiValue }}
            classNamePrefix="rs"
          />
        </SortableContext>

        {/* Overlay Animasi saat Drag */}
        <DragOverlay>
          {activeId ? (
            <div className="cursor-grabbing opacity-90 scale-105 shadow-2xl rounded-full bg-blue-600 px-3 py-1 text-white text-sm font-medium">
              {selected.find((item) => item.value === activeId)?.label}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
