"use client";

// Kanvas denah berbasis Konva (react-konva).
//
// PRESISI LINTAS UKURAN LAYAR: koordinat item disimpan dalam RUANG DASAR
// (base space = ukuran natural gambar denah). Stage bisa di-zoom & di-pan;
// pada zoom 100% seluruh denah pas (fit) di viewport. Karena semua item adalah
// anak Stage, posisi/skala/rotasi tetap presisi terhadap denah di zoom berapa
// pun.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Image as KonvaImage,
  Group,
  Transformer,
} from "react-konva";
import useImage from "use-image";
import { FiCopy, FiTrash2, FiPlus, FiMinus, FiMaximize } from "react-icons/fi";
import type Konva from "konva";

export interface CanvasItem {
  _id: string;
  component_id: string | null;
  name?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale_x: number;
  scale_y: number;
  rotation: number;
  color: string;
  opacity: number;
}

interface DataProps {
  bgUrl: string | null;
  baseWidth: number;
  baseHeight: number;
  items: CanvasItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (id: string, patch: Partial<CanvasItem>) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function LayoutCanvas({
  bgUrl,
  baseWidth,
  baseHeight,
  items,
  selectedId,
  onSelect,
  onChange,
  onDuplicate,
  onDelete,
}: DataProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [bgImage] = useImage(bgUrl || "");

  const trRef = useRef<Konva.Transformer | null>(null);
  const stageRef = useRef<Konva.Stage | null>(null);
  const nodeRefs = useRef<Record<string, Konva.Group | null>>({});
  const [toolbarPos, setToolbarPos] = useState<{
    left: number;
    top: number;
  } | null>(null);

  // Zoom/pan state.
  const [stageScale, setStageScale] = useState(0);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  // Ukur viewport (fit tanpa scroll pada zoom 100%).
  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const update = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const fitScale = useMemo(() => {
    if (box.w <= 0 || box.h <= 0) return 0;
    return Math.min(box.w / baseWidth, box.h / baseHeight);
  }, [box, baseWidth, baseHeight]);

  // "Fit": denah di-center & pas di viewport (zoom = 100%).
  const fit = useCallback(() => {
    if (!fitScale) return;
    const w = baseWidth * fitScale;
    const h = baseHeight * fitScale;
    setStageScale(fitScale);
    setStagePos({ x: (box.w - w) / 2, y: (box.h - h) / 2 });
  }, [fitScale, baseWidth, baseHeight, box]);

  useEffect(() => {
    fit();
  }, [fit]);

  const minScale = fitScale * 0.2;
  const maxScale = fitScale * 8;
  const zoomPct = fitScale ? Math.round((stageScale / fitScale) * 100) : 100;

  const selected = items.find((i) => i._id === selectedId) || null;

  const syncToolbar = useCallback(() => {
    const node = selectedId ? nodeRefs.current[selectedId] : null;
    if (!node) {
      setToolbarPos(null);
      return;
    }
    const rect = node.getClientRect();
    setToolbarPos({ left: rect.x + rect.width / 2, top: rect.y });
  }, [selectedId]);

  useEffect(() => {
    const tr = trRef.current;
    if (tr) {
      const node = selectedId ? nodeRefs.current[selectedId] : null;
      tr.nodes(node ? [node] : []);
      tr.getLayer()?.batchDraw();
    }
    syncToolbar();
  }, [selectedId, items, stageScale, stagePos, syncToolbar]);

  // Zoom ke arah titik (pointer / center). Baca nilai live dari node Stage
  // supaya tidak "meloncat" saat event wheel beruntun.
  const zoomTo = useCallback(
    (newScaleRaw: number, point: { x: number; y: number }) => {
      const stage = stageRef.current;
      const oldScale = stage ? stage.scaleX() : stageScale || fitScale;
      const pos = stage
        ? { x: stage.x(), y: stage.y() }
        : stagePos;
      const newScale = clamp(newScaleRaw, minScale, maxScale);
      const mousePointTo = {
        x: (point.x - pos.x) / oldScale,
        y: (point.y - pos.y) / oldScale,
      };
      setStageScale(newScale);
      setStagePos({
        x: point.x - mousePointTo.x * newScale,
        y: point.y - mousePointTo.y * newScale,
      });
    },
    [stageScale, fitScale, minScale, maxScale, stagePos],
  );

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const pointer = stage?.getPointerPosition();
    if (!stage || !pointer) return;
    const factor = 1.08;
    const dir = e.evt.deltaY > 0 ? 1 / factor : factor;
    zoomTo(stage.scaleX() * dir, pointer);
  };

