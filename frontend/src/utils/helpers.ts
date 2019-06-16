export function randomString() {
  return (
    Math.random()
    .toString(36)
    .substring(2, 15) +
    Math.random()
    .toString(36)
    .substring(2, 15)
  );
}


export function randomNumber(min, max) {
  return Math.floor(Math.random() * (+max - +min)) + +min;
}
