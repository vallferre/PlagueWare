// Elementos del DOM
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const fileInfo = document.getElementById('file-info');
const previewContainer = document.querySelector('.preview-container');
const closeBtn = document.getElementById('close-btn');
const loadingOverlay = document.getElementById('loading-overlay');
const API_URL = "http://192.168.0.107:7860/predict";

// --- Funciones principales ---
/**
 * Envía la imagen a la API de Colab y muestra el resultado
 */
async function predictDisease(imageFile) {
    const resultElement = document.getElementById('api-result') || createResultElement();
    
    try {
        showLoading(true);
        
        const formData = new FormData();
        formData.append('image', imageFile); 

        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error(`Error en la API: ${response.status}`);
        
        const result = await response.json();
        const prediction = result.class || "Sin resultado";

        showPredictionResult(resultElement, prediction);


    } catch (error) {
        showError(resultElement, error);
    } finally {
        showLoading(false);
    }
}

/**
 * Crea el elemento para mostrar resultados
 */
function createResultElement() {
    const element = document.createElement('div');
    element.id = 'api-result';
    element.className = 'prediction-result';
    document.querySelector('.file-info').after(element);
    return element;
}

/**
 * Muestra el resultado de la predicción
 */
function showPredictionResult(element, prediction) {
    element.innerHTML = `
        <div class="result-header">
            <span class="diagnosis-icon">🌿</span>
            <h3>Resultado del diagnóstico</h3>
        </div>
        <div class="result-content">
            <p><strong>Enfermedad detectada:</strong> ${prediction}</p>
            <p class="confidence">Confianza: 85%</p> <!-- Puedes añadir esto si tu modelo lo soporta -->
        </div>
    `;
}

/**
 * Muestra errores
 */
function showError(element, error) {
    element.innerHTML = `
        <div class="error-message">
            <span>⚠️</span>
            <p>${error.message || 'Error al procesar la imagen'}</p>
        </div>
    `;
}

/**
 * Controla el estado de carga
 */
function showLoading(show) {
    loadingOverlay.style.display = show ? 'flex' : 'none';
    uploadArea.style.pointerEvents = show ? 'none' : 'auto';
}

// --- Event Listeners Mejorados ---

// Gestión de la subida de archivos
fileInput.addEventListener('change', handleFileSelect);
uploadArea.addEventListener('click', () => fileInput.click());

// Drag & Drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFileSelect({ target: fileInput });
    }
});

// Cerrar vista previa
closeBtn.addEventListener('click', resetPreview);

// --- Funciones de apoyo ---

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Mostrar información del archivo
    fileInfo.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
    
    // Mostrar vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        previewContainer.style.display = 'block';
        
        // Eliminar resultado anterior
        const oldResult = document.getElementById('api-result');
        if (oldResult) oldResult.remove();
        
        // Enviar a la API
        predictDisease(file);
    };
    reader.readAsDataURL(file);
}

function resetPreview() {
    imagePreview.src = '';
    previewContainer.style.display = 'none';
    fileInput.value = '';
    fileInfo.textContent = '';
    const result = document.getElementById('api-result');
    if (result) result.remove();
}

// Chatbot
const chatbotButton = document.getElementById('chatbot-button');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotSend = document.querySelector('.chatbot-send');
const chatbotInput = document.querySelector('.chatbot-input');

// Alternar visibilidad del chat
chatbotButton.addEventListener('click', () => {
  chatbotWindow.style.display = chatbotWindow.style.display === 'flex' ? 'none' : 'flex';
});

// Cerrar el chat
chatbotClose.addEventListener('click', () => {
  chatbotWindow.style.display = 'none';
});

// Enviar mensaje (función básica)
chatbotSend.addEventListener('click', () => {
  if (chatbotInput.value.trim() !== '') {
    // Aquí iría la lógica para enviar el mensaje
    console.log("Mensaje enviado:", chatbotInput.value);
    chatbotInput.value = '';
  }
});

// Permitir enviar con Enter
chatbotInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    chatbotSend.click();
  }
});

document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById('file-input');
    const loadingOverlay = document.getElementById('loading-overlay');
    const previewContainer = document.querySelector('.preview-container');
    const imagePreview = document.getElementById('image-preview');
    const fileInfo = document.getElementById('file-info');
    const closeBtn = document.getElementById('close-btn');

    if (fileInput) {
        fileInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                loadingOverlay.style.display = 'flex';

                const reader = new FileReader();
                reader.onload = function (e) {
                    setTimeout(() => {
                        loadingOverlay.style.display = 'none';
                        imagePreview.src = e.target.result;
                        imagePreview.style.display = 'block';
                        previewContainer.style.display = 'block';
                        fileInfo.textContent = `Archivo: ${file.name}`;
                    }, 2000); // Simula 2 segundos de procesamiento
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            imagePreview.src = '';
            imagePreview.style.display = 'none';
            previewContainer.style.display = 'none';
            fileInput.value = '';
            fileInfo.textContent = '';
        });
    }
});
