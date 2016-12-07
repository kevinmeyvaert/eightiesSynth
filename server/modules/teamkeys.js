const randomColor = require(`../lib/randomColor.js`);

module.exports.register = (server, options, next) => {

  const io = require(`socket.io`)(server.listener);

  let users = [];

  io.on(`connection`, socket => {

    const {id: socketId} = socket;
    console.log(socketId);

    const user = {
      socketId,
      color: randomColor.generate()
    };

    users.push(user);
    console.log(users);

    socket.emit(`init`, users);
    socket.broadcast.emit(`join`, user);

    socket.on(`disconnect`, () => {
      users = users.filter(u => u.socketId !== socketId);
      socket.broadcast.emit(`leave`, socketId);
      //iedereen behalve zichtzelf : broadcast
    });

    socket.on(`reverbchanged`, reverbInput => {
      console.log(reverbInput);
      io.emit(`changeReverb`, reverbInput);
    });

    socket.on(`noteplayed`, note => {
      io.emit(`playnote`, {note, socketId});
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
