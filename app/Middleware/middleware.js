class Middleware {
	constructor () {
		return {
			authenticate: require('./authenticate')
		}
	}
}

module.exports = new Middleware()