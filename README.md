# AI-Powered Job Recommendation & Applicant Ranking Platform

This project is a full-stack web application that leverages machine learning and natural language processing to recommend jobs to users based on their skills and rank applicants for jobs using resume analysis.

## Features

- **User Authentication:** Secure signup/login for job seekers and company admins.
- **Job Posting & Management:** Companies can post, edit, and delete jobs.
- **Job Application:** Users can apply for jobs and upload resumes.
- **AI Job Recommendations:** Personalized job suggestions based on user skills using ML models.
- **Applicant Ranking:** Automated ranking of applicants for jobs using resume analysis.
- **Company Management:** Admin dashboard for managing companies and job postings.
- **Skill-Based Search & Suggestions:** NLP-powered job title and skill suggestions.

## Tech Stack

- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB
- **Machine Learning:** Python (scikit-learn, joblib), NLP
- **Inter-process Communication:** REST API, Python child process (for ranking)
- **Authentication:** JWT, Cookies

## Project Structure

```
ai/
  .env
  app.py                # Python FastAPI ML microservice for job recommendations
backend/
  .env
  package.json
  server.js             # Express server entry point
  controllers/          # Route controllers (jobs, applications, ranking, etc.)
  Job-recommend/
    ml_service.py       # ML logic for job recommendations
    job_indices.joblib  # Pre-trained job indices
    job_requirements_sets.joblib
  middlewares/          # Express middlewares (auth, etc.)
  ml-model/
    rank_resumes.py     # Python script for applicant ranking
  models/               # Mongoose models (User, Job, Company, Application)
  routes/               # Express route definitions
  uploads/              # Resume uploads
  utils/
    nlpProcessor.js     # NLP job title/skill suggestions
frontend/
  src/
    App.jsx             # React app entry point
    components/         # UI components
```

## Setup Instructions

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/ai-job-platform.git
cd ai-job-platform
```

### 2. Backend Setup

```sh
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and other secrets
npm run dev
```

### 3. Frontend Setup

```sh
cd frontend
npm install
npm run dev
```

### 4. ML Service Setup

```sh
cd ai
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MongoDB URI and other secrets
python app.py
```

### 5. MongoDB

Ensure MongoDB is running locally on `localhost:27017` or update your `.env` files accordingly.

## API Endpoints

- **User:** `/api/user/*`
- **Company:** `/api/company/*`
- **Job:** `/api/job/*`
- **Application:** `/api/application/*`
- **Email:** `/api/email/*`
- **Ranking:** `/api/job/get-recommended-jobs`, `/api/job/:id/rank-applicants`

## Machine Learning

- **Job Recommendation:** `ai/app.py` & `backend/Job-recommend/ml_service.py`
- **Applicant Ranking:** `backend/ml-model/rank_resumes.py`

## NLP Suggestions

- Job title and skill suggestions powered by `backend/utils/nlpProcessor.js`.

## License

MIT

---

For more details, see the source code and comments in each
