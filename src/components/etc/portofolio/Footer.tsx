export default function Footer() {
  return (
    <footer className="py-10 bg-black text-gray-300 mt-20">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h3 className="text-white font-bold text-lg">Acep Nurman Sidik</h3>
        <p className="text-gray-400 text-sm mt-2">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
