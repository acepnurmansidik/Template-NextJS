"use client";

import { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";

interface DataProps {
  scale: number;
  onReset: () => void;
}

export default function WorldMap({ scale, onReset }: DataProps) {
  const [data, setData] = useState({ prov: null, city: null });
  const [selected, setSelected] = useState<{
    name: string;
    isCity: boolean;
  } | null>(null);
  const [tooltip, setTooltip] = useState<{
    prov: string;
    city: string | null;
    x: number;
    y: number;
  } | null>(null);

  const [zoomLevel, setZoomLevel] = useState(1);
  const [centerMap, setCenterMap] = useState<[number, number]>([118, -7]);

  useEffect(() => {
    Promise.all([
      fetch("/data/indonesia_lv1.json").then((res) => res.json()),
      fetch("/data/indonesia_lv2.json").then((res) => res.json()),
    ]).then(([prov, city]) => setData({ prov, city }));
  }, []);

  const handleSelect = (geo: any) => {
    const centroid = geoCentroid(geo);
    setCenterMap(centroid);
    setZoomLevel(3);
    setSelected({ name: geo.properties.NAME_1, isCity: false });
  };

  const handleReset = () => {
    setCenterMap([118, -7]);
    setZoomLevel(1);
    setSelected(null);
    onReset();
  };

  if (!data.prov || !data.city)
    return (
      <div className="text-gray-900 dark:text-zinc-50 flex h-full items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="relative w-full h-full bg-white dark:bg-zinc-950 transition-colors duration-300 overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: scale, center: [118, -7] }}
      >
        <ZoomableGroup
          center={centerMap}
          zoom={zoomLevel}
          minZoom={1}
          maxZoom={8}
        >
          <Geographies geography={selected ? data.city : data.prov}>
            {({ geographies }) =>
              geographies.map((geo: any) => {
                const provName = geo.properties.NAME_1;
                const cityName = geo.properties.NAME_2;

                const isSelected =
                  selected &&
                  (selected.isCity
                    ? cityName === selected.name
                    : provName === selected.name);
                const isBlocked = selected && !isSelected;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(e) =>
                      setTooltip({
                        prov: provName,
                        city: cityName || null,
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }
                    onMouseLeave={() => setTooltip(null)}
                    onMouseMove={(e) =>
                      setTooltip({
                        prov: provName,
                        city: cityName || null,
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }
                    onClick={() => !selected && handleSelect(geo)}
                    style={{
                      default: {
                        // Warna diadaptasi ke tema (Gray untuk light, Zinc untuk dark)
                        fill: isSelected
                          ? "#3b82f6"
                          : isBlocked
                            ? typeof window !== "undefined" &&
                              document.documentElement.classList.contains(
                                "dark",
                              )
                              ? "#18181b"
                              : "#f4f4f5"
                            : typeof window !== "undefined" &&
                                document.documentElement.classList.contains(
                                  "dark",
                                )
                              ? "#4b5563"
                              : "#d1d5db",
                        stroke: "#fff",
                        strokeWidth: 0.2 / zoomLevel,
                        outline: "none",
                        pointerEvents: isBlocked ? "none" : "auto",
                      },
                      hover: {
                        fill: isSelected ? "#2563eb" : "#60a5fa",
                        cursor: "pointer",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip dengan nama daerah bertumpuk */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-white/90 dark:bg-black/90 text-gray-900 dark:text-white px-3 py-2 rounded-lg shadow-xl text-sm font-medium border border-gray-200 dark:border-zinc-700 backdrop-blur-sm"
          style={{ top: tooltip.y + 15, left: tooltip.x + 15 }}
        >
          <div
            className={`font-bold pb-1 ${tooltip.city?.length ? "border-b border-gray-300 dark:border-zinc-600 " : ""}`}
          >
            {tooltip.prov}
          </div>
          {tooltip.city && (
            <div className="text-xs text-gray-500 dark:text-zinc-400 pt-1">
              {tooltip.city}
            </div>
          )}
        </div>
      )}

      {selected && (
        <button
          onClick={handleReset}
          className="absolute hover:cursor-pointer top-6 left-6 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white px-6 py-2 rounded-lg font-bold shadow-xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all"
        >
          ← Back
        </button>
      )}
    </div>
  );
}
