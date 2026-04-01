 import { useEffect, useState } from "react";
import API from "../services/api";

export default function ManageMovies() {
  const [movies, setMovies] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    totalSeats: "",
    releaseDate: "",
  });

  const [poster, setPoster] = useState(null);
  const [backdrop, setBackdrop] = useState(null);

  const fetchMovies = async () => {
    try {
      const res = await API.get("/api/movies");
      setMovies(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleEditClick = (movie) => {
    setEditId(movie._id);
    setForm({
      title: movie.title,
      description: movie.description,
      price: movie.price,
      totalSeats: movie.totalSeats || "",
      releaseDate: movie.releaseDate,
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("totalSeats", form.totalSeats);
      formData.append("releaseDate", form.releaseDate);

      if (poster) formData.append("poster", poster);
      if (backdrop) formData.append("backdrop", backdrop);

      const res = await API.put(`/api/movies/update/${id}`, formData);

      alert("Updated ✅");
      setEditId(null);
      setPoster(null);
      setBackdrop(null);

      setMovies((prev) =>
        prev.map((m) => (m._id === id ? res.data.movie : m))
      );
    } catch (err) {
      alert("Update failed ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie?")) return;
    try {
      await API.delete(`/api/movies/delete/${id}`);
      setMovies((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert("Delete failed ❌");
    }
  };

  return (
    <div style={containerStyle}>
      {/* Inline Styles for Keyframe Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .movie-card:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 20px rgba(229, 9, 20, 0.3);
            border-color: #e50914;
            z-index: 10;
          }
          .btn-hover:hover {
            filter: brightness(1.2);
            transform: translateY(-2px);
          }
          .btn-hover:active {
            transform: translateY(0);
          }
        `}
      </style>

      <h2 style={headerStyle}>🎬 Manage Movies</h2>

      <div style={gridStyle}>
        {movies.map((movie) => (
          <div key={movie._id} className="movie-card" style={cardStyle}>
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/${movie.poster}`}
              alt=""
              style={imageStyle}
            />

            {editId === movie._id ? (
              <div style={{ ...formStyle, animation: "fadeIn 0.3s ease-out" }}>
                <input style={inputStyle} name="title" value={form.title} onChange={handleChange} placeholder="Title" />
                <input style={inputStyle} name="price" value={form.price} onChange={handleChange} placeholder="Price" />
                <input style={inputStyle} type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} />
                <textarea style={{ ...inputStyle, height: '60px' }} name="description" value={form.description} onChange={handleChange} placeholder="Description" />
                
                <div style={buttonGroup}>
                  <button className="btn-hover" style={saveButtonStyle} onClick={() => handleUpdate(movie._id)}>Save</button>
                  <button className="btn-hover" style={cancelButtonStyle} onClick={() => setEditId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ ...contentStyle, animation: "fadeIn 0.4s ease-out" }}>
                <h3 style={titleStyle}>{movie.title}</h3>
                <p style={infoStyle}><span style={{ color: '#e50914' }}>Price:</span> ₹{movie.price}</p>
                <p style={infoStyle}><span style={{ color: '#e50914' }}>Release:</span> {movie.releaseDate}</p>
                <p style={descStyle}>{movie.description}</p>

                <div style={buttonGroup}>
                  <button className="btn-hover" style={editButtonStyle} onClick={() => handleEditClick(movie)}>Edit</button>
                  <button className="btn-hover" style={deleteButtonStyle} onClick={() => handleDelete(movie._id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// --- STYLES ---

const containerStyle = {
  backgroundColor: "#000",
  minHeight: "100vh",
  padding: "100px 40px 40px 40px",
  color: "#fff",
  fontFamily: "'Segoe UI', Roboto, sans-serif",
};

const headerStyle = {
  color: "#e50914",
  fontSize: "2rem",
  marginBottom: "30px",
  borderBottom: "2px solid #e50914",
  display: "inline-block",
  paddingBottom: "5px",
};

const gridStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "30px",
  justifyContent: "center",
};

const cardStyle = {
  width: "280px",
  backgroundColor: "#141414",
  borderRadius: "12px",
  overflow: "hidden",
  border: "1px solid #333",
  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)", // Bouncy transition
  cursor: "pointer",
};

const imageStyle = {
  width: "100%",
  height: "380px",
  objectFit: "cover",
  borderBottom: "3px solid #e50914",
};

const contentStyle = {
  padding: "15px",
};

const titleStyle = {
  fontSize: "1.3rem",
  margin: "0 0 8px 0",
  color: "#fff",
};

const infoStyle = {
  margin: "4px 0",
  fontSize: "0.85rem",
  color: "#ccc",
};

const descStyle = {
  fontSize: "0.8rem",
  color: "#999",
  display: "-webkit-box",
  WebkitLineClamp: "2",
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  margin: "10px 0",
};

const formStyle = {
  padding: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const inputStyle = {
  backgroundColor: "#222",
  border: "1px solid #444",
  color: "#fff",
  padding: "10px",
  borderRadius: "6px",
  outline: "none",
  transition: "border-color 0.3s",
};

const buttonGroup = {
  display: "flex",
  gap: "10px",
  marginTop: "10px",
};

const commonButton = {
  flex: 1,
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all 0.2s ease",
};

const editButtonStyle = { ...commonButton, backgroundColor: "#222", color: "#fff", border: "1px solid #444" };
const deleteButtonStyle = { ...commonButton, backgroundColor: "#e50914", color: "#fff" };
const saveButtonStyle = { ...commonButton, backgroundColor: "#e50914", color: "#fff" };
const cancelButtonStyle = { ...commonButton, backgroundColor: "#444", color: "#fff" };