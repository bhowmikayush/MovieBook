import { Link } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

export default function MovieCard({ movie }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // local state for instant UI update
  const [data, setData] = useState(movie);

  //  calculate average
  const avgRating =
    data.ratingCount > 0
      ? (data.totalRating / data.ratingCount).toFixed(1)
      : 0;

  const isFav = data.favorites?.includes(user?.id);
  const alreadyRated = data.ratedUsers?.includes(user?.id);
  const API_URL = import.meta.env.VITE_API_URL;

  //  FAVORITE
  const handleFavorite = async () => {
    try {
      const res = await API.post("/api/movies/favorite", {
        movieId: data._id,
      });

      setData({ ...data, favorites: res.data.favorites });
    } catch (err) {
      console.log(err);
    }
  };

  //  RATE
  const handleRating = async (rating) => {
    try {
      const res = await API.post("/api/movies/rate", {
        movieId: data._id,
        rating,
      });

      setData(res.data.movie);
    } catch (err) {
      alert(err.response?.data?.error || "Already rated");
    }
  };

  return (
    <div className="bg-gray-900 text-white shadow rounded-lg overflow-hidden hover:scale-105 transition duration-300">

      {/*  Poster */}
      <div className="relative">
        <img
          src={`${API_URL}/uploads/$${data.poster}`}
          alt={data.title}
          className="h-60 w-full object-cover"
        />

        {/*  Favorite */}
        <button
          onClick={handleFavorite}
          className="absolute top-2 right-2 text-xl"
        >
          {isFav ? "❤️" : "🤍"}
        </button>

        {/* ⭐ Rating */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 px-2 py-1 rounded text-sm">
          ⭐ {avgRating}/5 ({data.ratingCount || 0})
        </div>
      </div>

      {/*  Details */}
      <div className="p-3">
        <h2 className="text-lg font-bold">{data.title}</h2>

        {/*  RATE */}
        <div className="mt-2 flex flex-wrap gap-1">
          {alreadyRated ? (
            <span className="text-green-400 text-sm">
              ✅ Rated
            </span>
          ) : (
            [1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                onClick={() => handleRating(r)}
                className="bg-yellow-400 text-black px-2 py-1 text-xs rounded hover:bg-yellow-300"
              >
                {r}⭐
              </button>
            ))
          )}
        </div>

        {/*  View */}
        <Link
          to={`/movie/${data._id}`}
          className="block mt-3 text-blue-400 hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}