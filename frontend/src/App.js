import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [songs, setSongs] = useState([]);
  const [newSong, setNewSong] = useState({ title: '', artist: '' });

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get('https://supreme-space-journey-jgq4765ww6vfvx7-5000.app.github.dev/songs');
      setSongs(response.data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const handleAddSong = async () => {
    try {
      await axios.post('https://supreme-space-journey-jgq4765ww6vfvx7-5000.app.github.dev/songs', newSong);
      setNewSong({ title: '', artist: '' });
      fetchSongs(); // Refresh the page to get updated data
    } catch (error) {
      console.error('Error adding song:', error);
    }
  };

  const handleVote = async (songId) => {
    try {
      await axios.post(`https://supreme-space-journey-jgq4765ww6vfvx7-5000.app.github.dev/songs/${songId}/vote`);
      fetchSongs(); // Refresh the page to get updated data
    } catch (error) {
      console.error('Error voting for song:', error);
    }
  };

  return (
    <div className="App">
      <h1>🔥 QueueUp 🔥</h1>
      <div>
        <input
          type="text"
          placeholder="Song Title"
          value={newSong.title}
          onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Artist"
          value={newSong.artist}
          onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
        />
        <button onClick={handleAddSong}>Add Song</button>
      </div>

      <ul>
        {songs.map((song) => (
          <li key={song.id}>
            <strong>{song.title}</strong> by {song.artist} - Votes: {song.votes}
            <button onClick={() => handleVote(song.id)}>👍 Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
