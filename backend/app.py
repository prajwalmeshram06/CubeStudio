from flask import Flask, request, jsonify
from flask_cors import CORS
import kociemba

app = Flask(__name__)
CORS(app)


@app.get('/')
def home():
    return {
        "status": "backend running"
    }


@app.post('/solve')
def solve():

    try:
        data = request.get_json() or {}

        cube = data.get('cube', '').strip()

        if len(cube) != 54:
            return jsonify({
                "error": "Cube string must be exactly 54 characters"
            }), 400
        print("Cube:", cube)
        print("Length:", len(cube))

        solution = kociemba.solve(cube)

        print("Solution:", solution)
        
        return jsonify({
            "solution": solution
        })


    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 400



if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=8000,
        debug=True
    )