"use client";

import { motion } from "framer-motion";

const education = [
  {
    title: "S1 Desain Komunikasi Visual",
    place: "Universitas Indonesia",
    year: "2015 - 2019",
    desc: "Fokus pada desain antarmuka dan komunikasi visual digital.",
  },
  {
    title: "SMA IPA",
    place: "SMA Negeri 1 Bandung",
    year: "2012 - 2015",
    desc: "Belajar dasar-dasar ilmu teknologi, desain, dan sains.",
  },
];

export default function EducationSection() {
  return (
    <section id="education" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-end mb-16"
        >
          Education
        </motion.h2>

        {/* GARIS UTAMA SAMPING KANAN */}
        <div className="relative mr-6">
          <div className="absolute right-0 top-0 w-px h-full bg-black"></div>

          {education.map((edu, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="mb-12 mr-6 relative text-right"
            >
              {/* L TERBALIK */}
              <div className="absolute -right-6 top-6 w-6 h-px bg-black"></div>

              {/* CARD */}
              <div className="bg-gray-50 p-6 rounded-xl shadow-sm inline-block">
                <h3 className="font-bold text-xl">{edu.title}</h3>
                <p className="text-sm text-gray-600">{edu.place}</p>
                <p className="text-sm text-gray-400 mb-2">{edu.year}</p>
                <p className="text-gray-600">{edu.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
