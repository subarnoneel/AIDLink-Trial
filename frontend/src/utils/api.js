import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Spring Boot backend
  withCredentials: true, // important for session cookies
});

export default api;
