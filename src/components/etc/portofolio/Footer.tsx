import Image from "next/image";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="w-full bg-slate-950 pt-20 pb-10 border-t border-gray-800"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 text-center">
          Let's Work Together
        </h2>
        <p className="text-gray-400 text-center max-w-lg mb-10">
          I'm currently available for freelance work and full-time
          opportunities. If you have a project that needs some creative touch,
          I'd love to hear about it.
        </p>

        <a href="mailto:your.email@example.com">
          <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors duration-300 mb-16">
            Say Hello
          </button>
        </a>

        <div className="w-full h-px bg-gray-800 mb-8"></div>

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
              <span className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center font-bold text-xs">
                48
              </span>
              <span className="text-white font-semibold">
                Acep Nurman Sidik
              </span>
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              JL Raya Sasak Beusi No.10, Sindangsuka, Kec. Cibatu
              <br />
              Kabupaten Garut, Jawa Barat 44185
            </p>
          </div>

          <div className="flex gap-4">
            {/* Contoh Social Icons - Anda bisa menambah Link In, GitHub dll */}
            <a
              href="#"
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
            >
              <Image
                src="/assets/icons/facebook.png"
                height={20}
                width={20}
                alt="Facebook"
                className="filter brightness-0 invert"
              />
            </a>
            {/* Tambahkan ikon lain di sini */}
          </div>
        </div>

        <div className="w-full text-center mt-12">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Acep Nurman Sidik. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
