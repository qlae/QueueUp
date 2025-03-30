import React, { useState, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";

// Backend URL is no longer needed in the fetch calls due to the proxy
const App = () => {
  const [songRequest, setSongRequest] = useState("");
  const [queue, setQueue] = useState([]);

  // Submit song to backend
  const handleSubmit = async () => {
    if (!songRequest.trim()) return;  // Ensure there's a song
    
    try {
      // Sending the song to backend
      await fetch("/api/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song: songRequest }),  // Send song in the body
      });
      setSongRequest("");  // Clear the input field after submitting
      fetchQueue();  // Refresh queue after submission
    } catch (err) {
      console.error("Failed to submit:", err);
    }
  };

  // Fetch the current queue
  const fetchQueue = async () => {
    try {
      const res = await fetch("/api/requests");  // No need for the backend URL
      const data = await res.json();
      setQueue(data);  // Update the state with the new queue
    } catch (err) {
      console.error("Failed to load queue:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchQueue, 3000); // Refresh every 3 seconds
    fetchQueue(); // Fetch immediately on page load
    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  return (
    <div style={{ fontFamily: "Arial", padding: "2rem", background: "#f9f9f9", minHeight: "100vh" }}>
      <header style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ color: "#4f46e5", fontSize: "2rem" }}>🎶 QueueUp</h1>
        <p>Scan the code or type a request to join the party</p>
      </header>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <QRCodeCanvas value={window.location.href} size={160} />
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <input
          value={songRequest}
          onChange={(e) => setSongRequest(e.target.value)}
          placeholder="Enter a song"
          style={{ flex: 1, padding: "0.75rem", fontSize: "1rem", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button
          onClick={handleSubmit}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>

      <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1rem" }}>🎧 Live Queue</h2>
      {queue.length === 0 ? (
        <p>No songs requested yet.</p>
      ) : (
        queue.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#fff",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{item.song}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: "#4f46e5", fontWeight: "bold" }}>Votes: {item.votes}</span>
              <button
                onClick={() => handleVote(item.song)}
                style={{
                  background: "#e0e7ff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "0.3rem 0.6rem",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                👍
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default App;
