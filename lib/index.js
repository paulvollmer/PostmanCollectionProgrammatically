var uuid = require('node-uuid');

/**
 * The PostmanCollection Constructor
 *
 * @constructor
 * @param data
 */
function PostmanCollection(data) {
  // postman basic data structure
  this.doc = {
    id: uuid.v1(),
    name: data.name || 'postman-collection-generator',
    description: data.description || 'no description available',
    order: [],
    folders: [],
    timestamp: data.timestamp || Date.now(),
    synced: data.synced || false,
    requests: []
  };
}
module.exports = PostmanCollection;

/**
 * addRequest
 */
PostmanCollection.prototype.addRequest = function(data) {
  var tmp = {
    id: uuid.v1(),
    name: data.name || 'unknown',
    description: data.description || 'not available',
    method: data.method || 'get',
    url: data.url || '',
    headers: data.headers || '',
    pathVariables: data.pathVariables || {},
    preRequestScript: data.preRequestScript || '',
    data: data.data || [],
    dataMode: data.dataMode || '',
    version: /*data.version ||*/ '2',
    tests: data.tests || '',
    responses: data.responses || [],
    synced: data.synced || false,
    collectionId: this.doc.id,
    time: data.time || Date.now()
  };

  this.doc.requests.push(tmp);

  this.doc.order.push(tmp.id);
};
