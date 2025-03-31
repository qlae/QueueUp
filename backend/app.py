from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DATABASE = 'queueup.db'

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS songs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                artist TEXT NOT NULL,
                votes INTEGER DEFAULT 0
            )
        ''')
        conn.commit()

@app.route('/songs', methods=['GET'])
def get_songs():
    with sqlite3.connect(DATABASE) as conn:
        c = conn.cursor()
        c.execute('SELECT * FROM songs ORDER BY votes DESC')
        songs = c.fetchall()
        
        # Format the response properly for the frontend
        formatted_songs = []
        for song in songs:
            formatted_songs.append({
                "id": song[0],
                "title": song[1],
                "artist": song[2],
                "votes": song[3]
            })
        
    return jsonify(formatted_songs)

@app.route('/songs', methods=['POST'])
def add_song():
    data = request.json
    title = data.get('title')
    artist = data.get('artist')

    with sqlite3.connect(DATABASE) as conn:
        c = conn.cursor()
        c.execute('INSERT INTO songs (title, artist, votes) VALUES (?, ?, 0)', (title, artist))
        conn.commit()
        song_id = c.lastrowid

    return jsonify({"id": song_id, "title": title, "artist": artist, "votes": 0})

@app.route('/songs/<int:song_id>/vote', methods=['POST'])
def vote_song(song_id):
    with sqlite3.connect(DATABASE) as conn:
        c = conn.cursor()
        c.execute('UPDATE songs SET votes = votes + 1 WHERE id = ?', (song_id,))
        conn.commit()
        c.execute('SELECT * FROM songs WHERE id = ?', (song_id,))
        updated_song = c.fetchone()

    return jsonify({"id": updated_song[0], "title": updated_song[1], "artist": updated_song[2], "votes": updated_song[3]})

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
