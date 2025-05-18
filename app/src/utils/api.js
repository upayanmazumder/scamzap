const env = process.env.NEXT_PUBLIC_ENV || "production";

const API =
  env === "development"
    ? "http://localhost:5000"
    : "https://api.scamzap.upayan.dev";

export default API;
