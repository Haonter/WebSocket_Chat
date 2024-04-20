// Obtener el host y puerto del entorno proporcionado por Vercel
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 5501;

// Construir la URL del WebSocket
const wsUrl = `ws://${host}:${port}`;

// Crear una nueva instancia de WebSocket utilizando la URL construida
const ws = new WebSocket(wsUrl);

// Se maneja el evento onmessage, que se dispara cuando el servidor envía un mensaje
ws.onmessage = (event) => {
    // Se obtiene el elemento de la lista de mensajes y se crea un nuevo elemento de lista
    const chat = document.getElementById('chat');
    const mensaje = document.createElement('li');

    // Parsear el objeto JSON
    const data = JSON.parse(event.data);
    // console.log(data);

    // Mostrar el nombre del cliente y el mensaje
    mensaje.innerText = `${data.nombre}: ${data.mensaje}`;
    chat.appendChild(mensaje);

    // Mover el scroll hacia abajo cada vez que llega un mensaje
    chat.scrollTop = chat.scrollHeight;
};




// Funcion para enviar mensajes al servidor
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value;

    // Añana el mensaje del cliente al chat
    const chat = document.getElementById('chat');
    const mensaje = document.createElement('li');
    mensaje.innerText = `Tú: ${message}`;
    chat.appendChild(mensaje);

    ws.send(message);
    input.value = '';
}

const btnEnviar = document.getElementById('enviar').addEventListener('click', sendMessage);
window.addEventListener('keypress', (e) => e.key === 'Enter' ? sendMessage() : null );