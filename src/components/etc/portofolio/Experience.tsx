"use client";

import { ExperiencesDaum } from "@/types/profile";
import { motion } from "framer-motion";

interface DataProps {
  initiateData: ExperiencesDaum[] | [];
}

export default function ExperienceSection({ initiateData }: DataProps) {
  return (
    <section
      id="experience"
      className="py-24 bg-gray-50 dark:bg-slate-950 transition-colors duration-300"
    >
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-16 text-center"
        >
          Professional Experience
        </motion.h2>

        <div className="relative border-l border-gray-200 dark:border-slate-800 ml-3 md:ml-6">
          {initiateData.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="mb-12 pl-8 md:pl-12 relative group"
            >
              {/* Dot Indicator */}
              <div className="absolute w-4 h-4 bg-white dark:bg-slate-900 border-4 border-black dark:border-white rounded-full -left-2.25 top-1.5 group-hover:bg-black dark:group-hover:bg-white transition-colors duration-300"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                  {exp.role}
                </h3>
                <span className="text-xs font-medium px-3 py-1 bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full w-fit transition-colors">
                  {exp.start_date} - {exp.end_date}
                </span>
              </div>

              <h4 className="text-md font-medium text-blue-600 dark:text-blue-400 mb-4">
                {exp.company_name}{" "}
                <span className="text-gray-400 dark:text-gray-500 font-normal">
                  ({exp.type})
                </span>
              </h4>

              <ul className="space-y-2">
                {exp.list_task &&
                  exp.list_task.map((task, index) => (
                    <li
                      key={index}
                      className="flex items-start text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
                    >
                      <span className="mr-3 text-black dark:text-gray-500 font-bold mt-0.5">
                        •
                      </span>
                      {task}
                    </li>
                  ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
