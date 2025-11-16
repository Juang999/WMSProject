class Helper {
	constructor () {
		return {
			Auth: require('./auth'),
			Page: require('./page'),
			Query: require('./Query'),
			Server: require('./Server'),
			Logging: require('./Logging'),
			Bilangan: require('./Bilangan'),
			Authentication: require('./AuthV2'),
		}
	}
}

module.exports = new Helper()