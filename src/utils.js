function createMap(initial) {
	const $map = new Map();
	if (!initial) {
		return $map;
	}
	for (const key in initial) {
		if (Object.hasOwnProperty.call(initial, key)) {
			$map.set(key, initial[key]);
		}
	}
	return $map;
}

module.exports = { createMap };
