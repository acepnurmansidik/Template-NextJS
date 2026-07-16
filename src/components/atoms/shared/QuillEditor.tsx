"use client";

import { useEffect, useRef } from "react";
import type QuillType from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange?: (html: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

// Toolbar default untuk rich-text message. Saat readOnly toolbar disembunyikan.
const TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["blockquote", "link"],
  ["clean"],
];

// Quill dianggap "kosong" ketika hanya menyisakan paragraf kosong bawaannya.
const isEmptyHtml = (html: string) => html === "<p><br></p>" || html === "";

export default function QuillEditor({
  value,
  onChange,
  readOnly = false,
  placeholder,
}: QuillEditorProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<QuillType | null>(null);
  // Simpan callback & value terbaru di ref agar init (yang hanya jalan sekali &
  // async) selalu memakai nilai terkini, bukan hasil closure yang basi.
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  onChangeRef.current = onChange;
  valueRef.current = value;

  // ---- INIT (sekali) ----
  useEffect(() => {
    let cancelled = false;
    const host = hostRef.current;

    (async () => {
      // Import dinamis: Quill menyentuh `document`, jadi jangan dievaluasi saat SSR.
      const Quill = (await import("quill")).default;
      if (cancelled || !host || quillRef.current) return;

      const editorEl = document.createElement("div");
      host.appendChild(editorEl);

      const quill = new Quill(editorEl, {
        theme: "snow",
        readOnly,
        placeholder,
        modules: { toolbar: readOnly ? false : TOOLBAR },
      });
      quillRef.current = quill;

      if (valueRef.current) {
        quill.clipboard.dangerouslyPasteHTML(valueRef.current);
      }

      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        onChangeRef.current?.(isEmptyHtml(html) ? "" : html);
      });
    })();

    return () => {
      cancelled = true;
      quillRef.current = null;
      if (host) host.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- SINKRONISASI value dari luar (mis. saat initialData termuat) ----
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;
    const current = quill.root.innerHTML;
    const normalizedCurrent = isEmptyHtml(current) ? "" : current;
    // Hanya paste ulang bila benar-benar berbeda → mencegah loop & lompat kursor
    // saat user mengetik (value == innerHTML pada kondisi normal).
    if ((value || "") !== normalizedCurrent) {
      quill.clipboard.dangerouslyPasteHTML(value || "");
    }
  }, [value]);

  // ---- Toggle enable/disable ----
  useEffect(() => {
    quillRef.current?.enable(!readOnly);
  }, [readOnly]);

  return (
    <div className="quill-wrapper">
      <div ref={hostRef} />
      {/* Penyesuaian tampilan + dark-mode untuk theme "snow" bawaan Quill. */}
      <style jsx global>{`
        .quill-wrapper .ql-toolbar.ql-snow,
        .quill-wrapper .ql-container.ql-snow {
          border-color: rgb(228 228 231);
        }
        .quill-wrapper .ql-toolbar.ql-snow {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .quill-wrapper .ql-container.ql-snow {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          min-height: 140px;
          font-size: 0.875rem;
        }
        .dark .quill-wrapper .ql-toolbar.ql-snow,
        .dark .quill-wrapper .ql-container.ql-snow {
          border-color: rgb(63 63 70);
        }
        .dark .quill-wrapper .ql-container.ql-snow {
          background-color: rgb(9 9 11);
          color: rgb(244 244 245);
        }
        .dark .quill-wrapper .ql-editor.ql-blank::before {
          color: rgb(113 113 122);
        }
        .dark .quill-wrapper .ql-snow .ql-stroke {
          stroke: rgb(161 161 170);
        }
        .dark .quill-wrapper .ql-snow .ql-fill {
          fill: rgb(161 161 170);
        }
        .dark .quill-wrapper .ql-snow .ql-picker {
          color: rgb(161 161 170);
        }
      `}</style>
    </div>
  );
}
