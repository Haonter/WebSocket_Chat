const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: process.env.PORT || 5501 });


// Clase para representar un cliente
class Cliente {
  constructor(nombre, socket) {
    this.nombre = nombre;
    this.socket = socket;
  }
}

nombres = ['Diego', 'Gabriel', 'Jorge', 'Luis', 'Miguel', 'Juan', 'Diana', 'Andrea', 'Juana', 'Gabriela', 'Jose', 'Pedro', 'Carlos', 'Fernando', 'Ricardo', 'Sofia', 'Ana', 'Laura', 'Luisa', 'Camila', 'Valentina', 'Isabella', 'Mariana', 'Daniela', 'Alejandra', 'Natalia', 'Paola', 'Sara', 'Sandra', 'Carmen', 'Rosa'];

// Array para almacenar las conexiones de clientes (sockets)
const clientes = [];

wss.on('connection', (socket) => {

  // Crear un nuevo cliente con un nombre aleatorio
  const cliente = new Cliente(nombres[Math.floor(Math.random() * nombres.length)], socket);
  
  // Loggear la conexión del cliente y mostrar el estado de la conexión en el chat
  console.log(`${cliente.nombre} se ha unido al chat`);

  // Enviar un mensaje a todos los clientes para notificar que un nuevo usuario se ha unido al chat
  const datosConexion = JSON.stringify({
    nombre: 'Servidor',
    mensaje: `${cliente.nombre} se ha unido al chat`
  });

  clientes.map(cliente => {
    // Verificar que el cliente receptor esté conectado
    if (cliente.socket.readyState === WebSocket.OPEN) {
      cliente.socket.send(datosConexion);
    }
  });
  
  
  // Agregar el nuevo cliente a la lista de clientes
  clientes.push(cliente);


  // Manejar mensajes entrantes desde el cliente
  socket.on('message', (mensaje) => {
    console.log(`${cliente.nombre} dice: ${mensaje}`);

    // Creamos un JSON con el mensaje y el nombre del usuario que será enviado a todos los clientes
    const data = JSON.stringify({ 
      nombre: cliente.nombre, 
      mensaje: mensaje.toString()
    });

    // Reenviar el mensaje a todos los clientes conectados
    clientes.map(cliente => {
      // Verificar que el cliente esté conectado
      if (cliente.socket !== socket && cliente.socket.readyState === WebSocket.OPEN) {
        cliente.socket.send(data);
      }
    });
  });

  // Manejar cierre de conexión con el cliente
  socket.on('close', () =>{
    console.log(`${cliente.nombre} se ha ido del chat`);

    // Enviar un mensaje a todos los clientes para notificar que un usuario ha abandonado el chat
    const datosConexion = JSON.stringify({
      nombre: 'Servidor',
      mensaje: `${cliente.nombre} ha abandonado el chat`
    });

    clientes.map(cliente => {
      // Verificar que el cliente receptor esté conectado
      if (cliente.socket.readyState === WebSocket.OPEN) {
        cliente.socket.send(datosConexion);
      }
    });
    
    // Remover el cliente de la lista de clientes
    const index = clientes.indexOf(cliente);
    if (index > -1) {
      clientes.splice(index, 1);
    }
  });
});
