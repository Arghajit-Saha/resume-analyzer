import axios from  "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

export async function register({firstName, lastName, email, password}) {
  const res = await api.post("/api/auth/register", {
    firstName, lastName, email, password
  });
  return res.data;
}

export async function login({email, password}) {
  const res = await api.post("/api/auth/login", {
    email, password
  });
  return res.data;
}

export async function logout() {
  const res = await api.get("/api/auth/logout");
  return res;
}

export async function fetchMe() {
  try {
    const res = await api.get("/api/auth/fetch-me");
    return res.data;
  } catch {
    return null;
  }
}