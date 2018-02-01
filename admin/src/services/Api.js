import 'whatwg-fetch'
import ApiConfig from '../config/api'
import base64 from 'base-64'
import { saveAs } from 'browser-filesaver'

const ApiService = {

  url: ApiConfig.basePath,

  routes: {
    search: { type: 'POST', path: 'search' },
    blacklist: { type: 'POST', path: 'blacklist' },
    makeOG: { type: 'POST', path: 'makeOG' },
    exportHodlers: { type: 'POST', path: 'exportHodlers', download: true },
    exportMembers: { type: 'POST', path: 'exportMembers', download: true },
    exportApplications: { type: 'POST', path: 'exportApplications', download: true }
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
      if (Object.keys(params)[Object.keys(params).length -1] !== paramName) query += '&'
    }
    return new Promise((resolve) => {
      fetch(query).then(response => route.download ? response.blob() : response.json()).then(res => resolve(res))
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
          'Authorization': 'Basic ' + base64.encode('admin:C4nY4H0d'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      }).then(response => route.download ? response.blob() : response.json()).then(res => resolve(res))
    })
  },

  /**
   *  Searches for a hodler from the API
   *  @param telegram {String} Telegram handle
   *  @param email {String} Email address
   *  @param ethAddress {String} Eth address
   *  @return {Promise<Array>} Hodlers from the API
   */
  search: async (telegram = '', email = '', ethAddress = '') => {
    return new Promise(async (resolve) => {
      let response = await ApiService.call(ApiService.routes.search, { telegram, email, ethAddress })
      let { applications, hodlers } = response
      let results = []
      for (let application of applications) {
        let merged = {}
        for (let hodler of hodlers) {
          if (hodler.ethAddress === application.ethAddress) {
            Object.assign(merged, hodler)
            Object.assign(merged, application)
            merged.applied = true
          }
        }
        if (merged.ethAddress) {
          results.push(merged)
        } else {
          results.push(application)
        }
      }
      resolve(results)
    })
  },

  makeOG: async (ethAddress = '') => {
    return new Promise(async (resolve) => {
      let response = await ApiService.call(ApiService.routes.makeOG, { ethAddress })
      resolve(response)
    })
  },

  blacklist: async (ethAddress = '') => {
    return new Promise(async (resolve) => {
      let response = await ApiService.call(ApiService.routes.blacklist, { ethAddress })
      resolve(response)
    })
  },

  exportHodlers: async () => {
    return new Promise(async (resolve) => {
      let csvFile = await ApiService.call(ApiService.routes.exportHodlers)
      saveAs(csvFile, 'Hodlers-Export-' + new Date() + '.csv')
      resolve()
    })
  },

  exportMembers: async () => {
    return new Promise(async (resolve) => {
      let csvFile = await ApiService.call(ApiService.routes.exportMembers)
      saveAs(csvFile, 'HodlClubMembers-Export-' + new Date() + '.csv')
      resolve()
    })
  },

  exportApplications: async () => {
    return new Promise(async (resolve) => {
      let csvFile = await ApiService.call(ApiService.routes.exportApplications)
      saveAs(csvFile, 'HodlClubApplications-Export-' + new Date() + '.csv')
      resolve()
    })
  }

}

export default ApiService