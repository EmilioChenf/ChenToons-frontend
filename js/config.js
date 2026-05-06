const CHENTOONS_LOCAL_API = "http://localhost:8080";
const CHENTOONS_RENDER_API = "https://chentoons-backend.onrender.com";

window.CHENTOONS_CONFIG = {
  API_BASE: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? CHENTOONS_LOCAL_API
    : CHENTOONS_RENDER_API
};
