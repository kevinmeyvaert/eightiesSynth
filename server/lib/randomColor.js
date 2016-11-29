module.exports.generate = () => {
  let random = Math.random();
  const exponent = -- random.toExponential().split(`-`)[1];

  random *= Math.pow(10, exponent);

  return `#${  (~ ~ (random * (1 << 24))).toString(16)}`;
};
