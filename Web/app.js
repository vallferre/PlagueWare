const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const fileInfo = document.getElementById('file-info');

// Cuando se hace clic en el área de carga
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// Cuando se selecciona un archivo
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // Mostrar información del archivo
        fileInfo.textContent = `Archivo: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        
        // Mostrar vista previa de la imagen
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Para el efecto de arrastrar y soltar
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = '#e8f5e9';
    uploadArea.style.borderColor = '#4caf50';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.backgroundColor = '#f1f8e9';
    uploadArea.style.borderColor = '#81c784';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.backgroundColor = '#f1f8e9';
    uploadArea.style.borderColor = '#81c784';
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        fileInput.files = e.dataTransfer.files;
        
        // Mostrar información del archivo
        fileInfo.textContent = `Archivo: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        
        // Mostrar vista previa de la imagen
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

const closeBtn = document.getElementById('close-btn');
const previewContainer = document.querySelector('.preview-container');

// Función para resetear la vista previa
function resetPreview() {
    imagePreview.src = '';
    imagePreview.style.display = 'none';
    fileInfo.textContent = '';
    previewContainer.style.display = 'none';
    fileInput.value = ''; // Limpia el input file
}

// Evento para el botón de cerrar
closeBtn.addEventListener('click', resetPreview);
        
// Modifica tu evento change para mostrar el contenedor
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        fileInfo.textContent = `Archivo: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            imagePreview.src = event.target.result;
            imagePreview.style.display = 'block';
            previewContainer.style.display = 'block'; // Muestra el contenedor
        };
        reader.readAsDataURL(file);
    }
});

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