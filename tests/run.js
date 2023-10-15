const fs = require('fs/promises');
const path = require('path');
const Evaluator = require('../src/evaluator');
const evaluator = new Evaluator();
const bootstrap = async () => {
	const files = await fs.readdir(path.resolve(__dirname));
	const testsPaths = files.filter((file) => file.split('-').at(-1).includes('test'));
	const requires = testsPaths.map((testPath) => require(path.resolve(__dirname, testPath)));
	requires.forEach((test) => test(evaluator));
	evaluator.eval(['print', '"Hello,"', '"World!"']);
	console.log('All tests passed!');
};

bootstrap();
