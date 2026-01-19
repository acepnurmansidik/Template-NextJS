"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import { useEffect, useRef, useState } from "react";
import BiodataSection from "./BiodataSection";
import SkillSection from "./SkillSection";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import ShowCaseSection from "./ShowCaseSection";
import TestimonialSection from "./TestimonialSection";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BiodataDaum } from "@/types/profile";

const defaultValue = {
  full_name: "",
  avatar: "",
  description: "",
  tagline: "",
  email: "",
  phone: "",
  social_media: [],
  experiences: [],
  educations: [],
  skills: [],
  showcase: [],
  testimonials: [],
};

const Page = () => {
  const [form, setForm] = useState<BiodataDaum>(defaultValue);
  const [selectedMenu, setSelectedMenu] = useState<string>("biodata");
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const menus = [
    { key: "biodata", label: "🥳 Biodata" },
    { key: "skill", label: "🎁 Skill" },
    { key: "experience", label: `⚙️ Experience (${form.experiences.length})` },
    { key: "education", label: `🎓 Education (${form.educations.length})` },
    { key: "showcase", label: `🌟 Show Case (${form.showcase.length})` },
    { key: "contact", label: "📞 Contact" },
    {
      key: "testimonial",
      label: `🗣️ Testimonial (${form.testimonials.length})`,
    },
  ];

  /* ======== HANDLE VISIBILITY OF SCROLL BUTTONS ======== */
  const updateArrowVisibility = () => {
    if (!scrollRef.current) return;

    const el = scrollRef.current;

    setShowLeft(el.scrollLeft > 0);
    setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  };

  useEffect(() => {
    updateArrowVisibility();
  }, []);

  /* ======== SCROLL BY ONE ITEM ======== */
  const scrollByOneItem = (dir: "left" | "right") => {
    if (!scrollRef.current) return;

    const el = scrollRef.current;
    const items = el.querySelectorAll(".menu-item");

    if (items.length === 0) return;

    // ambil ukuran item pertama
    const itemWidth = (items[0] as HTMLElement).offsetWidth + 12; // + gap

    const amount = dir === "left" ? -itemWidth : itemWidth;

    el.scrollBy({ left: amount, behavior: "smooth" });

    setTimeout(updateArrowVisibility, 300);
  };

  return (
    <CMSLayout>
      <div className="w-full px-6">
        <h5 className="text-3xl font-bold mb-7">Profile</h5>

        {/* MENU TABS */}
        <div className="relative flex justify-between items-center mb-5 py-1">
          <div className="relative flex items-center">
            {/* LEFT BUTTON */}
            {showLeft && (
              <div
                className="h-6 w-6 flex items-center justify-center rounded-full bg-white shadow-sm hover:cursor-pointer absolute left-0 z-10"
                onClick={() => scrollByOneItem("left")}
              >
                <FaChevronLeft />
              </div>
            )}

            {/* SCROLL AREA */}
            <div
              id="menu-scroll"
              ref={scrollRef}
              onScroll={updateArrowVisibility}
              className="flex gap-3 items-center scrollbar-hide overflow-x-auto px-2"
              style={{ maxWidth: "calc(70vw - 150px)" }}
            >
              {menus.map((m) => (
                <div
                  key={m.key}
                  onClick={() => setSelectedMenu(m.key)}
                  className={`menu-item px-4 py-2 rounded-lg hover:cursor-pointer duration-300 shadow-xs text-sm bg-white whitespace-nowrap ${
                    selectedMenu === m.key ? "font-bold bg-gray-100" : ""
                  }`}
                >
                  {m.label}
                </div>
              ))}
            </div>

            {/* RIGHT BUTTON */}
            {showRight && (
              <div
                className="h-6 w-6 flex items-center justify-center rounded-full bg-white shadow-sm hover:cursor-pointer absolute right-0 z-10"
                onClick={() => scrollByOneItem("right")}
              >
                <FaChevronRight />
              </div>
            )}
          </div>

          <div className="flex gap-3 items-center">
            <button className="px-4 py-2 bg-blue-600 font-bold rounded-lg hover:cursor-pointer duration-300 shadow-xs text-sm text-white whitespace-nowrap">
              Update
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mt-4">
          {selectedMenu === "biodata" && (
            <BiodataSection initiateData={form} onSetForm={setForm} />
          )}
          {selectedMenu === "skill" && (
            <SkillSection initiateData={form} onSetForm={setForm} />
          )}
          {selectedMenu === "experience" && (
            <ExperienceSection initiateData={form} onSetForm={setForm} />
          )}
          {selectedMenu === "education" && (
            <EducationSection initiateData={form} onSetForm={setForm} />
          )}
          {selectedMenu === "showcase" && (
            <ShowCaseSection initiateData={form} onSetForm={setForm} />
          )}
          {selectedMenu === "contact" && (
            <div className="p-5 bg-white rounded-lg shadow-xs">
              Contact Content
            </div>
          )}
          {selectedMenu === "testimonial" && (
            <TestimonialSection initiateData={form} onSetForm={setForm} />
          )}
        </div>
      </div>
    </CMSLayout>
  );
};

export default Page;
