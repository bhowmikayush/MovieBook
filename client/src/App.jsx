 import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import Movies from "./pages/Movies";
import Navbar from "./components/Navbar";
import Favorites from "./pages/Favorites";
import AdminShowManager from "./pages/AdminShowManager";
import ManageMovies from "./pages/ManageMovies";
import ManageUsers from "./pages/ManageUsers";

function App() {
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);
  }, []);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Movie Details */}
        <Route path="/movie/:id" element={<MovieDetails />} />

        {/* Seat Booking */}
        <Route path="/seats/:id" element={<SeatLayout />} />

        {/* My Bookings */}
        <Route
          path="/bookings"
          element={  <MyBookings />  } />
         

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/movies" element={<Movies />} />
        <Route path="/favorites" element={<Favorites />} />
         
        {/* Admin Show Manager */}
        <Route path="/admin/show-manager" element={<AdminShowManager />} /> {/* ✅ your route */}
          <Route path="/admin/manage-movies" element={<ManageMovies />} />
<Route path="/admin/manage-users" element={<ManageUsers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;