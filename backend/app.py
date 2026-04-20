from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os

app = Flask(__name__)

# Get the directory where app.py is located
base_path = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_path, 'model.pkl')

# Load the model using the full path
model = joblib.load(model_path)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        # Create a DataFrame with the exact column names from your CSV
        input_data = pd.DataFrame([{
            'base_probability': data['base_probability'],
            'familyHistory': data['familyHistory'],
            'hasAffectedChild': data['hasAffectedChild']
        }])
        
        prediction = model.predict(input_data)
        
        # Ensure the probability stays between 0 and 1
        result = max(0, min(1, prediction[0]))
        
        return jsonify({'probability': round(float(result), 3)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Use port 5001 to avoid conflict with your Node.js (5000)
    app.run(port=5001, debug=True)