from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# This will hold the queue of songs (in memory)
queue = []

# Route to handle song requests (POST)
@app.route("/api/request", methods=["POST"])
def request_song():
    data = request.get_json()  # Get the request data from the body
    song = data.get("song")  # Extract the song name from the data

    if song:
        # If song is provided, add it to the queue with 0 votes
        queue.append({"song": song, "votes": 0})
        print(f"Song added: {song}")  # Log the song that was added
        return jsonify({"message": "Song received"}), 200  # Return success message
    else:
        # If no song is provided, return an error
        return jsonify({"error": "No song provided"}), 400

# Route to fetch the current song queue (GET)
@app.route("/api/requests", methods=["GET"])
def get_queue():
    print("Returning queue:", queue)  # Log the queue when fetching
    return jsonify(queue)  # Return the song queue in JSON format

# Route to handle root URL (GET)
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to the QueueUp backend!"})

# Run the app
if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Run the Flask app on port 5000
