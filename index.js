const createStreamIterator = require('stream-async-iterator');

module.exports = function createLineIterator(stream) {
  let lines = [];
  let done = false;
  let leftover = '';
  const iterator = createStreamIterator(stream);

  async function next() {
    if (lines.length > 0) {
      return { done: lines.length === 1 && done, value: lines.shift() };
    }
    let value;
    ({ done, value } = await iterator.next());
    const delimiter = stream.isRaw ? '\r' : /\r?\n/;
    lines.push(...(leftover + (value || '')).split(delimiter));
    leftover = done ? null : lines.pop();
    return next();
  }

  const it = { next };
  if (Symbol.asyncIterator) {
    it[Symbol.asyncIterator] = () => it;
  }
  return it;
}
