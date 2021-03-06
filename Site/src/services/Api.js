import 'whatwg-fetch'
import ApiConfig from '../config/api'

const ApiService = {

  url: ApiConfig.basePath,

  routes: {
    getHodlers: { type: 'GET', path: 'bestHodlers' },
    getHodlerOGs: { type: 'GET', path: 'bestHodlerOGs' },
    getAirdrops: { type: 'GET', path: 'tokensAirdropped' },
    getStats: { type: 'GET', path: 'getHodlStats' },
    submitApplication: { type: 'POST', path: 'submitHodlApplication' }
  },

  /**
   *  Routes the request to either the GET or POST methods depending on the endpoint
   *  @param route {Object} One of the above route objects
   *  @param params {Object} Parameters for the request
   *  @return {Promise<JSON>} Response from the call
   */
  call: async (route, params) => {
    return new Promise(async (resolve) => {
      if (route.type === 'GET') return resolve(await ApiService.get(route, params))
      if (route.type === 'POST') return resolve(await ApiService.post(route, params))
    })
  },

  /**
   *  Constructs and executes a GET request based on any given params
   *  @param route {Object} One of the above route objects
   *  @param params {Object} Parameters for the request
   *  @return {Promise<JSON>} Response from the call
   */
  get: async (route, params) => {
    let query = ApiService.url + route.path + '?'
    for (let paramName in params) {
      query += paramName + '=' + params[paramName]
      if (Object.keys(params)[Object.keys(params).length - 1] !== paramName) query += '&'
    }
    return new Promise((resolve) => {
      fetch(query).then(response => response.json()).then(json => resolve(json))
    })
  },

  /**
   *  Constructs and executes a POST request with the given params
   *  @param route {Object} One of the above route objects
   *  @param params {Object} Parameters for the request
   *  @return {Promise<JSON>} Response from the call
   */
  post: async (route, params) => {
    return new Promise((resolve) => {
      fetch(ApiService.url + route.path, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify(params)
      }).then(response => response.json()).then(json => resolve(json))
    })
  },

  /**
   *  Gets the hodlers from the API
   *  @param number {Number} Number of hodlers to retrieve
   *  @param skip {Number} Number of records to skip
   *  @param sort {String} Param by which to sort the results
   *  @return {Promise<Array>} Hodlers from the API
   */
  getHodlers: async (number = 10, skip = 0, sort = 'days') => {
    return new Promise(async (resolve) => {
      let response = await ApiService.call(ApiService.routes.getHodlers, { numberOfHodlers: number, skip: skip, sort: sort })
      resolve(response.data)
    })
  },

  /**
   *  Gets the hodler OGs from the API
   *  @param number {Number} Number of hodler OGs to retrieve
   *  @param skip {Number} Number of records to skip
   *  @param sort {String} Param by which to sort the results
   *  @return {Promise<Array>} Hodlers from the API
   */
  getHodlerOGs: async (number = 10, skip = 0, sort = 'days') => {
    return new Promise(async (resolve) => {
      let response = await ApiService.call(ApiService.routes.getHodlerOGs, { numberOfHodlers: number, skip: skip, sort: sort })
      resolve(response.data)
    })
  },

  /**
   *  Gets the stats for a specific address
   *  @param address {String} Address to query
   *  @return {Promise<Object>} Data from the queried address
   */
  getStats: async (address) => {
    return new Promise(async (resolve) => {
      let response = await ApiService.call(ApiService.routes.getStats, { hodlerAddress: address })
      resolve(response.data)
    })
  },

  // HAVE NOT TESTED THIS METHOD
  /**
   *  Submits a hodl club application
   *  @param email {String} Email address of the applicant
   *  @param discord {String} Discord handle of the applicant
   *  @param ethAddress {String} Eth address of the applicant
   *  @return {Promise<Object>} Whether or not the application was submitted
   */
  submitApplication: async (email, discord, ethAddress) => {
    return new Promise(async (resolve) => {
      let response = await ApiService.call(ApiService.routes.submitApplication, { emailAddress: email, discordHandle: discord, ethAddress: ethAddress })
      resolve(response)
    })
  }

}

export default ApiService
