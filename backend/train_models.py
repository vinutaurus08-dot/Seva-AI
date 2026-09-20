"""
Training script to build Random Forest & Decision Tree models for SevaAI.
Run this script to train and save models to the backend directory.
"""

import sys
import os
sys.path.insert(0, 'src')

import joblib
import json
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np

# --- Query Classification Training ---
# Categories: documents, eligibility, apply, deadline, website

training_queries = [
    # Documents
    ("What documents are required?", "documents"),
    ("What papers do I need?", "documents"),
    ("What certificates do I need?", "documents"),
    ("What should I submit?", "documents"),
    ("Document requirements", "documents"),
    ("What are the documents?", "documents"),
    ("What do I need to upload?", "documents"),
    
    # Eligibility
    ("Am I eligible?", "eligibility"),
    ("Who can apply?", "eligibility"),
    ("What are eligibility criteria?", "eligibility"),
    ("Can I apply for this?", "eligibility"),
    ("Do I qualify?", "eligibility"),
    ("What are the conditions?", "eligibility"),
    ("What's the eligibility?", "eligibility"),
    
    # Application Process
    ("How do I apply?", "apply"),
    ("What is the application process?", "apply"),
    ("How to submit application?", "apply"),
    ("What are the steps to apply?", "apply"),
    ("How do I submit?", "apply"),
    ("Tell me the process", "apply"),
    ("What is the procedure?", "apply"),
    
    # Deadline
    ("What is the last date?", "deadline"),
    ("When is the deadline?", "deadline"),
    ("What is the application deadline?", "deadline"),
    ("When does it close?", "deadline"),
    ("Last date to apply?", "deadline"),
    ("When is the last date?", "deadline"),
    
    # Website/Links
    ("What is the official website?", "website"),
    ("Where can I apply online?", "website"),
    ("What is the application link?", "website"),
    ("Official website?", "website"),
    ("Where do I go to apply?", "website"),
]

queries = [q[0] for q in training_queries]
categories = [q[1] for q in training_queries]

# Train TF-IDF Vectorizer
vectorizer = TfidfVectorizer(max_features=100, lowercase=True, stop_words='english')
X_train = vectorizer.fit_transform(queries)

# Train Random Forest for query classification
print("Training Random Forest for query classification...")
rf_model = RandomForestClassifier(n_estimators=20, random_state=42, max_depth=10)
rf_model.fit(X_train, categories)

# Train Decision Tree for query classification
print("Training Decision Tree for query classification...")
dt_model = DecisionTreeClassifier(random_state=42, max_depth=8)
dt_model.fit(X_train, categories)

# Save models and vectorizer
backend_dir = os.path.dirname(os.path.abspath(__file__))
joblib.dump(vectorizer, os.path.join(backend_dir, 'vectorizer.joblib'))
joblib.dump(rf_model, os.path.join(backend_dir, 'query_rf_model.joblib'))
joblib.dump(dt_model, os.path.join(backend_dir, 'query_dt_model.joblib'))

print("✓ Query classification models saved")
print("  - vectorizer.joblib")
print("  - query_rf_model.joblib")
print("  - query_dt_model.joblib")

# --- Eligibility Prediction Training ---
# Train a model to predict if a user is eligible for a scheme based on profile

eligibility_data = [
    # [age, income, is_student, is_unemployed] -> eligible (0=no, 1=yes)
    (25, 200000, 1, 0, 1),   # Young student, low income -> eligible
    (22, 150000, 1, 0, 1),   # Student, low income -> eligible
    (35, 500000, 0, 0, 0),   # Old, high income -> not eligible
    (45, 800000, 0, 0, 0),   # Old, very high income -> not eligible
    (28, 250000, 0, 1, 1),   # Unemployed, moderate income -> eligible
    (30, 180000, 0, 1, 1),   # Unemployed, low income -> eligible
    (55, 1000000, 0, 0, 0),  # Old, very high income -> not eligible
    (20, 100000, 1, 0, 1),   # Young student -> eligible
    (40, 300000, 0, 0, 0),   # Middle-aged, moderate income -> not eligible
    (18, 80000, 1, 0, 1),    # Very young student -> eligible
]

X_eligibility = np.array([d[:4] for d in eligibility_data], dtype=float)
y_eligibility = np.array([d[4] for d in eligibility_data])

# Train Random Forest for eligibility prediction
print("\nTraining Random Forest for eligibility prediction...")
rf_eligibility = RandomForestClassifier(n_estimators=15, random_state=42, max_depth=8)
rf_eligibility.fit(X_eligibility, y_eligibility)

# Train Decision Tree for eligibility prediction
print("Training Decision Tree for eligibility prediction...")
dt_eligibility = DecisionTreeClassifier(random_state=42, max_depth=6)
dt_eligibility.fit(X_eligibility, y_eligibility)

# Save eligibility models
joblib.dump(rf_eligibility, os.path.join(backend_dir, 'eligibility_rf_model.joblib'))
joblib.dump(dt_eligibility, os.path.join(backend_dir, 'eligibility_dt_model.joblib'))

print("✓ Eligibility prediction models saved")
print("  - backend/eligibility_rf_model.joblib")
print("  - backend/eligibility_dt_model.joblib")

print("\n✅ All models trained successfully!")
print("\nModel Configuration:")
print("  Query Classification: RandomForest (20 trees) + DecisionTree (depth=8)")
print("  Eligibility Prediction: RandomForest (15 trees) + DecisionTree (depth=6)")
