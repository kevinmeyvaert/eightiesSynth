module.exports.register = (server, options, next) => {

  const io = require(`socket.io`)(server.listener);

  const users = [];
  const maxId = 0;

  io.on(`connection`, socket => {

    const {id: socketId} = socket;
    console.log(socketId);

    const user = {
      socketId,
      nickname: `user${maxId}`
    };

    users.push(user);

    socket.on(`noteplayed`, note => {
      socket.broadcast.emit(`playnote`, note);
    });

  });

  next();

};

module.exports.register.attributes = {
  name: `teamkeys`,
  version: `0.1.0`
};
