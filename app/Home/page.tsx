"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserNotes, createNote } from "../../Utils/Api";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Calendar, PlusCircle, X, Edit, Check } from "lucide-react";

interface Note {
  note_id: string;
  user_id: string;
  note_title: string;
  note_content: string;
  last_update: string;
  created_on: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const router = useRouter();

  const user_name =
    typeof window !== "undefined"
      ? localStorage.getItem("user_name") || ""
      : "";
  const user_id =
    typeof window !== "undefined" ? localStorage.getItem("user_id") || "" : "";

  useEffect(() => {
    if (!user_id) {
      router.push("/");
    } else {
      getUserNotes(user_id)
        .then((data) => setNotes(data.notes || []))
        .catch((error) => console.error("Error fetching notes:", error));
    }
  }, [user_id]);

  const handleCreateNote = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content cannot be empty.");
      return;
    }

    try {
      await createNote({
        user_id,
        note_title: title,
        note_content: content,
      });

      setTitle("");
      setContent("");
      setShowForm(false);
      getUserNotes(user_id)
        .then((data) => setNotes(data.notes || []))
        .catch((error) => console.error("Error fetching notes:", error));
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editNote?.note_title.trim() || !editNote?.note_content.trim()) {
      alert("Title and content cannot be empty.");
      return;
    }

    try {
      await fetch(`http://127.0.0.1:8000/api/auth/update/${noteId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note_title: editNote.note_title,
          note_content: editNote.note_content,
        }),
      });

      setEditNote(null);
      getUserNotes(user_id)
        .then((data) => setNotes(data.notes || []))
        .catch((error) => console.error("Error fetching notes:", error));
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 flex flex-col items-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl flex justify-between items-center mb-6"
      >
        <h2 className="text-white text-2xl font-semibold">
          👋 Welcome, {user_name}!
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl"
      >
        {notes.length > 0 ? (
          notes.map((note) => (
            <motion.div
              key={note.note_id}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-4 rounded-lg shadow-lg flex flex-col relative"
            >
              {editNote?.note_id === note.note_id ? (
                <div className="w-full">
                  <input
                    className="text-black border p-2 w-full rounded mb-2"
                    value={editNote.note_title}
                    onChange={(e) =>
                      setEditNote({ ...editNote, note_title: e.target.value })
                    }
                  />
                  <textarea
                    className="text-black border p-2 w-full rounded mb-2"
                    value={editNote.note_content}
                    onChange={(e) =>
                      setEditNote({ ...editNote, note_content: e.target.value })
                    }
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateNote(note.note_id)}
                      className="bg-green-500 p-2 rounded text-white"
                    >
                      <Check size={20} />
                    </button>
                    <button
                      onClick={() => setEditNote(null)}
                      className="bg-red-500 p-2 rounded text-white"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-blue-700 flex items-center">
                    <FileText className="mr-2" />
                    {note.note_title}
                  </h3>
                  <p className="text-gray-700 mt-2">{note.note_content}</p>
                  <p className="text-gray-500 text-sm mt-auto flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />{" "}
                    {new Date(note.last_update).toLocaleString()}
                  </p>
                  <button
                    onClick={() => setEditNote(note)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-blue-600"
                  >
                    <Edit size={20} />
                  </button>
                </>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No notes found. Click the button below to add a new note! 🚀
          </p>
        )}
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowForm(!showForm)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
      >
        <PlusCircle size={30} />
      </motion.button>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 bg-white p-6 shadow-lg rounded-lg w-80"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-black text-lg font-semibold">Create Note</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Note Title"
              className="text-black border p-2 rounded w-full mt-3 focus:ring-2 focus:ring-blue-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Note Content"
              className="text-black border p-2 rounded w-full mt-2 focus:ring-2 focus:ring-blue-400"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <motion.button
              onClick={handleCreateNote}
              className="w-full bg-blue-500 text-white p-2 rounded-lg font-semibold mt-3 hover:bg-blue-600"
            >
              📝 Save Note
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
