 import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newRole, setNewRole] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Permanent delete?")) return;
    try {
      await API.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleUpdateRole = async (id) => {
    try {
      const res = await API.put(`/api/users/${id}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: res.data.user.role } : u))
      );
      setEditingId(null);
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div style={containerStyle}>
      {/* Header Animation */}
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={headerStyle}
      >
        <span style={{ color: "#ff0000" }}>ADMIN</span> PANEL
      </motion.h2>

      {/* Table Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={tableWrapper}
      >
        <table style={tableStyle}>
          <thead>
            <tr style={theadStyle}>
              <th style={thStyle}>User</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Role</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {users.map((user, index) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  style={rowStyle}
                  whileHover={{ backgroundColor: "#1a1a1a" }}
                >
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img src={user.photo} alt="" style={avatarStyle} />
                      <span style={{ fontWeight: "600" }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>
                    {editingId === user._id ? (
                      <select 
                        style={selectStyle} 
                        value={newRole} 
                        onChange={(e) => setNewRole(e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span style={roleBadge(user.role)}>{user.role}</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    {editingId === user._id ? (
                      <>
                        <button onClick={() => handleUpdateRole(user._id)} style={saveBtn}>Save</button>
                        <button onClick={() => setEditingId(null)} style={cancelBtn}>Exit</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => { setEditingId(user._id); setNewRole(user.role); }} style={editBtn}>Edit</button>
                        <button onClick={() => handleDelete(user._id)} style={deleteBtn}>Delete</button>
                      </>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

 
       
    </div>
  );
}

 

const containerStyle = {
  backgroundColor: "#0a0a0a",
  minHeight: "100vh",
  color: "#fff",
  padding: "40px 20px 120px 20px", // High padding-bottom to clear the navbar
  fontFamily: "'Segoe UI', Roboto, sans-serif",
};

const headerStyle = {
  fontSize: "24px",
  fontWeight: "800",
  letterSpacing: "2px",
  marginBottom: "30px",
  paddingLeft: "10px",
  borderLeft: "4px solid #ff0000",
};

const tableWrapper = {
  background: "#111",
  borderRadius: "8px",
  border: "1px solid #222",
  overflow: "hidden",
  boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
};

const tableStyle = { width: "100%", borderCollapse: "collapse" };

const theadStyle = {
  background: "#000",
  textAlign: "left",
  color: "#666",
  textTransform: "uppercase",
  fontSize: "12px",
  letterSpacing: "1px",
};

const rowStyle = { borderBottom: "1px solid #1a1a1a" };
const thStyle = { padding: "16px" };
const tdStyle = { padding: "16px", color: "#ccc" };

const avatarStyle = {
  width: "35px",
  height: "35px",
  borderRadius: "4px",
  border: "1px solid #ff0000",
  objectFit: "cover",
};

const roleBadge = (role) => ({
  backgroundColor: role === "admin" ? "#ff0000" : "#222",
  color: "#fff",
  padding: "4px 8px",
  borderRadius: "3px",
  fontSize: "10px",
  fontWeight: "bold",
  textTransform: "uppercase",
});

const selectStyle = {
  background: "#000",
  color: "#ff0000",
  border: "1px solid #ff0000",
  padding: "4px",
  outline: "none",
};

const btnBase = {
  padding: "6px 12px",
  fontSize: "12px",
  fontWeight: "700",
  borderRadius: "2px",
  cursor: "pointer",
  marginRight: "8px",
  border: "none",
  transition: "0.2s",
};

const editBtn = { ...btnBase, background: "transparent", border: "1px solid #444", color: "#fff" };
const deleteBtn = { ...btnBase, background: "#800000", color: "#fff" };
const saveBtn = { ...btnBase, background: "#ff0000", color: "#fff" };
const cancelBtn = { ...btnBase, background: "#333", color: "#fff" };

// --- NAVBAR STYLE ---
const navbarStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  height: "70px",
  backgroundColor: "#000",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  borderTop: "1px solid #222",
  zIndex: 1000,
  padding: "0 20px",
};

const navItem = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#666",
  cursor: "pointer",
  height: "100%",
  display: "flex",
  alignItems: "center",
  transition: "0.3s",
};