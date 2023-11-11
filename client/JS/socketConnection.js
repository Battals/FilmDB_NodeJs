
const socket = io();

socket.on("connect", () => {
  socket.emit("clientConnected");

  socket.on("connectedClientsCount", (connectedClients) => {
    const clientsElement = document.getElementById("connectedClientsCount");
    clientsElement.textContent = `Antal besøgende: ${connectedClients}`;
  });
});

export {socket}