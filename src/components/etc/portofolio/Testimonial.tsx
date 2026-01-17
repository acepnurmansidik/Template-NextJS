"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Andi Pratama",
    role: "Software Engineer",
    msg: "Kerja sama yang luar biasa, profesional, dan sangat cepat!",
  },
  {
    name: "Sarah M.",
    role: "Product Manager",
    msg: "Desain UI/UX sangat rapi dan mudah digunakan.",
  },
  {
    name: "Rudi H.",
    role: "CEO Startup",
    msg: "Hasil pekerjaannya selalu memuaskan. Highly recommended!",
  },
];

export default function TestimonialSection() {
  return (
    <section id="testimonials" className="py-28 bg-white overflow-visible">
      <div className="max-w-5xl mx-auto px-6 overflow-visible">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12"
        >
          What they say?
        </motion.h2>

        {/* WRAPPER UTAMA → WAJIB overflow-visible */}
        <div className="relative overflow-visible">
          {/* SCROLL AREA → hanya x yang auto */}
          <div className="flex gap-8 snap-x scrollbar-hide overflow-x-auto overflow-y-visible py-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                /* MOBILE SCALE */
                whileTap={{ scale: 1.1 }}
                /* DESKTOP HOVER */
                whileHover={{ scale: 1.1 }}
                className="min-w-65 snap-center hover:cursor-pointer p-6 bg-gray-50 rounded-xl shadow-sm duration-100 origin-center"
              >
                <p className="text-gray-700 mb-3 italic">“{t.msg}”</p>
                <h4 className="font-bold">{t.name}</h4>
                <p className="text-sm text-gray-500">{t.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
