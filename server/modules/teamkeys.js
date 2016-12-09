const randomColor = require(`../lib/randomColor.js`);

module.exports.register = (server, options, next) => {

  const io = require(`socket.io`)(server.listener);

  let users = [];

  const userInput = {
    reverb: ``,
    harmonicity: ``,
    attack: ``,
    decay: ``,
    sustain: ``,
    release: ``
  };

  io.on(`connection`, socket => {

    const {id: socketId} = socket;
    console.log(socketId);

    const user = {
      socketId,
      color: randomColor.generate()
    };

    users.push(user);
    console.log(users);

    socket.emit(`init`, users, userInput);
    socket.broadcast.emit(`join`, user);

    socket.on(`disconnect`, () => {
      users = users.filter(u => u.socketId !== socketId);
      socket.broadcast.emit(`leave`, socketId);
      //iedereen behalve zichtzelf : broadcast
    });

    socket.on(`reverbchanged`, reverbInput => {
      userInput.reverb = reverbInput;
      io.emit(`changeSliders`, userInput);
    });

    socket.on(`harmonicitychanged`, harmonicityInput => {
      userInput.harmonicity = harmonicityInput;
      io.emit(`changeSliders`, userInput);
    });

    socket.on(`attackchanged`, attackInput => {
      userInput.attack = attackInput;
      io.emit(`changeSliders`, userInput);
    });

    socket.on(`decaychanged`, decayInput => {
      userInput.decay = decayInput;
      io.emit(`changeSliders`, userInput);
    });

    socket.on(`sustainchanged`, sustainInput => {
      userInput.sustain = sustainInput;
      io.emit(`changeSliders`, userInput);
    });

    socket.on(`releasechanged`, releaseInput => {
      userInput.release = releaseInput;
      io.emit(`changeSliders`, userInput);
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
