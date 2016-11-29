const randomColor = require(`../lib/randomColor.js`);

module.exports.register = (server, options, next) => {

  const io = require(`socket.io`)(server.listener);

  const users = [];

  io.on(`connection`, socket => {

    const {id: socketId} = socket;
    console.log(socketId);

    const user = {
      socketId,
      color: randomColor.generate()
    };

    users.push(user);
    console.log(users);

    socket.emit(`init`, user);

    socket.on(`noteplayed`, note => {
      io.emit(`playnote`, note);
    });

    socket.on(`notereleased`, note => {
      io.emit(`releasenote`, note);
    });

  });

  next();

};

module.exports.register.attributes = {
  name: `teamkeys`,
  version: `0.1.0`
};
