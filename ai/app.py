import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import logging
import traceback
import re  # Import the regular expression module


# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')
app.logger.setLevel(logging.DEBUG)

# Read API key and URL from .env file
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = os.getenv("GROQ_API_URL")


def sanitize_input(text):
    """Removes non-alphanumeric characters and limits length."""
    text = re.sub(r'[^\w\s]', '', text)  # Remove non-alphanumeric
    return text[:500]  # Limit length to prevent abuse


def call_groq_api(user_input, api_key=GROQ_API_KEY, api_url=GROQ_API_URL):
    """
    Encapsulates the Groq API call.
    """
    prompt_prefix = """You are a helpful and concise assistant on a job portal. Your purpose is to assist job seekers with questions related to:

*   Finding relevant job postings
*   Creating effective resumes and cover letters
*   Preparing for job interviews
*   Information about companies listed on the job portal
*   Navigating the job portal website

If a user asks a question that is NOT related to these topics, respond with: "I'm sorry, I can only answer questions related to job searching and the job portal."

Keep your answers brief and to the point, ideally no more than 3-4 sentences.
Format the answer as a clear, readable list or concise paragraph, avoiding bullet points or asterisks.
Do not add any introductory or concluding phrases ("I can help you with that!", "In conclusion," etc.). Just directly answer the user's question.
"""

    full_prompt = prompt_prefix + "\n" + user_input  # Prepend the prompt

    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    payload = {
        "model": "llama3-8b-8192",  # Update based on your Groq model
        "messages": [{"role": "user", "content": full_prompt}]  # Use the combined prompt
    }

    try:
        response = requests.post(GROQ_API_URL, headers=headers, json=payload)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        return response.json()  # Return the JSON response
    except requests.exceptions.RequestException as e:
        raise Exception(f"Groq API request failed: {str(e)}")  # Re-raise as a generic Exception


def truncate_response(text, max_sentences=3):
    """Truncates a text to a maximum number of sentences."""
    sentences = re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s', text) # Splits correctly even on abreviations
    return " ".join(sentences[:max_sentences])


@app.route("/chat", methods=["POST"])
def chat():
    try:
        # Check for API Key and URL early
        if not GROQ_API_KEY:
            app.logger.error("GROQ_API_KEY is not set in the environment.")
            return jsonify({"error": "Server configuration error: GROQ_API_KEY not set."}), 500

        if not GROQ_API_URL:
            app.logger.error("GROQ_API_URL is not set in the environment.")
            return jsonify({"error": "Server configuration error: GROQ_API_URL not set."}), 500


        user_input = request.json.get("message")
        if not user_input:
            app.logger.warning("No message provided")  # Log warning
            return jsonify({"error": "No message provided"}), 400

        # Sanitize Input
        user_input = sanitize_input(user_input.strip())  # Sanitize user input

        # Call the Groq API using the encapsulated function
        try:
            groq_response = call_groq_api(user_input, GROQ_API_KEY)

            bot_reply = groq_response.get("choices", [{}])[0].get("message", {}).get("content", "")
            bot_reply = truncate_response(bot_reply) # Truncate the response

            return jsonify({"reply": bot_reply})

        except Exception as e:  # Handle exceptions from call_groq_api
            app.logger.error(f"Groq API error: {str(e)}")
            return jsonify({"error": f"Groq API error: {str(e)}"}), 500


    except Exception as e:
        traceback.print_exc()  # Print traceback to console
        app.logger.error(f"Error in /chat route: {str(e)}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)