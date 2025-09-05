import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function NoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({ title: "", content: "" });

  // Load note when editing
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/api/notes/${id}`, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch note");
          return res.json();
        })
        .then(setNote)
        .catch((err) => console.error(err));
    }
  }, [id]);

  function handleChange(e) {
    setNote({ ...note, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = id ? "PATCH" : "POST";
    const url = id
      ? `http://localhost:8080/api/notes/${id}`
      : "http://localhost:8080/api/notes";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(note),
      });

      if (!res.ok) {
        throw new Error("Failed to save note");
      }

      navigate("/notes");
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving the note");
    }
  }

  return (
    <div className="notes-container">
      <h2 className="notes-title">{id ? "Edit Note" : "New Note"}</h2>
      <form className="note-form" onSubmit={handleSubmit}>
        <input
          name="title"
          value={note.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="content"
          value={note.content}
          onChange={handleChange}
          placeholder="Content"
          required
        />
        <button type="submit">{id ? "Update Note" : "Create Note"}</button>
      </form>
    </div>
  );
}

export default NoteForm;
