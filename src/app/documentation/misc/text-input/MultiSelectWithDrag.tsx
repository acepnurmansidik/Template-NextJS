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
import { FaCheck, FaCopy } from "react-icons/fa";

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
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
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

  const [copied, setCopied] = useState(false);

  const codeCopied = `  <DndContext
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
        onChange={(vals) => {
          // Logic here...
        }}
        components={{ MultiValue: SortableMultiValue }}
        classNamePrefix="rs"
      />
    </SortableContext>

    <DragOverlay>
      {activeId ? (
        <div className="cursor-grabbing opacity-90 scale-105 shadow-2xl rounded-full bg-blue-600 px-3 py-1 text-white text-sm font-medium">
          {selected.find((item) => item.value === activeId)?.label}
        </div>
      ) : null}
    </DragOverlay>
  </DndContext>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeCopied);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setTimeout(() => setActiveTab("preview"), 1000);
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between items-center mb-3">
        <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Multiple Select With Drag
        </label>

        {/* Tab Switcher */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 text-[10px] hover:cursor-pointer font-bold uppercase rounded-md transition-all ${
              activeTab === "preview"
                ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1 text-[10px] hover:cursor-pointer font-bold uppercase rounded-md transition-all ${
              activeTab === "code"
                ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500"
            }`}
          >
            Code
          </button>
        </div>
      </div>

      <div className="">
        {activeTab === "preview" ? (
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
        ) : (
          <div className="relative group">
            {/* Tombol Copy */}
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-800 rounded-md text-zinc-400 hover:text-white z-10"
            >
              {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
            </button>

            {/* Simulasi Code Editor */}
            <div className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-zinc-700 font-mono text-[13px]">
              <div className="flex p-4 overflow-x-auto">
                <div className="text-zinc-600 text-right pr-4 select-none">
                  {codeCopied.split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <pre className="text-blue-300">
                  <code>{codeCopied}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
