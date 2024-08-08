module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{css,png,jpg,svg,html,js,json}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};