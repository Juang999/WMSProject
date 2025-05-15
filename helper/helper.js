class Helper {
	constructor () {
		return {
			Auth: require('./auth'),
			Query: require('./Query'),
			Page: require('./page'),
			Authentication: require('./AuthV2')
		}
	}
}

module.exports = new Helper()