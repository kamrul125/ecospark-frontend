export default function Footer() {
  return (
    <footer className="mt-20 text-white bg-gray-900 border-t border-gray-800">
      <div className="grid grid-cols-1 gap-12 px-6 py-16 mx-auto max-w-7xl md:grid-cols-3">
        
        {/* 🌿 About Section */}
        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-2xl font-black tracking-tight">
            🌱 <span className="text-white">EcoSpark</span><span className="text-green-500">Hub</span>
          </h2>
          <p className="max-w-xs text-sm font-medium leading-relaxed text-gray-400">
           
          </p>
          <div className="flex gap-4 pt-2">
            {/* Social icons Placeholder */}
            <div className="flex items-center justify-center w-8 h-8 transition-colors bg-gray-800 rounded-full cursor-pointer hover:bg-green-600">f</div>
            <div className="flex items-center justify-center w-8 h-8 transition-colors bg-gray-800 rounded-full cursor-pointer hover:bg-green-600">t</div>
            <div className="flex items-center justify-center w-8 h-8 transition-colors bg-gray-800 rounded-full cursor-pointer hover:bg-green-600">i</div>
          </div>
        </div>

        {/* 🔗 Quick Links */}
        <div>
          <h2 className="mb-6 text-lg font-black tracking-widest text-green-500 uppercase">Quick Links</h2>
          <ul className="space-y-3 text-sm font-bold text-gray-400">
            <li>
              <a href="/" className="inline-block transition-all hover:text-white hover:translate-x-1">Home</a>
            </li>
            <li>
              <a href="/ideas/create" className="inline-block transition-all hover:text-white hover:translate-x-1">Create Idea</a>
            </li>
            <li>
              <a href="/auth/login" className="inline-block transition-all hover:text-white hover:translate-x-1">Login</a>
            </li>
            <li>
              <a href="/auth/signup" className="inline-block transition-all hover:text-white hover:translate-x-1">Signup</a>
            </li>
          </ul>
        </div>

        {/* 📞 Contact Info */}
        <div>
          <h2 className="mb-6 text-lg font-black tracking-widest text-green-500 uppercase">Contact</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-green-500">✉️</span>
              <p className="text-sm font-medium text-gray-400">support@ecospark.com</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500">📞</span>
              <p className="text-sm font-medium text-gray-400">+880 1234-567890</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500">📍</span>
              <p className="text-sm font-medium text-gray-400">Rangpur, Bangladesh</p>
            </div>
          </div>
        </div>
      </div>

      {/* 📜 Bottom Copyright */}
      <div className="py-8 border-t border-gray-800">
        <div className="flex flex-col items-center justify-between gap-4 px-6 mx-auto max-w-7xl md:flex-row">
          <p className="text-xs font-bold text-gray-500">
            © 2026 EcoSpark Hub. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs font-bold text-gray-500">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}