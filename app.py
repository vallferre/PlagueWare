from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from PIL import Image
import numpy as np
import tflite_runtime.interpreter as tflite
import io

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

# --- Cargar modelo TFLite ---
interpreter = tflite.Interpreter(model_path="model/plant_disease_model.tflite")
interpreter.allocate_tensors()

# --- Cargar clases ---
with open("model/classes.txt", "r") as f:
    CLASSES = [line.strip() for line in f.readlines()]

# --- Páginas web ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/main')
def main():
    return render_template('main.html')

# --- Endpoint de predicción ---
@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No se envió imagen'}), 400

    file = request.files['image']
    image = Image.open(file.stream).convert('RGB').resize((224, 224))
    input_data = np.array(image, dtype=np.float32)
    input_data = np.expand_dims(input_data, axis=0)

    input_index = interpreter.get_input_details()[0]['index']
    output_index = interpreter.get_output_details()[0]['index']

    interpreter.set_tensor(input_index, input_data)
    interpreter.invoke()
    output = interpreter.get_tensor(output_index)

    predicted_class = CLASSES[np.argmax(output)]
    return jsonify({'class': predicted_class})

# --- Iniciar servidor ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7860)