 import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function SeatLayout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Load show + user
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedInUser) {
      setShowLoginPopup(true);
    } else {
      setUser(loggedInUser);
    }

    const fetchShow = async () => {
      try {
        const res = await API.get(`/api/shows/single/${id}`);
        console.log("SHOW DATA:", res.data);
        setShow(res.data);
        setSeats(res.data.seats || []);
      } catch (err) {
        console.error("Error fetching show:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-red-600 font-bold bg-black">
        Loading...
      </div>
    );

  if (!show) return <div className="text-center text-white">Show not found</div>;

  const seatPrice = show?.movie?.price || 0;
  const totalAmount = selected.length * seatPrice;

  const toggleSeat = (index) => {
    if (!user) return setShowLoginPopup(true);
    if (seats[index]) return; // occupied seat
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getSeatLabel = (index) => {
    const row = Math.floor(index / 10) + 1;
    const seatNum = (index % 10) + 1;
    return { row, seatNum };
  };

  const handlePayment = async () => {
    if (!user) return setShowLoginPopup(true);
    if (selected.length === 0) return alert("Select seats first");

    const res = await loadRazorpay();
    if (!res) return alert("Razorpay SDK failed to load");

    try {
      const order = await API.post("/api/payment/create-order", {
        amount: totalAmount,
        showId: id,
        seats: selected,
        user: user._id,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.data.amount,
        currency: "INR",
        order_id: order.data.id,
        theme: { color: "#dc2626" },
        handler: async function (response) {
          await API.post("/api/payment/verify", {
            ...response,
            showId: id,
            seats: selected,
            user: user._id,
          });
          setShowSuccessPopup(true);
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      alert("Payment failed");
      console.error(err);
    }
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-28 px-6 pb-10 relative">
      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#111] p-10 rounded shadow-lg w-96 text-center space-y-6">
            <h2 className="text-xl font-bold">Login Required</h2>
            <p className="text-zinc-400">
              Please login to select seats and proceed with booking.
            </p>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#111] p-10 rounded shadow-lg w-96 text-center space-y-6">
            <h2 className="text-xl font-bold text-green-500">Booking Confirmed!</h2>
            <p className="text-zinc-400">Your seats have been successfully booked.</p>
            <button
              onClick={() => {
                setShowSuccessPopup(false);
                navigate("/bookings");
              }}
              className="px-6 py-3 bg-red-600 text-white font-bold uppercase tracking-widest rounded hover:bg-red-700 transition"
            >
              Go to My Bookings
            </button>
          </div>
        </div>
      )}

      {/* Seat Map */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3 space-y-6">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">
            {show?.movie?.title}
          </h1>

          {/* Selected Seats */}
          <div className="space-y-3 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
            {selected.map((index) => {
              const { row, seatNum } = getSeatLabel(index);
              return (
                <div
                  key={index}
                  className="flex justify-between items-center bg-[#151515] p-4 rounded border border-zinc-800 animate-slideIn"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold">{row}</span>
                    <span className="text-[10px] text-zinc-500 uppercase">row</span>
                    <span className="text-lg font-bold ml-2">{seatNum}</span>
                    <span className="text-[10px] text-zinc-500 uppercase">seat</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-400 font-mono">₹{seatPrice}</span>
                    <button
                      onClick={() => toggleSeat(index)}
                      className="text-zinc-600 hover:text-red-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-6 border-t border-zinc-900 flex justify-between items-end">
            <span className="text-zinc-500 uppercase text-xs font-bold">Total:</span>
            <span className="text-4xl font-black tracking-tighter">₹{totalAmount}</span>
          </div>
        </div>

        {/* Seat Layout */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full mb-20 px-10">
            <div className="w-full h-1 bg-zinc-800 rounded-full shadow-[0_-15px_40px_rgba(255,255,255,0.1)]" />
            <p className="text-center text-[10px] tracking-[1.5em] text-zinc-600 uppercase mt-[-45px]">
              Screen
            </p>
          </div>

          <div className="space-y-12">
            {/* Front Seats */}
            <div className="grid grid-cols-10 gap-3">
              {seats.slice(0, Math.ceil(seats.length / 2)).map((isBooked, i) => (
                <button
                  key={i}
                  disabled={isBooked}
                  onClick={() => toggleSeat(i)}
                  className={`w-7 h-7 rounded-sm transition-all duration-300 ${
                    isBooked
                      ? "bg-gray-700 cursor-not-allowed opacity-50"
                      : selected.includes(i)
                      ? "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)] scale-110 animate-bounce"
                      : "bg-[#222] hover:bg-zinc-600"
                  }`}
                />
              ))}
            </div>

            {/* Back Seats */}
            <div className="grid grid-cols-10 gap-3">
              {seats.slice(Math.ceil(seats.length / 2)).map((isBooked, i) => {
                const actualIndex = i + Math.ceil(seats.length / 2);
                return (
                  <button
                    key={actualIndex}
                    disabled={isBooked}
                    onClick={() => toggleSeat(actualIndex)}
                    className={`w-7 h-7 rounded-sm transition-all duration-300 ${
                      isBooked
                        ? "bg-gray-700 cursor-not-allowed opacity-50"
                        : selected.includes(actualIndex)
                        ? "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.6)] scale-110 animate-bounce"
                        : "bg-[#222] hover:bg-zinc-600"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-16 flex gap-6">
            <button
              onClick={() => navigate(-1)}
              className="px-10 py-3 border border-red-600 text-red-600 font-bold uppercase text-xs tracking-widest hover:bg-red-600 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={selected.length === 0}
              className="px-14 py-3 bg-red-600 text-white font-bold uppercase text-xs tracking-widest hover:bg-red-700 disabled:opacity-20 transition shadow-lg shadow-red-900/20"
            >
              Proceed To Pay
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
}