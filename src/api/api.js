import axios from "axios"

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://arcmind-27ed.onrender.com"

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
})

/* ---------- Health Check ---------- */
export const checkHealth = async () => {
  try {
    const res = await api.get("/health")
    return res.status === 200
  } catch {
    return false
  }
}

/* ---------- Chat API ---------- */
export const sendMessage = async (message) => {
  const res = await api.post("/chat", { message })
  return res.data
}

export default api
