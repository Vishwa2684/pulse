import React, { useState } from "react";
import axios from "axios";

const DocumentGenerator = () => {
  const [topic, setTopic] = useState("");
  const [docType, setDocType] = useState("pdf");
  const [email, setEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/generate-document/", {
        topic,
        doc_type: docType,
        email,
      });

      setResponseMessage(response.data.message);
    } catch (error) {
      setResponseMessage(error.response?.data?.error || "An error occurred while generating the document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Generate Document</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="topic">Topic:</label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="docType">Document Type:</label>
          <select
            id="docType"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          >
            <option value="pdf">PDF</option>
            <option value="word">Word</option>
          </select>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="email">Recipient Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: "10px 20px", cursor: "pointer" }}>
          {loading ? "Generating..." : "Generate and Send"}
        </button>
      </form>
      {responseMessage && <p style={{ marginTop: "20px", color: responseMessage.startsWith("Document") ? "green" : "red" }}>{responseMessage}</p>}
    </div>
  );
};

export default DocumentGenerator;
