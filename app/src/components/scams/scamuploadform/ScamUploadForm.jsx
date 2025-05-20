"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import API from "../../../utils/api";

function ScamUploadForm({ userId }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      id: uuidv4(),
      ...form,
      submittedBy: userId,
    };

    try {
      const res = await fetch(`${API}/scams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to submit");

      setSuccess("Scam report submitted successfully!");
      setForm({ title: "", description: "", category: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 rounded shadow space-y-4"
    >
      <h2 className="text-xl font-bold">Report a Scam</h2>

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        className="w-full border px-3 py-2 rounded"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
        className="w-full border px-3 py-2 rounded"
      />

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        required
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select Category</option>
        <option value="Phishing">Phishing</option>
        <option value="Investment">Investment Scam</option>
        <option value="Online Fraud">Online Fraud</option>
        <option value="Other">Other</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Submitting..." : "Submit Scam"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
    </form>
  );
}

export default ScamUploadForm;
