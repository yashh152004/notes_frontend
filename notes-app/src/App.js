import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import NotesList from "./NotesList";
import NoteView from "./NoteView";
import NoteForm from "./NoteForm";
import Login from "./Login";
import Register from "./Register";
import "./App.css";
// Utility to check JWT presence
function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export default function App() {
  const [auth, setAuth] = useState(isAuthenticated());

  useEffect(() => {
    setAuth(isAuthenticated());
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login setAuth={setAuth} />} />
      <Route path="/register" element={<Register setAuth={setAuth} />} />
      {auth ? (
        <>
          <Route path="/notes" element={<NotesList />} />
          <Route path="/notes/:id" element={<NoteView />} />
          <Route path="/notes/new" element={<NoteForm />} />
          <Route path="/notes/:id/edit" element={<NoteForm />} />
          <Route path="*" element={<Navigate to="/notes" />} />
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}
