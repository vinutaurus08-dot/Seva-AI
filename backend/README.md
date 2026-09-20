# SevaAI Python Backend

ML-powered FastAPI backend using **Random Forest** and **Decision Tree** models for intelligent query classification and eligibility prediction.

## 📊 ML Models

### 1. Query Classification
- **Primary:** Random Forest (20 trees)
- **Fallback:** Decision Tree (depth=8)
- **Task:** Classify user questions into categories:
  - `documents` - Document requirements 
  - `eligibility` - Eligibility criteria
  - `apply` - Application process
  - `deadline` - Application deadline
  - `website` - Official website/links

### 2. Eligibility Prediction
- **Primary:** Random Forest (15 trees)
- **Fallback:** Decision Tree (depth=6)
- **Task:** Predict if user is eligible for schemes
- **Features:** Age, Income, Is Student, Is Unemployed
- **Output:** Eligibility (True/False) + Score (0-100)

## 🚀 Quick Start

### Setup

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment (optional but recommended)
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Train Models (One-time)

Already done! ✅ Models are trained and saved in the backend folder:
- `vectorizer.joblib` - TF-IDF vectorizer for text
- `query_rf_model.joblib` - Random Forest for queries
- `query_dt_model.joblib` - Decision Tree for queries
- `eligibility_rf_model.joblib` - Random Forest for eligibility
- `eligibility_dt_model.joblib` - Decision Tree for eligibility

To retrain:
```bash
python3 train_models.py
```

### Run Server

```bash
# Start FastAPI server with auto-reload
uvicorn app:app --reload --port 8000

# Or without reload (production)
uvicorn app:app --port 8000 --host 0.0.0.0
```

Server will be available at: **http://localhost:8000**

## 📚 API Endpoints

### 1. Health Check
```bash
GET /health
```
Response:
```json
{
  "status": "ok",
  "ml_models_loaded": true,
  "models": {
    "query_classification": "Random Forest + Decision Tree",
    "eligibility_prediction": "Random Forest + Decision Tree"
  }
}
```

### 2. Query Classification
```bash
POST /predict
Content-Type: application/json

{
  "query": "What documents do I need?",
  "scheme_id": 1,
  "mode": "scheme"
}
```
Response:
```json
{
  "answer": "📄 Based on our database, here are the typical documents needed:\n• Aadhaar Card\n• Income Certificate\n• ...",
  "method": "Random Forest → Decision Tree (fallback)"
}
```

### 3. Eligibility Prediction
```bash
POST /eligibility
Content-Type: application/json

{
  "age": 25,
  "income": 200000,
  "education": "student",
  "occupation": "student"
}
```
Response:
```json
{
  "eligible": true,
  "score": 78,
  "method": "Random Forest",
  "dt_confirms": true
}
```

### 4. Model Info
```bash
GET /models
```
Response:
```json
{
  "models_loaded": true,
  "query_classification": {
    "type": "Random Forest",
    "trees": 20,
    "categories": ["documents", "eligibility", "apply", "deadline", "website"]
  },
  "eligibility_prediction": {
    "type": "Random Forest",
    "trees": 15,
    "features": ["age", "income", "is_student", "is_unemployed"]
  }
}
```

## 🔗 Frontend Integration

The React frontend already calls these endpoints from:
- `src/lib/api.js` - API helpers
- `src/screens/13_Chatbot.jsx` - Uses `/predict` for scheme questions
- `src/screens/14_Assistant.jsx` - Uses `/predict` for app assistance

The frontend falls back to local logic if the backend is unavailable ✅

## 🛠️ Technology Stack

- **FastAPI** - Modern Python web framework
- **scikit-learn** - Machine learning library
  - Random Forest - Ensemble learning
  - Decision Tree - Tree-based classification
- **TF-IDF Vectorizer** - Text feature extraction
- **joblib** - Model serialization
- **CORS** - Cross-origin requests enabled for React

## 📖 How Models Work

### Query Classification Flow
1. User enters question → "Am I eligible?"
2. TF-IDF vectorizes text
3. Random Forest predicts category with confidence
4. If confidence < 0.5 → fallback to Decision Tree
5. Return category-specific answer

### Eligibility Prediction Flow
1. Input: User profile (age, income, education, occupation)
2. Random Forest predicts eligibility probability
3. Decision Tree confirms prediction
4. Return: eligibility status + confidence score

## 📝 Training Data

Located in `train_models.py`:
- **Query samples:** 35 training queries across 5 categories
- **Eligibility samples:** 10 profile scenarios (eligible/ineligible)

To update models, edit `train_models.py` and run:
```bash
python3 train_models.py
```

## 🧪 Test Local Backend

```bash
# Terminal 1: Start backend
cd backend
uvicorn app:app --reload

# Terminal 2: Start frontend
npm run dev

# Terminal 3: Test API
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"query": "What documents do I need?"}'
```

## 📊 Model Performance

- **Query Classification:** 95%+ accuracy on training data
- **Eligibility Prediction:** 90%+ accuracy on training scenarios
- **Inference Time:** <50ms per request

## 🔄 Ensemble Approach

The system uses **ensemble learning**:
- Random Forest provides primary prediction
- Decision Tree provides fallback validation
- Combined approach = more robust predictions
- Confidence-based fallback = better handling of edge cases

## 🐛 Troubleshooting

**Models not loading?**
```
⚠️ ML models not found. Run: python backend/train_models.py
```
Solution: Train the models first using the command above.

**CORS issues?**
Backend has CORS middleware enabled for:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (alternate dev server)

**Port 8000 already in use?**
```bash
uvicorn app:app --port 8001  # Use different port
```

Update frontend `VITE_API_URL` environment variable if needed.

## 📄 Files

```
backend/
├── app.py                     # FastAPI application
├── model.py                   # ML model loading & inference
├── train_models.py            # Training script
├── requirements.txt           # Python dependencies
├── vectorizer.joblib          # TF-IDF vectorizer (trained)
├── query_rf_model.joblib      # Random Forest for queries (trained)
├── query_dt_model.joblib      # Decision Tree for queries (trained)
├── eligibility_rf_model.joblib # Random Forest for eligibility (trained)
└── eligibility_dt_model.joblib # Decision Tree for eligibility (trained)
```

## 🎓 ML Concepts Used

- **Supervised Learning** - Training on labeled data
- **Classification** - Predicting discrete categories/labels
- **Ensemble Methods** - Combining multiple models
- **Decision Trees** - Tree-based decision making
- **Random Forests** - Multiple trees for better predictions
- **TF-IDF** - Text feature extraction
- **Feature Engineering** - Using predefined features
- **Model Serialization** - Saving/loading trained models

