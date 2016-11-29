module.exports.register = (server, options, next) => {

  const io = require(`socket.io`)(server.listener);

  io.on(`connection`, socket => {


  });

  next();

};

module.exports.register.attributes = {
  name: `teamkeys`,
  version: `0.1.0`
};
