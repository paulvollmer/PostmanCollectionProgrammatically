var uuid = require('node-uuid');

/**
 * The PostmanCollection Constructor.
 *
 * @constructor
 * @param {Object} data
 * Set the name and description of the collection.
 */
function PostmanCollection(data) {
  // check if data param exist
  var tmpData = {};
  if(data !== undefined) tmpData = data;

  // postman basic data structure
  this.doc = {
    id: uuid.v1(),
    name: tmpData.name || 'postman-collection',
    description: tmpData.description || this.NOT_AVAILABLE,
    order: [],
    folders: [],
    timestamp: tmpData.timestamp || Date.now(),
    synced: tmpData.synced || false,
    requests: []
  };

  // add folders and requests at init
  // TODO: unDRY this
  var self = this;
  if(tmpData.folders) {
    if(Array.isArray(tmpData.folders)) {
      tmpData.folders.forEach(function(folder) {
        self.addFolder(folder);
      });
    } else {
      console.error('folders must be an array');
    }
  }
  if(tmpData.requests) {
    if(Array.isArray(tmpData.requests)) {
      tmpData.requests.forEach(function(request) {
        self.addRequest(request);
      });
    } else {
      console.error('requests must be an array');
    }
  }
}
module.exports = PostmanCollection;

/**
 * The string we use if something is undefined.
 *
 * @type {String}
 */
PostmanCollection.prototype.UNKNOWN = 'unknown';

/**
 * The string we use if something is not available.
 *
 * @type {String}
 */
PostmanCollection.prototype.NOT_AVAILABLE = 'not available';

/**
 * The availabel data modes.
 *
 * @type {Object}
 */
PostmanCollection.prototype.DATA_MODE = {
  FORM_DATA: 'params',
  FORM_URLENCODED: 'urlencoded',
  RAW: 'raw',
  BINARY: 'binary'
};

/**
 * The available request methods.
 *
 * @type {Object}
 */
PostmanCollection.prototype.METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  COPY: 'COPY',
  HEAD: 'HEAD',
  OPTIONS: 'OPTIONS',
  LINK: 'LINK',
  UNLINK:'UNLINK',
  PURGE: 'PURGE',
  LOCK: 'LOCK',
  UNLOCK: 'UNLOCK',
  PROPFIND: 'PROPFIND'
};

/**
 * Is method parameter valid?
 *
 * @param {String} method
 * The name of the method.
 * @return {Boolean}
 * True if the method is valid.
 */
PostmanCollection.prototype.isMethodValid = function(method) {
  if(method) {
    switch(method) {
      case this.METHOD.GET:
      case this.METHOD.GET.toLowerCase():
      case this.METHOD.POST:
      case this.METHOD.POST.toLowerCase():
      case this.METHOD.PUT:
      case this.METHOD.PUT.toLowerCase():
      case this.METHOD.DELETE:
      case this.METHOD.DELETE.toLowerCase():
      case this.METHOD.COPY:
      case this.METHOD.COPY.toLowerCase():
      case this.METHOD.HEAD:
      case this.METHOD.HEAD.toLowerCase():
      case this.METHOD.OPTIONS:
      case this.METHOD.OPTIONS.toLowerCase():
      case this.METHOD.LINK:
      case this.METHOD.LINK.toLowerCase():
      case this.METHOD.UNLINK:
      case this.METHOD.UNLINK.toLowerCase():
      case this.METHOD.PURGE:
      case this.METHOD.PURGE.toLowerCase():
      case this.METHOD.LOCK:
      case this.METHOD.LOCK.toLowerCase():
      case this.METHOD.UNLOCK:
      case this.METHOD.UNLOCK.toLowerCase():
      case this.METHOD.PROPFIND:
      case this.METHOD.PROPFIND.toLowerCase():
        return true;
      default:
        return false;
    }
  } else {
    return false;
  }
};

/**
 * Add a request item to the collection.
 *
 * @param {Object} data
 * The Postman request data.
 * @param {String} folder
 * The name of the set.
 */
PostmanCollection.prototype.addRequest = function(data, folder) {
  var tmpData = data || {};

  // check method
  if(!this.isMethodValid(tmpData.method)) tmpData.method = this.METHOD.GET;

  var tmp = {
    id: uuid.v1(),
    name: tmpData.name || this.UNKNOWN,
    description: tmpData.description || this.NOT_AVAILABLE,
    descriptionFormat: 'html',
    method: tmpData.method,
    url: tmpData.url || '',
    headers: tmpData.headers || '',
    pathVariables: tmpData.pathVariables || {},
    preRequestScript: tmpData.preRequestScript || '',
    data: tmpData.data || [],
    dataMode: tmpData.dataMode || '',
    version: '2',
    tests: tmpData.tests || '',
    responses: tmpData.responses || [],
    synced: tmpData.synced || false,
    collectionId: this.doc.id,
    time: tmpData.time || Date.now()
  };

  // push to doc requests array
  this.doc.requests.push(tmp);

  // check if we want to add the request item to a folder
  if (folder) {
    var tmpFolder = this.folderExists(folder);
    if(tmpFolder !== false) {
      this.doc.folders[tmpFolder].order.push(tmp.id);
    }
    // if Folder cannot be found, create one
    else {
      this.addFolder({name: folder, order: [tmp.id]});
    }
  }
  // push this id to the doc order array
  else {
    this.doc.order.push(tmp.id);
  }

  return tmp;
};

/**
 * Check if folder exists.
 *
 * @param {String}
 * foldername The name of the set.
 * @return {Boolean|String}
 * If found, return the foldername, else return false.
 */
PostmanCollection.prototype.folderExists = function(foldername) {
  var result = false;
  for(var i=0; i<this.doc.folders.length; i++) {
    if(this.doc.folders[i].name === foldername) {
      result = i;
    }
  }
  return result;
};

/**
 * Add a folder item to the collection.
 *
 * @param {Object} data
 * The folder data.
 */
PostmanCollection.prototype.addFolder = function(data) {
  var tmpData = data || {};

  var tmp = {
    id: uuid.v1(),
    name: tmpData.name || this.UNKNOWN,
    description: tmpData.description || this.NOT_AVAILABLE,
    order: tmpData.order || [],
    collection_id: this.doc.id,
    collection_name: this.doc.name
  };

  this.doc.folders.push(tmp);

  return tmp;
};

/**
 * Get the postman collection as serialized JSON.
 *
 * @return {String}
 * The serialized JSON.
 */
PostmanCollection.prototype.getJSON = function () {
  var json = JSON.stringify(this.doc, null, 2);
  return json;
};
