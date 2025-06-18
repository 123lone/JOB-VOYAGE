from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pymongo
from bson.objectid import ObjectId
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Configure CORS
CORS(app, resources={
    r"/predict": {
        "origins": ["http://localhost:3000", "http://localhost:5000"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

# Connect to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['JobVoyage']
job_collection = db['jobs']

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse the request data
        data = request.get_json()
        if not data:
            logger.error("No JSON data provided in request")
            return jsonify({'error': 'No JSON data provided'}), 400

        user_skills = data.get('skills', [])
        if not user_skills:
            logger.warning("No skills provided in request")
            return jsonify({'recommended_jobs': []}), 200

        # Normalize user skills
        user_skills_set = set(skill.lower().strip() for skill in user_skills if skill.strip())
        logger.info(f"User skills: {user_skills_set}")

        # Fetch the latest jobs from the database
        jobs = list(job_collection.find())
        if not jobs:
            logger.warning("No jobs found in the database")
            return jsonify({'recommended_jobs': []}), 200

        # Preprocess jobs data
        job_texts = []
        job_requirements_sets = []
        for job in jobs:
            # Convert ObjectId to string for '_id'
            job['_id'] = str(job['_id'])
            # Handle 'company' field (assume it’s a string or dict; adjust if it’s an ObjectId)
            if isinstance(job.get('company'), ObjectId):
                job['company'] = str(job['company'])

            reqs = job.get('requirements', [])
            if not isinstance(reqs, list):
                logger.warning(f"Job {job.get('title', 'Unknown')} has invalid requirements: {reqs}")
                reqs = []
            cleaned_reqs = [req.lower().strip() for req in reqs if req.strip()]
            job_texts.append(" ".join(cleaned_reqs))
            job_requirements_sets.append(set(cleaned_reqs))

        logger.info(f"Number of jobs processed: {len(jobs)}")

        # Check if there are any job requirements to process
        if not job_texts:
            logger.warning("No valid job requirements to process")
            return jsonify({'recommended_jobs': []}), 200

        # Fit a new TF-IDF vectorizer on the current job requirements
        tfidf = TfidfVectorizer(stop_words=None, lowercase=False)
        tfidf.fit(job_texts)
        logger.info(f"TF-IDF vectorizer fitted on {len(job_texts)} job requirement texts")

        # Transform user skills and job requirements
        user_text = ' '.join(user_skills)
        user_tfidf = tfidf.transform([user_text])
        job_tfidf = tfidf.transform(job_texts)
        logger.info(f"TF-IDF shapes - User: {user_tfidf.shape}, Jobs: {job_tfidf.shape}")

        # Compute cosine similarity
        user_similarity = cosine_similarity(user_tfidf, job_tfidf)[0]
        logger.info(f"Cosine similarity scores: {user_similarity}")

        # Compute exact skill matches
        match_counts = np.array([len(user_skills_set.intersection(job_reqs))
                                for job_reqs in job_requirements_sets])
        logger.info(f"Match counts: {match_counts}")

        # Find jobs with at least one match
        valid_indices = np.where(match_counts > 0)[0]
        logger.info(f"Valid indices (jobs with matches): {valid_indices}")
        if len(valid_indices) == 0:
            logger.info("No jobs matched the user's skills")
            return jsonify({'recommended_jobs': []}), 200

        # Sort by match count (primary) and cosine similarity (secondary)
        sorted_indices = valid_indices[np.argsort(-match_counts[valid_indices])]
        final_indices = []
        for count in sorted(set(match_counts[valid_indices]), reverse=True):
            tie_indices = [i for i in sorted_indices if match_counts[i] == count]
            tie_indices.sort(key=lambda i: user_similarity[i], reverse=True)
            final_indices.extend(tie_indices)
            if len(final_indices) >= 5:
                break

        # Prepare recommended jobs
        recommended_jobs = []
        for idx in final_indices[:5]:
            job = jobs[idx]
            company_value = job.get('company', 'Unknown')
            company_name = (company_value if isinstance(company_value, str) else
                           company_value.get('name', 'Unknown') if isinstance(company_value, dict) else 'Unknown')
            job_data = {
                '_id': job['_id'],
                'title': job.get('title', 'No title'),
                'description': job.get('description', 'No description'),
                'requirements': job.get('requirements', []),
                'salary': job.get('salary', 'Not Provided'),
                'location': job.get('location', 'Not Provided'),
                'jobType': job.get('jobType', 'Not Provided'),
                'company': {'name': company_name},
                'match_count': int(match_counts[idx]),
                'similarity_score': float(user_similarity[idx])
            }
            recommended_jobs.append(job_data)

        logger.info(f"Recommended jobs: {recommended_jobs}")
        return jsonify({'recommended_jobs': recommended_jobs}), 200

    except Exception as e:
        logger.error(f"Error in predict endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)