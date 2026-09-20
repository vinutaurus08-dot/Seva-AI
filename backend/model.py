import os
import joblib
import numpy as np
from typing import Optional, Any

# ML models: Random Forest & Decision Tree for query classification
vectorizer = None
rf_query_model = None
dt_query_model = None
rf_eligibility_model = None
dt_eligibility_model = None

# Hard-coded answers for each query category
CATEGORY_ANSWERS = {
    "documents": "📄 Based on our database, here are the typical documents needed:\n• Aadhaar Card\n• Income Certificate\n• Caste/Community Certificate\n• Educational Documents\n• Bank Passbook\n• Passport Size Photos",
    
    "eligibility": "✅ Eligibility depends on your profile:\n• Age range\n• Annual income\n• Category (SC/ST/OBC/General)\n• Gender\n• Occupation\n• State\nUpdate your profile to get personalized eligibility information.",
    
    "apply": "📝 General process to apply:\n1. Visit the official website\n2. Register or login\n3. Fill application form\n4. Upload required documents\n5. Submit application\n6. Note your application ID for tracking",
    
    "deadline": "🗓️ Different schemes have different deadlines. Check the specific scheme page for the exact last date to apply.",
    
    "website": "🌐 You can apply directly on the scheme's official website. Check the scheme details page for the application link."
}


def load_model() -> dict:
    """Load Random Forest & Decision Tree models from disk."""
    global vectorizer, rf_query_model, dt_query_model, rf_eligibility_model, dt_eligibility_model
    
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    
    models_loaded = False
    try:
        # Load query classification models
        vectorizer = joblib.load(os.path.join(backend_dir, 'vectorizer.joblib'))
        rf_query_model = joblib.load(os.path.join(backend_dir, 'query_rf_model.joblib'))
        dt_query_model = joblib.load(os.path.join(backend_dir, 'query_dt_model.joblib'))
        
        # Load eligibility prediction models
        rf_eligibility_model = joblib.load(os.path.join(backend_dir, 'eligibility_rf_model.joblib'))
        dt_eligibility_model = joblib.load(os.path.join(backend_dir, 'eligibility_dt_model.joblib'))
        
        models_loaded = True
        print("✓ ML Models loaded: Random Forest & Decision Tree")
    except FileNotFoundError:
        print("⚠️  ML models not found. Run: python backend/train_models.py")
    
    return {
        'loaded': models_loaded,
        'vectorizer': vectorizer,
        'rf_query': rf_query_model,
        'dt_query': dt_query_model,
        'rf_eligibility': rf_eligibility_model,
        'dt_eligibility': dt_eligibility_model,
    }


def predict_answer(model: dict, query: str, scheme_id: Optional[int] = None, mode: str = "assistant") -> str:
    """
    Use Random Forest to classify query and return appropriate answer.
    Falls back to Decision Tree if Random Forest has low confidence.
    """
    if not model.get('loaded'):
        return f"[Backend not configured] {query}"
    
    try:
        # Vectorize the query
        query_vector = model['vectorizer'].transform([query])
        
        # Get Random Forest prediction with probability
        if model['rf_query'] is not None:
            probabilities = model['rf_query'].predict_proba(query_vector)[0]
            max_prob = np.max(probabilities)
            category = model['rf_query'].predict(query_vector)[0]
            
            # If Random Forest confidence < 0.5, use Decision Tree
            if max_prob < 0.5 and model['dt_query'] is not None:
                category = model['dt_query'].predict(query_vector)[0]
                confidence_source = "Decision Tree"
            else:
                confidence_source = "Random Forest"
            
            # Return category-based answer
            answer = CATEGORY_ANSWERS.get(category, CATEGORY_ANSWERS['apply'])
            
            return f"{answer}\n\n[Predicted by: {confidence_source}]"
    
    except Exception as e:
        print(f"ML prediction error: {e}")
    
    return f"[Fallback] Unable to process: {query}"


def predict_eligibility(profile: dict) -> dict:
    """
    Use Random Forest to predict eligibility score.
    """
    if rf_eligibility_model is None:
        return {'eligible': None, 'score': 0, 'method': 'local'}
    
    try:
        # Prepare features: [age, income, is_student, is_unemployed]
        age = profile.get('age', 30)
        income = profile.get('income', 200000)
        is_student = 1 if profile.get('education', '').lower() in ['graduate', 'student'] else 0
        is_unemployed = 1 if profile.get('occupation', 'student') == 'student' else 0
        
        features = np.array([[age, income, is_student, is_unemployed]], dtype=float)
        
        # Random Forest prediction
        rf_pred = rf_eligibility_model.predict(features)[0]
        rf_prob = rf_eligibility_model.predict_proba(features)[0][1]
        
        # Decision Tree prediction (for confirmation)
        dt_pred = dt_eligibility_model.predict(features)[0]
        
        eligible = bool(rf_pred)
        score = int(rf_prob * 100)
        
        return {
            'eligible': eligible,
            'score': score,
            'method': 'Random Forest',
            'dt_confirms': bool(dt_pred) == eligible
        }
    except Exception as e:
        print(f"Eligibility prediction error: {e}")
        return {'eligible': None, 'score': 0, 'method': 'error'}
