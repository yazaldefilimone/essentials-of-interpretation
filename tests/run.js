const fs = require('fs/promises');
const path = require('path');
const Evaluator = require('../src/evaluator');
const bootstrap = async () => {
	const all = await fs.readdir(path.resolve(__dirname));
	const testers = all.filter((file) => file.split('-').at(-1).includes('test'));
	const requires = testers.map((testPath) => require(path.resolve(__dirname, testPath)));
	const evaluator = new Evaluator();
	requires.forEach((test) => test(evaluator));
	evaluator.eval(['print', '"Hello,"', '"World!"']);
	console.log('All tests passed!');
};

bootstrap();
