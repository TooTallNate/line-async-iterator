import tty from 'tty';
import { Readable } from 'stream';

export async function* createLineIterator(
	stream: Readable | tty.ReadStream
) {
	let leftover = '';

	for await (const chunk of stream) {
		const data = leftover + chunk;
		const delimiter = 'isRaw' in stream && stream.isRaw ? '\r' : /\r?\n/;
		const lines = data.split(delimiter);
		leftover = lines.pop()!;
		for (const line of lines) {
			yield line;
		}
	}

	if (leftover) yield leftover;
}
