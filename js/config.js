const CHENTOONS_LOCAL_API = "http://localhost:8080";
const CHENTOONS_RENDER_API = "https://cheentoons-backend.onrender.com";
const CHENTOONS_HOST = window.location.hostname;
const CHENTOONS_ES_LOCAL = !CHENTOONS_HOST
  || CHENTOONS_HOST === "localhost"
  || CHENTOONS_HOST === "127.0.0.1"
  || CHENTOONS_HOST === "0.0.0.0"
  || CHENTOONS_HOST.startsWith("192.168.")
  || CHENTOONS_HOST.startsWith("10.")
  || CHENTOONS_HOST.startsWith("172.16.")
  || CHENTOONS_HOST.startsWith("172.17.")
  || CHENTOONS_HOST.startsWith("172.18.")
  || CHENTOONS_HOST.startsWith("172.19.")
  || CHENTOONS_HOST.startsWith("172.2")
  || CHENTOONS_HOST.startsWith("172.30.")
  || CHENTOONS_HOST.startsWith("172.31.");

window.CHENTOONS_CONFIG = {
  API_BASE: CHENTOONS_ES_LOCAL ? CHENTOONS_LOCAL_API : CHENTOONS_RENDER_API
};