  const zoomButton = (dir: number) => {
    const stage = stageRef.current;
    const scale = stage ? stage.scaleX() : stageScale || fitScale;
    zoomTo(scale * dir, { x: box.w / 2, y: box.h / 2 });
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
    >
      {stageScale > 0 && (
        <>
          <Stage
            ref={stageRef}
            width={box.w}
            height={box.h}
            scaleX={stageScale}
            scaleY={stageScale}
            x={stagePos.x}
            y={stagePos.y}
            draggable
            onWheel={handleWheel}
            onDragMove={() => {
              const s = stageRef.current;
              if (s) setStagePos({ x: s.x(), y: s.y() });
              syncToolbar();
            }}
            onDragEnd={() => {
              const s = stageRef.current;
              if (s) setStagePos({ x: s.x(), y: s.y() });
            }}
            onMouseDown={(e) => {
              if (
                e.target === e.target.getStage() ||
                e.target.name() === "bg"
              ) {
                onSelect(null);
              }
            }}
          >
            <Layer>
              {bgImage ? (
                <KonvaImage
                  name="bg"
                  image={bgImage}
                  x={0}
                  y={0}
                  width={baseWidth}
                  height={baseHeight}
                />
              ) : (
                <Rect
                  name="bg"
                  x={0}
                  y={0}
                  width={baseWidth}
                  height={baseHeight}
                  fill="#f4f4f5"
                  stroke="#e4e4e7"
                  strokeWidth={1}
                />
              )}

              {items.map((item) => {
                const isSelected = item._id === selectedId;
                return (
                  <Group
                    key={item._id}
                    ref={(node) => {
                      nodeRefs.current[item._id] = node;
                    }}
                    x={item.x}
                    y={item.y}
                    scaleX={item.scale_x}
                    scaleY={item.scale_y}
                    rotation={item.rotation}
                    opacity={item.opacity}
                    draggable
                    onMouseDown={(e) => {
                      e.cancelBubble = true;
                      onSelect(item._id);
                    }}
                    onTap={(e) => {
                      e.cancelBubble = true;
                      onSelect(item._id);
                    }}
                    onDragMove={syncToolbar}
                    onDragEnd={(e) => {
                      onChange(item._id, { x: e.target.x(), y: e.target.y() });
                      syncToolbar();
                    }}
                    onTransform={syncToolbar}
                    onTransformEnd={(e) => {
                      const n = e.target;
                      onChange(item._id, {
                        x: n.x(),
                        y: n.y(),
                        scale_x: n.scaleX(),
                        scale_y: n.scaleY(),
                        rotation: n.rotation(),
                      });
                      syncToolbar();
                    }}
                  >
                    <Rect
                      width={item.width}
                      height={item.height}
                      fill={item.color}
                      cornerRadius={6}
                      stroke={isSelected ? "#2563eb" : "#00000022"}
                      strokeWidth={isSelected ? 2 : 1}
                      shadowColor="#000"
                      shadowBlur={isSelected ? 8 : 0}
                      shadowOpacity={0.2}
                    />
                    <Text
                      text={item.name ?? ""}
                      width={item.width}
                      height={item.height}
                      align="center"
                      verticalAlign="middle"
                      fontSize={14}
                      fontStyle="bold"
                      fill="#18181b"
                      listening={false}
                      padding={4}
                    />
                  </Group>
                );
              })}

              <Transformer
                ref={trRef}
                rotateEnabled
                resizeEnabled
                keepRatio={false}
                anchorSize={8}
                borderStroke="#2563eb"
                anchorStroke="#2563eb"
                boundBoxFunc={(oldBox, newBox) =>
                  newBox.width < 5 || newBox.height < 5 ? oldBox : newBox
                }
              />
            </Layer>
          </Stage>

          {/* ZOOM CONTROLS (bawah kiri) */}
          <div className="absolute bottom-4 left-4 z-30 flex items-center gap-1 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 p-1">
            <button
              onClick={() => zoomButton(1 / 1.2)}
              title="Zoom out"
              className="h-7 w-7 flex items-center justify-center rounded-md text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
            >
              <FiMinus size={15} />
            </button>
            <span className="text-[11px] font-mono text-zinc-500 w-10 text-center select-none">
              {zoomPct}%
            </span>
            <button
              onClick={() => zoomButton(1.2)}
              title="Zoom in"
              className="h-7 w-7 flex items-center justify-center rounded-md text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
            >
              <FiPlus size={15} />
            </button>
            <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700 mx-0.5" />
            <button
              onClick={fit}
              title="Fit to screen"
              className="h-7 w-7 flex items-center justify-center rounded-md text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer"
            >
              <FiMaximize size={14} />
            </button>
          </div>

          {/* TOOLBAR MENGAMBANG DI ATAS ITEM (warna/opacity/duplikat/hapus) */}
          {selected && toolbarPos && (
            <div
              className="absolute z-30 flex items-center gap-2.5 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 whitespace-nowrap"
              style={{
                left: toolbarPos.left,
                top: toolbarPos.top,
                transform: "translate(-50%, calc(-100% - 10px))",
              }}
            >
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={selected.color}
                  onChange={(e) =>
                    onChange(selected._id, { color: e.target.value })
                  }
                  className="h-6 w-7 rounded cursor-pointer border border-zinc-200 dark:border-zinc-700 bg-transparent"
                  title="Color"
                />
                <input
                  value={selected.color}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#([0-9a-fA-F]{0,6})$/.test(v))
                      onChange(selected._id, { color: v });
                  }}
                  className="w-[70px] text-xs font-mono border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-1 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 outline-none"
                  placeholder="#3B82F6"
                />
              </div>

              <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" />

              <div className="flex items-center gap-1.5">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={selected.opacity}
                  onChange={(e) =>
                    onChange(selected._id, {
                      opacity: Number(e.target.value),
                    })
                  }
                  className="w-20 accent-blue-600"
                  title="Opacity"
                />
                <span className="text-[11px] font-mono text-zinc-500 w-7">
                  {Math.round(selected.opacity * 100)}%
                </span>
              </div>

              <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" />

              <button
                onClick={onDuplicate}
                title="Duplicate"
                className="h-6 w-6 flex items-center justify-center rounded-md text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 cursor-pointer"
              >
                <FiCopy size={14} />
              </button>
              <button
                onClick={onDelete}
                title="Delete"
                className="h-6 w-6 flex items-center justify-center rounded-md text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
