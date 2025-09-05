import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function NoteView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({});
  const [shareUrl, setShareUrl] = useState("");

  // Load note details
  useEffect(() => {
    fetch(`http://localhost:8080/api/notes/${id}`, {
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load note");
        return res.json();
      })
      .then(setNote)
      .catch((err) => console.error(err));
  }, [id]);

  // Delete note
  function handleDelete() {
    fetch(`http://localhost:8080/api/notes/${id}`, {
      method: "DELETE",
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete note");
        navigate("/notes");
      })
      .catch((err) => console.error(err));
  }

  // Share note
  function handleShare() {
    fetch(`http://localhost:8080/api/notes/${id}/share`, {
      method: "POST",
      headers: { "Authorization": "Bearer " + localStorage.getItem("token") },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to share note");
        return res.json();
      })
      .then((data) => setShareUrl(data.share_url))
      .catch((err) => console.error(err));
  }

  return (
    <div className="notes-container">
      <h2 className="notes-title">{note.title}</h2>
      <p>{note.content}</p>
      <div className="note-form" style={{ gap: "10px" }}>
        <button onClick={() => navigate(`/notes/${id}/edit`)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleShare}>Share</button>
      </div>
      {shareUrl && (
        <input
          className="note-form"
          readOnly
          value={shareUrl}
          style={{ marginTop: "15px", padding: "10px", width: "100%" }}
        />
      )}
    </div>
  );
}

export default NoteView;
