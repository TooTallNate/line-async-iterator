import fs from 'fs';
import createLineIterator from './src/index';

const stream = fs.createReadStream('package.json', {
	encoding: 'utf8',
	highWaterMark: 3,
});

async function main() {
	const it = createLineIterator(stream);
	for await (const chunk of it) {
		console.log({ chunk });
	}
}

main().catch((err) => {
	console.log(err);
	process.exit(1);
});
