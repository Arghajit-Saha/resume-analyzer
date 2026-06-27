import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

export async function fetchProfile() {
  const res = await api.get("/api/profile");
  return res.data;
}
