"use client";

import { BiodataDaum } from "@/types/profile";
import { FaPlus } from "react-icons/fa";
import { GoTrash } from "react-icons/go";

interface DataProps {
  initiateData: BiodataDaum;
  onSetForm: React.Dispatch<React.SetStateAction<BiodataDaum>>;
}

const ExperienceSection = ({ initiateData, onSetForm }: DataProps) => {
  const handleAddItem = () => {
    const newDataUpdate = [
      ...(initiateData.experiences || []),
      {
        start_date: "",
        end_date: "",
        role: "",
        type: "",
        company_name: "",
        description: "",
        list_task: [],
      },
    ];

    onSetForm((prev) => {
      return {
        ...prev,
        experiences: newDataUpdate,
      };
    });
  };

  const handleRemoveItem = (index: number) => {
    const newDataUpdate = initiateData.experiences.filter(
      (item, i) => i !== index,
    );
    onSetForm((prev) => {
      return {
        ...prev,
        experiences: newDataUpdate,
      };
    });
  };

  const handleChangeItem = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const newDataUpdate = [...initiateData.experiences];
    newDataUpdate[index] = {
      ...newDataUpdate[index],
      [e.target.name]: e.target.value,
    };

    onSetForm((prev) => {
      return {
        ...prev,
        experiences: newDataUpdate,
      };
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
        <h3 className="text-xl font-semibold">{`Experience (${initiateData.experiences.length})`}</h3>
        <button
          onClick={handleAddItem}
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
          {initiateData.experiences.length > 0 && (
            <span className="absolute left-0 top-0 w-px bg-blue-600 opacity-60 h-full"></span>
          )}

          <div className="flex flex-col gap-8">
            {initiateData.experiences.map((exp, index) => {
              const isLast = index === initiateData.experiences.length - 1;

              return (
                <div key={index} className="relative pl-6">
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
                    <div className="grid gap-3 w-full">
                      {/* Start/End */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="month"
                          className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                          value={exp.start_date}
                          name="start_date"
                          onChange={(e) => handleChangeItem(index, e)}
                        />
                        <input
                          type="month"
                          className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                          value={exp.end_date}
                          name="end_date"
                          onChange={(e) => handleChangeItem(index, e)}
                        />
                      </div>

                      {/* Company / Role */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          placeholder="Company Name"
                          name="company_name"
                          value={exp.company_name}
                          className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                          onChange={(e) => handleChangeItem(index, e)}
                        />
                        <input
                          placeholder="Role"
                          name="role"
                          value={exp.role}
                          className="p-2 border border-slate-300 outline-none rounded-lg text-sm"
                          onChange={(e) => handleChangeItem(index, e)}
                        />
                      </div>

                      {/* Description */}
                      <textarea
                        rows={3}
                        name="description"
                        value={exp.description}
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
                        onChange={(e) => handleChangeItem(index, e)}
                      />
                    </div>

                    <div
                      className="relative h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center cursor-pointer transition-all"
                      onClick={() => handleRemoveItem(index)}
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

export default ExperienceSection;
