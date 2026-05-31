"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";

// --- DATA DUMMY (Sesuai permintaan Anda) ---
const regionData = [
  { Province: "KalimantanBarat", City: "Pontianak", Value: 3324 },
  { Province: "KalimantanTengah", City: "MurungRaya", Value: 200 },
  { Province: "KalimantanTengah", City: "Seruyan", Value: 4200 },
  { Province: "KalimantanTengah", City: "PalangkaRaya", Value: 78000 },
  { Province: "KalimantanTengah", City: "Katingan", Value: 1078000 },
  { Province: "Papua", City: "Jayawijaya", Value: 20780 },
  { Province: "Papua", City: "Puncak", Value: 42070 },
  { Province: "Papua", City: "Mimika", Value: 7420780 },
  { Province: "KalimantanSelatan", City: "Banjarmasin", Value: 700000 },
  { Province: "KalimantanTimur", City: "Samarinda", Value: 850000 },
  { Province: "KalimantanTimur", City: "Balikpapan", Value: 730000000 },
  { Province: "KalimantanUtara", City: "Tarakan", Value: 250000 },
  { Province: "SulawesiUtara", City: "Manado", Value: 480000 },
  { Province: "SulawesiSelatan", City: "Makassar", Value: 1500000 },
  { Province: "SulawesiTengah", City: "Palu", Value: 380000 },
  { Province: "SulawesiTenggara", City: "Kendari", Value: 350000 },
  { Province: "Gorontalo", City: "Gorontalo", Value: 200000 },
  { Province: "SulawesiBarat", City: "Majene", Value: 180000 },
];

const colorPalettes = [
  {
    name: "Royal Blue",
    hex_code: "#2563EB",
    rgb_code: "37, 99, 235",
  },
  {
    name: "Sunset Orange",
    hex_code: "#EA580C",
    rgb_code: "234, 88, 12",
  },
  {
    name: "Deep Violet",
    hex_code: "#7C3AED",
    rgb_code: "124, 58, 237",
  },
  {
    name: "Emerald Green",
    hex_code: "#166534",
    rgb_code: "22, 101, 52",
  },
  {
    name: "Slate Teal",
    hex_code: "#0D9488",
    rgb_code: "13, 148, 136",
  },
  {
    name: "Ruby Red",
    hex_code: "#E11D48",
    rgb_code: "225, 29, 72",
  },
];

