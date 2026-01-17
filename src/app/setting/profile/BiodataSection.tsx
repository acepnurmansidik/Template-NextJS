"use client";

import { useState } from "react";
import { GoTrash } from "react-icons/go";

const BiodataSection = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [biodata, setBiodata] = useState({
    full_name: "",
    description: "",
    email: "",
    phone: "",
  });

  const [socialMedias, setSocialMedias] = useState<
    { name: string; slug: string; link: string }[]
  >([]);

  const handleUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPhoto(url);
  };

  const autoSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  return (
    <div className="rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Biodata</h3>

      <div
        className="overflow-y-auto pr-2"
        style={{ maxHeight: "calc(90vh - 200px)" }}
      >
        <div className="grid grid-cols-5 bg-white p-5 rounded-lg shadow-xs md:flex-row gap-6 mb-7">
          {/* Foto */}
          <div className="flex flex-col items-center col-span-1">
            <div className="relative w-36 h-36 rounded-md bg-gray-200 overflow-hidden shadow-md group">
              {/* Preview / Placeholder */}
              {photo ? (
                <img
                  src={photo}
                  className="w-full h-full object-cover"
                  alt="profile"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Photo
                </div>
              )}

              {/* Hover Overlay Upload */}
              <label className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm transition-all cursor-pointer">
                Upload Photo
                <input type="file" className="hidden" onChange={handleUpload} />
              </label>
            </div>
          </div>

          {/* Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 col-span-4">
            {/* Full Name */}
            <div>
              <label className="text-sm font-semibold">Full Name</label>
              <input
                className="w-full mt-1 p-2 border border-slate-300 outline-none rounded-lg text-sm"
                placeholder="John Doe"
                onChange={(e) =>
                  setBiodata({ ...biodata, full_name: e.target.value })
                }
              />
            </div>
            {/* Email */}
            <div>
              <label className="text-sm font-semibold">Email</label>
              <input
                type="email"
                className="w-full mt-1 p-2 border border-slate-300 outline-none rounded-lg text-sm"
                placeholder="email@mail.com"
                onChange={(e) =>
                  setBiodata({ ...biodata, email: e.target.value })
                }
              />
            </div>
            {/* Phone */}
            <div>
              <label className="text-sm font-semibold">Phone Number</label>
              <input
                className="w-full mt-1 p-2 border border-slate-300 outline-none rounded-lg text-sm"
                placeholder="+62..."
                onChange={(e) =>
                  setBiodata({ ...biodata, phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="col-span-5">
            <label className="text-sm font-semibold">Description</label>
            <textarea
              className="w-full mt-1 p-2 border border-slate-300 outline-none rounded-lg text-sm"
              rows={4}
              placeholder="Short description about yourself"
              onInput={(e) => autoResize(e.target as HTMLTextAreaElement)}
              onChange={(e) =>
                setBiodata({ ...biodata, description: e.target.value })
              }
            ></textarea>
          </div>
        </div>

        {/* ====================== SOCIAL MEDIA ====================== */}
        <div className="">
          <div className="flex justify-between mb-2">
            <h3 className="text-md font-semibold mb-4">Social Media</h3>

            {/* ADD BUTTON */}
            <button
              onClick={() =>
                setSocialMedias([
                  ...socialMedias,
                  { name: "", slug: "", link: "" },
                ])
              }
              className="px-3 py-1 bg-slate-200 rounded-md hover:cursor-pointer text-xs hover:bg-slate-300 w-fit"
            >
              + Add Social Media
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {socialMedias.map((soc, index) => (
              <div
                key={index}
                className="p-3 shadow-xs bg-white rounded-lg flex gap-3 relative"
              >
                <div className="grid grid-cols-1 gap-2 w-full">
                  {/* Name */}
                  <input
                    placeholder="Social Media Name (e.g. Instagram)"
                    className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                    value={soc.name}
                    onChange={(e) => {
                      const copy = [...socialMedias];
                      copy[index].name = e.target.value;
                      copy[index].slug = autoSlug(e.target.value);
                      setSocialMedias(copy);
                    }}
                  />

                  {/* Slug (HIDDEN) */}
                  <input type="hidden" value={soc.slug} readOnly />

                  {/* Link */}
                  <input
                    placeholder="URL (e.g. https://instagram.com/username)"
                    className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                    value={soc.link}
                    onChange={(e) => {
                      const copy = [...socialMedias];
                      copy[index].link = e.target.value;
                      setSocialMedias(copy);
                    }}
                  />
                </div>

                {/* REMOVE BUTTON */}
                <button
                  className="relative h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center cursor-pointer transition-all text-red-500"
                  onClick={() =>
                    setSocialMedias(socialMedias.filter((_, i) => i !== index))
                  }
                >
                  <GoTrash size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiodataSection;
