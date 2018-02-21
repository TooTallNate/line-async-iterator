const createStreamIterator = require('stream-async-iterator');

module.exports = function createLineIterator(stream) {
  let lines = [];
  let done = false;
  let leftover = '';
  const iterator = createStreamIterator(stream);
  const delimiter = stream.isRaw ? '\r' : /\r?\n/;

  async function next() {
    if (lines.length > 0) {
      return { done: lines.length === 1 && done, value: lines.shift() };
    }
    let value;
    ({ done, value } = await iterator.next());

    if (stream.isRaw && value && value.length === 1) {
      if (value[0] === 3) {
        // Map Ctrl+C to SIGINT
        process.kill(process.pid, 'SIGINT');
        value = '';
      } else if (value[0] === 4) {
        // Map Ctrl+D to the stream's "end" event
        stream.emit('end');
        value = '';
      }
    }

    lines.push(...(leftover + (value || '')).split(delimiter));
    leftover = done ? null : lines.pop();
    return next();
  }

  return { next };
}
