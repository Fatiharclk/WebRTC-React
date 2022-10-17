const express = require("express");
const io = require("socket.io")({
  path: "/webrtc",
});

const app = express();
const port = 8080;

var UserList = [];

app.get("/", (req, res) => res.send("Server Online"));

const server = app.listen(port, () => {
  console.log(`WebRTC App is listening on port ${port}`);
});

io.listen(server);

const webRTCNamespace = io.of("/webRTCPeers");

webRTCNamespace.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("login", (data) => {
    UserList.push(data);
    console.log(UserList);
  });

  socket.on("user-list", () => {
    socket.broadcast.emit("user-list", UserList);
  });

  socket.emit("connection-success", {
    status: "connection-success",
    socketId: socket.id,
  });

  socket.on("sdp", (data) => {
    console.log(" data.name", data.name);
    socket.to(data.socketid).emit("call-name", data.name);
    socket.to(data.socketid).emit("sdp", data.sdp);
  });

  socket.on("sdp-broadcast", (data) => {
    socket.broadcast.emit("sdp", data.sdp);
  });

  socket.on("candidate", (data) => {
    socket.broadcast.emit("candidate", data);
  });

  socket.on("disconnect", () => {
    var filtered = UserList.filter(function (el) {
      return el.SocketID != socket.id;
    });

    UserList = filtered;
    socket.broadcast.emit("user-list", UserList);
  });
});
