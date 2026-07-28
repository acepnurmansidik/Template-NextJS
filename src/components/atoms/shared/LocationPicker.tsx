"use client";

// Peta pemilih lokasi berbasis Leaflet + tile OpenStreetMap.
// Saat titik di peta diklik: marker dipindah, lalu koordinat di-reverse-geocode
// via Nominatim (OSM) sehingga alamat (street/city/state/postal/country) terisi
// otomatis. Semua penamaan field memakai snake_case.
//
// Leaflet diimpor secara dinamis di dalam useEffect agar aman saat SSR
// (Leaflet mengakses `window`). CSS diimpor statis (diproses bundler).
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface PickedAddress {
  street: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
}

interface DataProps {
  value?: LatLng | null;
  onPick: (coords: LatLng, address: PickedAddress) => void;
  onGeocodingChange?: (loading: boolean) => void;
  height?: string;
}

// Marker pin sederhana (divIcon SVG) supaya tidak butuh aset gambar Leaflet.
const PIN_HTML = `
<svg width="30" height="42" viewBox="0 0 24 34" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 22 12 22s12-13.6 12-22C24 5.4 18.6 0 12 0z" fill="#2563eb"/>
  <circle cx="12" cy="12" r="5" fill="#fff"/>
</svg>`;

// Ubah respons Nominatim menjadi field alamat snake_case.
const parseNominatim = (a: Record<string, string> = {}): PickedAddress => {
  const road = a.road ?? a.pedestrian ?? a.footway ?? "";
  const houseNo = a.house_number ?? "";
  const street = [road, houseNo].filter(Boolean).join(" ").trim();
  return {
    street,
    city: a.city ?? a.town ?? a.village ?? a.municipality ?? a.county ?? "",
    state_province: a.state ?? a.region ?? "",
    postal_code: a.postcode ?? "",
    country: a.country ?? "",
  };
};

const DEFAULT_CENTER: LatLng = { lat: -6.2, lng: 106.816666 }; // Jakarta

export default function LocationPicker({
  value,
  onPick,
  onGeocodingChange,
  height = "300px",
}: DataProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  // Simpan callback terbaru tanpa memicu re-init peta.
  const onPickRef = useRef(onPick);
  const onGeoRef = useRef(onGeocodingChange);
  onPickRef.current = onPick;
  onGeoRef.current = onGeocodingChange;

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;

      const start =
        value && Number.isFinite(value.lat) && Number.isFinite(value.lng)
          ? value
          : DEFAULT_CENTER;

      const map = L.map(containerRef.current).setView(
        [start.lat, start.lng],
        value ? 16 : 12,
      );
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }).addTo(map);

      const icon = L.divIcon({
        html: PIN_HTML,
        className: "",
        iconSize: [30, 42],
        iconAnchor: [15, 42],
      });

      const placeMarker = (lat: number, lng: number) => {
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
        }
      };

      if (value) placeMarker(value.lat, value.lng);

      const reverseGeocode = async (lat: number, lng: number) => {
        onGeoRef.current?.(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${lat}&lon=${lng}`,
            { headers: { Accept: "application/json" } },
          );
          const json = await res.json();
          onPickRef.current(
            { lat, lng },
            parseNominatim(json?.address ?? {}),
          );
        } catch {
          // Kalau geocoding gagal, tetap kirim koordinat dengan alamat kosong.
          onPickRef.current(
            { lat, lng },
            {
              street: "",
              city: "",
              state_province: "",
              postal_code: "",
              country: "",
            },
          );
        } finally {
          onGeoRef.current?.(false);
        }
      };

      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        const { lat, lng } = e.latlng;
        placeMarker(lat, lng);
        reverseGeocode(lat, lng);
      });

      // Full-screen modal: pastikan ukuran peta benar setelah container tampil.
      setTimeout(() => map.invalidateSize(), 200);
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Pindahkan view & marker bila `value` di-set dari luar (mis. reset/edit).
  useEffect(() => {
    (async () => {
      if (!mapRef.current || !value) return;
      const L = (await import("leaflet")).default;
      mapRef.current.setView([value.lat, value.lng], 16);
      if (markerRef.current) {
        markerRef.current.setLatLng([value.lat, value.lng]);
      } else {
        const icon = L.divIcon({
          html: PIN_HTML,
          className: "",
          iconSize: [30, 42],
          iconAnchor: [15, 42],
        });
        markerRef.current = L.marker([value.lat, value.lng], { icon }).addTo(
          mapRef.current,
        );
      }
    })();
  }, [value]);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="w-full rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 z-0"
    />
  );
}
