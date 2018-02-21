const createStreamIterator = require('stream-async-iterator');

module.exports = function createLineIterator(stream) {
  let lines = [];
  let done = false;
  let leftover = '';
  const iterator = createStreamIterator(stream);
  const delimiter = stream.isTTY ? '\r' : /\r?\n/;

  async function next() {
    if (lines.length > 0) {
      return { done: lines.length === 1 && done, value: lines.shift() };
    }
    let value;
    ({ done, value } = await iterator.next());
    lines.push(...(leftover + (value || '')).split(delimiter));
    leftover = done ? null : lines.pop();
    //console.log({ lines, leftover });
    return next();
  }

  return { next };
}
