import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const signup = async (userData: {
  user_name: string;
  user_email: string;
  password: string;
}) => {
  const res = await api.post("/auth/signup/", userData);
  return res.data;
};

export const login = async (userData: {
  user_email: string;
  password: string;
}) => {
  const res = await api.post("/auth/login/", userData);
  return res.data;
};

export const getUserNotes = async (userId: string) => {
  const res = await api.get(`/auth/user/${userId}/`);
  return res.data;
};

export const createNote = async (noteData: {
  user_id: string;
  note_title: string;
  note_content: string;
}) => {
  const res = await api.post("/auth/create/", noteData);
  return res.data;
};

export const updateNote = async (
  noteId: string,
  noteData: { note_title: string; note_content: string }
) => {
  const res = await api.put(`/auth/update/${noteId}/`, noteData);
  return res.data;
};