const WorldMap = forwardRef(({ scale, onScaleMap, onZoomChange }: any, ref) => {
  const [showPicker, setShowPicker] = useState(false);
  const [activeColor, setActiveColor] = useState(colorPalettes[3]);
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
  const [position, setPosition] = useState({
    center: [118, -7] as [number, number],
    zoom: 1,
  });

  const getFillColor = (name: string, isCityLevel: boolean) => {
    let value = 0;
    if (isCityLevel) {
      const item = regionData.find((d) => d.City === name);
      value = item ? item.Value : 0;
    } else {
      value = regionData
        .filter((d) => d.Province === name)
        .reduce((sum, curr) => sum + curr.Value, 0);
    }

    const theme = localStorage.getItem("theme");
    if (value === 0) return theme == "dark" ? "#808080" : "#adadad";

    // Logika opacity (Menggunakan skala logaritma untuk data dengan rentang jauh seperti 2 ke 730 juta)
    const maxVal = isCityLevel ? 1000000 : 2000000;
    const opacity = Math.min(
      Math.max(Math.log10(value + 1) / Math.log10(maxVal + 1), 0.2),
      1.0,
    );
    return `rgba(${colorPalettes.find((item) => item.name === activeColor.name)?.rgb_code}, ${opacity})`;
  };

  const handleReset = () => {
    setPosition({ center: [118, -7], zoom: 1 });
    setSelected(null);
    onScaleMap();
    onZoomChange(1);
  };

  useImperativeHandle(ref, () => ({
    resetMap: handleReset,
    setZoom: (val: number) => {
      requestAnimationFrame(() =>
        setPosition((prev) => ({ ...prev, zoom: val })),
      );
    },
  }));

  useEffect(() => {
    Promise.all([
      fetch("/data/indonesia_lv1.json").then((res) => res.json()),
      fetch("/data/indonesia_lv2.json").then((res) => res.json()),
    ]).then(([prov, city]) => setData({ prov, city }));
  }, []);

  const handleSelect = (geo: any) => {
    const centroid = geoCentroid(geo);
    setPosition({ center: centroid, zoom: 3 });
    setSelected({ name: geo.properties.NAME_1, isCity: false });
    onZoomChange(3);
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
          center={position.center}
          zoom={position.zoom}
          onMoveEnd={(t) => {
            onZoomChange(t.zoom);
            setPosition({ center: t.coordinates, zoom: t.zoom });
          }}
        >
          <Geographies geography={selected ? data.city : data.prov}>
            {({ geographies }) =>
              geographies.map((geo: any) => {
                const provName = geo.properties.NAME_1;
                const cityName = geo.properties.NAME_2;
                const currentName = selected ? cityName : provName;

                const isSelectedProv = selected && provName === selected.name;
                const isBlocked = selected && !isSelectedProv;

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
                    onClick={() => !selected && handleSelect(geo)}
                    style={{
                      default: {
                        fill: isBlocked
                          ? document.documentElement.classList.contains("dark")
                            ? "#18181b"
                            : "#f4f4f5"
                          : getFillColor(currentName, !!selected),
                        stroke: "#eee",
                        strokeWidth: 0.2 / (position.zoom || 1),
                        outline: "none",
                        pointerEvents: isBlocked ? "none" : "auto",
                      },
                      hover: { fill: "#60a5fa", cursor: "pointer" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-zinc-800/90 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs text-gray-900 dark:text-zinc-200 shadow-xl w-60">
        <div className="flex justify-between items-center mb-3">
          <div className="font-bold">Populasi Penduduk</div>

          {/* Container untuk Tombol Toggle dan Tooltip Picker */}
          <div className="relative">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-700 shadow-md transition-transform hover:scale-110"
              style={{ backgroundColor: activeColor.hex_code }}
              title="Pilih Warna"
            />

            {/* Tooltip Picker yang Melayang */}
            {showPicker && (
              <div className="absolute right-0 bottom-8 mb-2 p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-2xl flex gap-2 z-50">
                {colorPalettes.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setActiveColor(c);
                      setShowPicker(false);
                    }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                      activeColor.name === c.name
                        ? `border-black dark:border-white ring-0 ring-offset-1`
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: c.hex_code }}
                    title={c.name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span>Sedikit</span>
          <div
            className="w-full h-3 rounded"
            style={{
              background: `linear-gradient(to right, #b5b5b5, ${activeColor.hex_code})`,
            }}
          ></div>
          <span>Padat</span>
        </div>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-white/90 dark:bg-black/90 text-gray-900 dark:text-white px-3 py-2 rounded-lg shadow-xl text-sm font-medium border border-gray-200 dark:border-zinc-700 backdrop-blur-sm"
          style={{ top: tooltip.y + 15, left: tooltip.x + 15 }}
        >
          <div className="font-bold pb-1 border-b border-gray-300 dark:border-zinc-600">
            {tooltip.prov}
          </div>

          {tooltip.city && (
            <div className="text-xs text-gray-500 dark:text-zinc-400 pt-1">
              {tooltip.city}
            </div>
          )}

          <div className="text-xs text-blue-500 font-bold mt-1">
            Populasi:{" "}
            {selected
              ? // Jika sudah di-select, cari nilai spesifik kota tersebut
                regionData
                  .find((d) => d.City === String(tooltip.city || ""))
                  ?.Value.toLocaleString() || "0"
              : // Jika belum di-select (hanya hover), jumlahkan semua kota dalam provinsi itu
                regionData
                  .filter((d) => d.Province === tooltip.prov)
                  .reduce((sum, curr) => sum + curr.Value, 0)
                  .toLocaleString()}
          </div>
        </div>
      )}

      {selected && (
        <button
          onClick={handleReset}
          className="absolute top-6 left-6 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white px-6 py-2 rounded-lg font-bold shadow-xl hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all"
        >
          ← Back
        </button>
      )}
    </div>
  );
});

WorldMap.displayName = "WorldMap";
export default WorldMap;
