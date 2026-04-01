 import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import API from "../services/api";
import { useEffect, useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi"; 

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const res = await API.post("/api/auth/google", {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photo: firebaseUser.photoURL,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Bookings", path: "/bookings" },
    { name: "Favorites", path: "/favorites" },
  ];

  const handleNavClick = (link) => {
    setIsMenuOpen(false);
    // Navigate to bookings even if user not logged in
    navigate(link.path);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-black/60 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-red-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <span className="text-xl">🎬</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
            Movie<span className="text-red-600">Book</span>
          </h1>
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-8">
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-xs font-bold uppercase tracking-widest text-red-500 hover:text-red-400 transition"
            >
              Admin Panel
            </Link>
          )}
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link)}
              className={`text-sm font-medium transition-all duration-300 relative py-1 ${
                location.pathname === link.path
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {link.name}
              {location.pathname === link.path && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-full shadow-[0_0_8px_#dc2626]" />
              )}
            </button>
          ))}
        </div>

        {/* USER SECTION */}
        <div className="flex items-center gap-4">
          {!user ? (
            <button
              onClick={handleLogin}
              className="relative group overflow-hidden bg-white text-black px-6 py-2 rounded-full text-sm font-bold transition-all hover:bg-red-600 hover:text-white"
            >
              <span className="relative z-10">Sign In</span>
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 p-1 pr-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition cursor-default">
                <img
                  src={user.photo}
                  alt="profile"
                  className="w-8 h-8 rounded-full border border-white/20"
                />
                <span className="text-xs font-semibold text-gray-200 hidden lg:block">
                  {user.name.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="hidden sm:block text-xs font-bold uppercase tracking-tighter text-gray-400 hover:text-red-500 transition"
              >
                Logout
              </button>
            </div>
          )}

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-3xl text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 bg-black/95 backdrop-blur-2xl transition-transform duration-500 md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 text-2xl font-bold">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link)}
              className={location.pathname === link.path ? "text-red-600" : "text-white"}
            >
              {link.name}
            </button>
          ))}
          {user && (
            <button onClick={handleLogout} className="text-red-500 mt-10">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}