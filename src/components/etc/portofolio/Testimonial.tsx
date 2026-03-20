"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Andi Pratama",
    role: "Software Engineer",
    msg: "Kerja sama yang luar biasa, profesional, dan sangat cepat! Kode yang ditulis sangat terstruktur.",
  },
  {
    name: "Sarah M.",
    role: "Product Manager",
    msg: "Desain UI/UX sangat rapi dan mudah digunakan. Sangat komunikatif dalam menyelesaikan masalah sistem.",
  },
  {
    name: "Rudi H.",
    role: "CEO Startup",
    msg: "Hasil pekerjaannya selalu memuaskan. Infrastruktur backend yang dibangun sangat stabil. Highly recommended!",
  },
];

export default function TestimonialSection() {
  return (
    <section
      id="testimonials"
      className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-16"
        >
          Client & Colleague Feedback
        </motion.h2>

        <div className="flex gap-6 overflow-x-auto pb-8 snap-x scrollbar-hide">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="min-w-75 md:min-w-87.5 snap-center p-8 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm relative transition-colors"
            >
              {/* Quote Icon Background */}
              <span className="text-6xl text-gray-200 dark:text-slate-700 absolute top-4 right-6 font-serif select-none transition-colors">
                "
              </span>

              <p className="text-gray-600 dark:text-gray-300 mb-8 relative z-10 leading-relaxed italic">
                "{t.msg}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold text-sm transition-colors">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                    {t.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
