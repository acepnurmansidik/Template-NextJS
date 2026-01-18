import Image from "next/image";

export default function Footer() {
  return (
    <section className="w-full bg-black px-6 md:px-32 pb-14 pt-10 md:pt-20 md:flex md:justify-center gap-4 bg-primary text-white items-end">
      <div className="col-span-1 w-full hidden md:block">
        <div className="h-32 w-32 bg-white"></div>
      </div>
      <div className="col-span-1 w-full">
        <div className="flex justify-end mb-6">
          <Image
            className="ml-2 md:ml-4"
            src="/assets/icons/facebook.png"
            height={42}
            width={42}
            alt={"fbIcon"}
          />
        </div>
        <p className="text-end">
          JL Raya Sasak Beusi No.10, Sindangsuka, Kec. Cibatu
          <br />
          Kabupaten Garut, Jawa Barat 44185
        </p>
        <div className="max-w-6xl mx-auto px-6 text-end">
          {/* <h3 className="text-white font-bold text-lg">Acep Nurman Sidik</h3> */}
          <p className="text-gray-400 text-sm mt-2">
            acepnurmansidik_ © {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
}
