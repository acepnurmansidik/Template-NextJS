"use client";

import { useState } from "react";
import { GoTrash } from "react-icons/go";
import { FaPlus } from "react-icons/fa";

const TestimonialSection = () => {
  const [list, setList] = useState<any[]>([]);

  const addItem = () => {
    setList([...list, { start: "", end: "", role: "", description: "" }]);
  };

  const update = (i: number, field: string, value: string) => {
    const temp = [...list];
    temp[i][field] = value;
    setList(temp);
  };

  // Auto expand textarea logic
  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const removeItem = (index: number) => {
    setList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleThumbnail = (i: number, e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    update(i, "thumbnail", url);
  };

  return (
    <div className="p-6 rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Testimonial</h3>
        <button
          onClick={addItem}
          className="p-3 hover:cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
        >
          <FaPlus />
        </button>
      </div>

      {/* SCROLL DI LUAR */}
      <div
        className="overflow-y-auto pr-2"
        style={{ maxHeight: "calc(87vh - 200px)" }}
      >
        {/* WRAPPER TANPA SCROLL → GARIS TIDAK TERPUTUS */}
        <div className="relative ml-6 pb-4">
          {/* GARIS VERTICAL UTAMA (SELALU PANJANG MENGIKUTI KONTEN) */}
          {list.length > 0 && (
            <span className="absolute left-0 top-0 w-px bg-blue-600 opacity-60 h-full"></span>
          )}

          <div className="flex flex-col gap-8">
            {list.map((item, i) => {
              const isLast = i === list.length - 1;

              return (
                <div key={i} className="relative pl-6">
                  {/* GARIS VERTICAL PER ITEM — FIX FINAL */}
                  {!isLast && (
                    <span className="absolute left-0 top-0 bottom-0 w-px bg-blue-600 opacity-60" />
                  )}

                  {/* GARIS HORIZONTAL */}
                  <span className="absolute left-0 top-4 w-4 h-px bg-blue-600 opacity-60"></span>

                  {/* BULLET */}
                  <span className="absolute left-4 top-3 w-3 h-3 bg-blue-600"></span>

                  {/* CARD */}
                  <div className="p-4 rounded-lg bg-white shadow-sm flex gap-3 w-full">
                    <div className="grid grid-cols-7 gap-2 w-full">
                      {/* Avatar */}
                      <div className="flex flex-col gap-2 col-span-2">
                        <div className="relative w-full max-w-xs">
                          {item.avatar ? (
                            <div className="relative">
                              <img
                                src={item.avatar}
                                alt={`avatar-${i}`}
                                className="w-full h-40 object-cover rounded-lg border"
                              />
                              <label className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded cursor-pointer">
                                Ganti Gambar
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleThumbnail(i, e)}
                                />
                              </label>
                            </div>
                          ) : (
                            <label className="w-full h-40 border hover:bg-gray-300 hover:duration-300 border-slate-300 rounded-lg flex items-center justify-center text-sm text-slate-500 cursor-pointer">
                              <div className="flex flex-col gap-2 items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="35"
                                  height="35"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-upload-icon lucide-upload"
                                >
                                  <path d="M12 3v12" />
                                  <path d="m17 8-5-5-5 5" />
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                </svg>
                                <span>Upload Avatar</span>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleThumbnail(i, e)}
                              />
                            </label>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-3 w-full col-span-5">
                        {/* Fullname & Role */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            placeholder="Fullname"
                            className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                            onChange={(e) =>
                              update(i, "fullname", e.target.value)
                            }
                          />
                          <input
                            placeholder="role"
                            className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                            onChange={(e) => update(i, "role", e.target.value)}
                          />
                        </div>

                        {/* Description */}
                        <textarea
                          rows={3}
                          placeholder="Description"
                          className="p-2 border border-slate-300 outline-none rounded-lg text-sm transition-all duration-300"
                          onFocus={(e) =>
                            autoResize(e.target as HTMLTextAreaElement)
                          }
                          onInput={(e) =>
                            autoResize(e.target as HTMLTextAreaElement)
                          }
                          onBlur={(e) => {
                            const el = e.target as HTMLTextAreaElement;
                            el.style.height = "70px";
                          }}
                          onChange={(e) =>
                            update(i, "description", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div
                      className="relative h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                      onClick={() => removeItem(i)}
                    >
                      <GoTrash
                        fontSize={20}
                        className="text-red-500 font-bold"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
