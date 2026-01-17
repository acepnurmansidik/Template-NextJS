"use client";

import { motion } from "framer-motion";

const experiences = [
  {
    title: "Senior Web Designer",
    place: "Tokopedia",
    year: "2021 - Sekarang",
    desc: "Mendesain dan memimpin pembuatan UI/UX untuk produk marketplace.",
  },
  {
    title: "UI/UX Designer",
    place: "Traveloka",
    year: "2019 - 2021",
    desc: "Mengerjakan redesign aplikasi dan web Traveloka dengan fokus usability.",
  },
  {
    title: "Intern Web Designer",
    place: "Bluebird Group",
    year: "2018",
    desc: "Membantu tim design dalam membuat variasi tampilan dashboard.",
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-start mb-16"
        >
          Experience
        </motion.h2>

        {/* GARIS UTAMA (menyambung) */}
        <div className="relative ml-6">
          <div className="absolute left-0 top-0 w-px h-full bg-black"></div>

          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="mb-12 ml-6 relative"
            >
              {/* GARIS L */}
              <div className="absolute -left-6 top-6 w-6 h-px bg-black"></div>

              {/* CARD */}
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-xl">{exp.title}</h3>
                <p className="text-sm text-gray-600">{exp.place}</p>
                <p className="text-sm text-gray-400 mb-2">{exp.year}</p>
                <p className="text-gray-600">{exp.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
