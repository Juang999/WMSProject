class Helper {
	constructor () {
		return {
			Auth: require('./auth'),
			Page: require('./page'),
			Query: require('./Query'),
			Logging: require('./Logging'),
			Authentication: require('./AuthV2')
		}
	}
}

module.exports = new Helper()