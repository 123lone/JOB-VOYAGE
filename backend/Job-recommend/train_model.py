from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pymongo
import joblib
import numpy as np
from collections import Counter
import os

# Connect to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client['JobVoyage']
user_collection = db['users']
job_collection = db['jobs']

# Fetch data
users = list(user_collection.find())
jobs = list(job_collection.find())

# Prepare data with validation and sets for exact matching
user_skills_list = []
user_skills_sets = []
for user in users:
    skills = user.get('profile', {}).get('skills', [])
    if not skills or not isinstance(skills, list):
        user_skills_list.append("")
        user_skills_sets.append(set())
    else:
        cleaned_skills = [skill.lower().strip() for skill in skills if skill.strip()]
        user_skills_list.append(" ".join(cleaned_skills))
        user_skills_sets.append(set(cleaned_skills))

job_requirements_list = []
job_requirements_sets = []
for job in jobs:
    reqs = job.get('requirements', [])
    if not reqs or not isinstance(reqs, list):
        job_requirements_list.append("")
        job_requirements_sets.append(set())
    else:
        cleaned_reqs = [req.lower().strip() for req in reqs if req.strip()]
        job_requirements_list.append(" ".join(cleaned_reqs))
        job_requirements_sets.append(set(cleaned_reqs))

# Filter valid entries
valid_users = [(i, skills, skill_set) for i, (skills, skill_set) in enumerate(zip(user_skills_list, user_skills_sets)) if skill_set]
valid_jobs = [(i, reqs, req_set) for i, (reqs, req_set) in enumerate(zip(job_requirements_list, job_requirements_sets)) if req_set]
if not valid_users or not valid_jobs:
    raise ValueError("No valid user skills or job requirements found")

user_indices, user_skills_list, user_skills_sets = zip(*valid_users)
job_indices, job_requirements_list, job_requirements_sets = zip(*valid_jobs)

# TF-IDF Vectorization
all_text = list(user_skills_list) + list(job_requirements_list)
tfidf = TfidfVectorizer(stop_words=None, lowercase=False)  # Already preprocessed
tfidf_matrix = tfidf.fit_transform(all_text)

# Split into user and job matrices
n_users = len(user_skills_list)
user_tfidf = tfidf_matrix[:n_users]
job_tfidf = tfidf_matrix[n_users:]

# Compute cosine similarity
similarity_matrix = cosine_similarity(user_tfidf, job_tfidf)

# Compute exact skill matches
match_counts = np.zeros((n_users, len(job_requirements_sets)))
for i, user_skills in enumerate(user_skills_sets):
    for j, job_reqs in enumerate(job_requirements_sets):
        match_counts[i, j] = len(user_skills.intersection(job_reqs))

# Save the model and data
output_dir = os.path.dirname(os.path.abspath(__file__))  # D:\JobVoyage-Website-main\backend\Job-recommend
os.makedirs(output_dir, exist_ok=True)

joblib.dump(tfidf, os.path.join(output_dir, 'tfidf_vectorizer.joblib'))
joblib.dump(similarity_matrix, os.path.join(output_dir, 'similarity_matrix.joblib'))
joblib.dump(match_counts, os.path.join(output_dir, 'match_counts.joblib'))
joblib.dump(jobs, os.path.join(output_dir, 'jobs_data.joblib'))
joblib.dump(list(user_indices), os.path.join(output_dir, 'user_indices.joblib'))
joblib.dump(list(job_indices), os.path.join(output_dir, 'job_indices.joblib'))

# Test recommendations
def get_recommendations(user_idx, top_n=5):
    matches = match_counts[user_idx]
    cos_scores = similarity_matrix[user_idx]
    valid_job_indices = np.where(matches > 0)[0]
    if len(valid_job_indices) == 0:
        return []
    sorted_indices = valid_job_indices[np.argsort(-matches[valid_job_indices])]
    if len(sorted_indices) > 1:
        tie_groups = Counter(matches[sorted_indices])
        final_indices = []
        for match_count in sorted(tie_groups.keys(), reverse=True):
            tie_indices = [i for i in sorted_indices if matches[i] == match_count]
            tie_indices = sorted(tie_indices, key=lambda i: cos_scores[i], reverse=True)
            final_indices.extend(tie_indices[:top_n - len(final_indices)])
            if len(final_indices) >= top_n:
                break
    else:
        final_indices = sorted_indices
    return [(jobs[job_indices[i]]['title'], matches[i], cos_scores[i]) for i in final_indices[:top_n]]

# Print sample output
print("ML model trained and saved successfully!")
print(f"Files saved to: {output_dir}")
for i in range(min(3, n_users)):
    print(f"User {i} recommendations:", get_recommendations(i))