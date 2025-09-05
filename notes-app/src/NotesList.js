import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function NotesList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/notes", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch notes");
        return res.json();
      })
      .then((data) => setNotes(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="notes-container">Loading notes...</div>;
  if (error)
    return (
      <div className="notes-container">
        <div className="error">Error: {error}</div>
      </div>
    );

  return (
    <div className="notes-container">
      <h2 className="notes-title">My Notes</h2>
      <Link to="/notes/new">
        <button className="note-form-button">New Note</button>
      </Link>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {notes.map((note) => (
          <li key={note.id} className="note-item">
            <Link to={`/notes/${note.id}`}>{note.title || "Untitled Note"}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotesList;
