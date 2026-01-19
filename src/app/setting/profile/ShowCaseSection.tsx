"use client";

import { BiodataDaum } from "@/types/profile";
import { FaPlus } from "react-icons/fa";
import { GoTrash } from "react-icons/go";
import Select from "react-select";

const techOptions = [
  { value: "React", label: "React", name: "React", slug: "react" },
  { value: "Next.js", label: "Next.js", name: "NextJS", slug: "nextjs" },
  { value: "Node.js", label: "Node.js", name: "NodeJS", slug: "nodejs" },
  { value: "Express", label: "Express", name: "ExpressJS", slug: "expressjs" },
  { value: "MongoDB", label: "MongoDB", name: "MongoDB", slug: "mongodb" },
  {
    value: "TailwindCSS",
    label: "TailwindCSS",
    name: "TailwindCSS",
    slug: "tailwindcss",
  },
];

interface DataProps {
  initiateData: BiodataDaum;
  onSetForm: React.Dispatch<React.SetStateAction<BiodataDaum>>;
}

const ShowCaseSection = ({ initiateData, onSetForm }: DataProps) => {
  const handleAddItem = () => {
    const newDataUpdate = [
      ...(initiateData.showcase || []),
      {
        title: "",
        thumbnail: "",
        description: "",
        tech_stacks: [],
        contributors: [],
        repositories: [],
        platforms: [],
      },
    ];

    onSetForm((prev) => {
      return {
        ...prev,
        showcase: newDataUpdate,
      };
    });
  };

  const handleRemoveItem = (index: number) => {
    const newDataUpdate = initiateData.showcase.filter(
      (item, i) => i !== index,
    );
    onSetForm((prev) => {
      return {
        ...prev,
        showcase: newDataUpdate,
      };
    });
  };

  const handleChangeItem = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newDataUpdate = [...initiateData.showcase];
    newDataUpdate[index] = {
      ...newDataUpdate[index],
      [e.target.name]: e.target.value,
    };

    onSetForm((prev) => {
      return {
        ...prev,
        showcase: newDataUpdate,
      };
    });
  };

  const handleThumbnail = (i: number, e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    // update(i, "thumbnail", url);
  };

  const handleChangeSubItem = (index: number, field: string, value: any) => {
    onSetForm((prev) => {
      const updated = [...prev.showcase];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return { ...prev, showcase: updated };
    });
  };

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  return (
    <div className="p-6 rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{`Showcase (${initiateData.showcase.length})`}</h3>
        <button
          onClick={handleAddItem}
          className="p-3 hover:cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
        >
          <FaPlus />
        </button>
      </div>

      {/* SCROLL */}
      <div
        className="overflow-y-auto pr-2"
        style={{ maxHeight: "calc(87vh - 200px)" }}
      >
        {/* WRAPPER GARIS UTAMA */}
        <div className="relative ml-6 pb-4">
          {initiateData.showcase.length > 0 && (
            <span className="absolute left-0 top-0 w-px bg-blue-600 opacity-60 h-full"></span>
          )}

          <div className="flex flex-col gap-8">
            {initiateData.showcase.map((item, i) => {
              const isLast = i === initiateData.showcase.length - 1;

              return (
                <div key={i} className="relative pl-6">
                  {/* GARIS VERTICAL PER ITEM */}
                  {!isLast && (
                    <span className="absolute left-0 top-0 bottom-0 w-px bg-blue-600 opacity-60" />
                  )}

                  {/* GARIS HORIZONTAL */}
                  <span className="absolute left-0 top-4 w-4 h-px bg-blue-600 opacity-60"></span>

                  {/* BULLET */}
                  <span className="absolute left-4 top-3 w-3 h-3 bg-blue-600"></span>

                  {/* CARD */}
                  <div className="p-4 rounded-lg bg-white shadow-sm flex gap-3 w-full">
                    <div className="grid gap-3 w-full">
                      {/* Title */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Title</label>
                        <input
                          placeholder="Title"
                          className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                          name="title"
                          onChange={(e) => handleChangeItem(i, e)}
                        />
                      </div>

                      {/* Tech Stack */}
                      <Select
                        isMulti
                        options={techOptions}
                        className="text-sm"
                        value={item.tech_stacks.map((t) => ({
                          value: t.name,
                          label: t.name,
                          name: t.name,
                          slug: t.slug,
                        }))}
                        onChange={(selected) => {
                          const mapped = selected.map((s: any) => ({
                            name: s.value,
                            slug:
                              s.slug ||
                              s.value.toLowerCase().replace(/\W+/g, ""),
                          }));

                          handleChangeSubItem(i, "tech_stacks", mapped);
                        }}
                      />

                      {/* Thumbnail + Repo */}
                      <div className="grid grid-cols-3 gap-3">
                        {/* Thumbnail */}
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium">
                            Thumbnail
                          </label>

                          <div className="relative w-full max-w-xs">
                            {item.thumbnail ? (
                              <div className="relative">
                                <img
                                  src={item.thumbnail}
                                  alt="thumbnail"
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
                                  <span>Upload Thumbnail</span>
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

                        {/* Repo */}
                        <div className="flex flex-col gap-2 col-span-2">
                          <label className="text-sm font-medium">
                            Repository
                          </label>
                          <div className="grid grid-cols-2 gap-2 p-2 border border-slate-200 rounded-lg">
                            <input
                              placeholder="Repo Backend"
                              className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                            />
                            <input
                              placeholder="Repo Frontend"
                              className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                            />
                            <input
                              placeholder="Repo Mobile"
                              className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* PLATFORM */}
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">
                            {`Platform (${item.platforms?.length || 0})`}
                          </label>

                          <button
                            onClick={() => {
                              onSetForm((prev) => {
                                const updated = structuredClone(prev);
                                updated.showcase[i].platforms.push({
                                  name: "",
                                  slug: "",
                                  reference_link: "",
                                });

                                return updated;
                              });
                            }}
                            className="px-3 py-1 bg-slate-200 rounded text-xs hover:bg-slate-300"
                          >
                            + Add Platform
                          </button>
                        </div>

                        <div className="border border-slate-200 rounded-lg p-3 flex flex-col gap-2">
                          {item.platforms?.map((p, pIndex) => (
                            <div
                              key={pIndex}
                              className="flex gap-3 w-full items-start border border-slate-200 rounded-lg p-2"
                            >
                              <div className="p-3 w-full grid gap-3 relative">
                                {/* Platform Name */}
                                <input
                                  placeholder="Platform Name"
                                  className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                                  value={p.name}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    onSetForm((prev) => {
                                      const updated = structuredClone(prev);
                                      updated.showcase[i].platforms[
                                        pIndex
                                      ].name = value;
                                      updated.showcase[i].platforms[
                                        pIndex
                                      ].slug = value
                                        .toLowerCase()
                                        .replace(/\W+/g, "");
                                      return updated;
                                    });
                                  }}
                                />

                                {/* Reference Link */}
                                <input
                                  placeholder="Reference Link"
                                  className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                                  value={p.reference_link}
                                  onChange={(e) => {
                                    onSetForm((prev) => {
                                      const updated = [...prev.showcase];
                                      updated[i].platforms[
                                        pIndex
                                      ].reference_link = e.target.value;
                                      return { ...prev, showcase: updated };
                                    });
                                  }}
                                />
                              </div>

                              {/* Remove Button */}
                              <div
                                className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center cursor-pointer"
                                onClick={() => {
                                  onSetForm((prev) => {
                                    const updated = structuredClone(prev);
                                    updated.showcase[i].platforms =
                                      updated.showcase[i].platforms.filter(
                                        (_, idx) => idx !== pIndex,
                                      );

                                    return updated;
                                  });
                                }}
                              >
                                <GoTrash
                                  fontSize={20}
                                  className="text-red-500 font-bold"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CONTRIBUTORS */}
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">
                            Contributors ({item.contributors?.length || 0})
                          </label>

                          <button
                            onClick={() => {
                              onSetForm((prev) => {
                                const updated = structuredClone(prev);
                                updated.showcase[i].contributors.push({
                                  name: "",
                                  role: "",
                                  github_link: "",
                                });

                                return updated;
                              });
                            }}
                            className="px-3 py-1 bg-slate-200 rounded text-xs hover:bg-slate-300"
                          >
                            + Add Contributor
                          </button>
                        </div>

                        <div className="border border-slate-200 rounded-lg p-3 flex flex-col gap-2">
                          {item.contributors?.map((c, cIndex) => (
                            <div
                              key={cIndex}
                              className="flex gap-3 w-full items-start border border-slate-200 rounded-lg p-2"
                            >
                              <div className="grid w-full gap-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {/* Contributor Name */}
                                  <input
                                    placeholder="Contributor Name"
                                    className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                                    value={c.name}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      onSetForm((prev) => {
                                        const updated = structuredClone(prev);
                                        updated.showcase[i].contributors[
                                          cIndex
                                        ].name = value;
                                        return updated;
                                      });
                                    }}
                                  />

                                  {/* Role */}
                                  <input
                                    placeholder="Role"
                                    className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                                    value={c.role}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      onSetForm((prev) => {
                                        const updated = structuredClone(prev);
                                        updated.showcase[i].contributors[
                                          cIndex
                                        ].name = value;
                                        return updated;
                                      });
                                    }}
                                  />
                                </div>

                                {/* Github Link */}
                                <input
                                  placeholder="Github Link"
                                  className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                                  value={c.github_link}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    onSetForm((prev) => {
                                      const updated = structuredClone(prev);
                                      updated.showcase[i].contributors[
                                        cIndex
                                      ].name = value;
                                      return updated;
                                    });
                                  }}
                                />
                              </div>

                              {/* Remove Button */}
                              <div
                                className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center cursor-pointer"
                                onClick={() => {
                                  onSetForm((prev) => {
                                    const updated = structuredClone(prev);
                                    updated.showcase[i].contributors =
                                      updated.showcase[i].contributors.filter(
                                        (_, idx) => idx !== cIndex,
                                      );

                                    return updated;
                                  });
                                }}
                              >
                                <GoTrash
                                  fontSize={20}
                                  className="text-red-500 font-bold"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Description */}
                      <textarea
                        rows={2}
                        placeholder="Description"
                        className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                        onFocus={(e) =>
                          autoResize(e.target as HTMLTextAreaElement)
                        }
                        onInput={(e) =>
                          autoResize(e.target as HTMLTextAreaElement)
                        }
                        onBlur={(e) => (e.target.style.height = "60px")}
                        name="description"
                        onChange={(e) => handleChangeItem(i, e)}
                      />
                    </div>

                    {/* Remove showcase button */}
                    <div
                      className="relative h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center cursor-pointer"
                      onClick={() => handleRemoveItem(i)}
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

export default ShowCaseSection;
