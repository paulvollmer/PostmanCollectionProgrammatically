var uuid = require('node-uuid');

var UNKNOWN = 'unknown';
var NOT_AVAILABLE = 'not available';

var METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

var DATA_MODE = {
  FORM_DATA: 'params',
  FORM_URLENCODED: 'urlencoded',
  RAW: 'raw',
  BINARY: 'binary'
};

/**
 * The PostmanCollection Constructor
 *
 * @constructor
 * @param data
 */
function PostmanCollection(data) {
  // check if data param exist
  var tmpData = {};
  if(data !== undefined) tmpData = data;

  // postman basic data structure
  this.doc = {
    id: uuid.v1(),
    name: tmpData.name || 'postman-collection',
    description: tmpData.description || NOT_AVAILABLE,
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
 * Is method parameter valid?
 *
 * @param method
 * @returns {boolean}
 */
PostmanCollection.prototype.isMethodValid = function(method) {
  if(method) {
    switch(method) {
      case METHOD.GET:
      case METHOD.GET.toLowerCase():
      case METHOD.POST:
      case METHOD.POST.toLowerCase():
      case METHOD.PUT:
      case METHOD.PUT.toLowerCase():
      case METHOD.DELETE:
      case METHOD.DELETE.toLowerCase():
        return true;
      default:
        return false;
    }
  } else {
    return false;
  }
};

/**
 * Add a request item to the doc
 */
PostmanCollection.prototype.addRequest = function(data, folder) {
  var tmpData = data || {};

  // check method
  if(!this.isMethodValid(tmpData.method)) tmpData.method = METHOD.GET;

  var tmp = {
    id: uuid.v1(),
    name: tmpData.name || UNKNOWN,
    description: tmpData.description || NOT_AVAILABLE,
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
 * check if folder exists
 *
 * @param foldername
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
 * Add a folder item to the doc
 */
PostmanCollection.prototype.addFolder = function(data) {
  var tmpData = data || {};

  var tmp = {
    id: uuid.v1(),
    name: tmpData.name || UNKNOWN,
    description: tmpData.description || NOT_AVAILABLE,
    order: tmpData.order || [],
    collection_id: this.doc.id,
    collection_name: this.doc.name
  };

  this.doc.folders.push(tmp);

  return tmp;
};

/**
 * get the postman collection doc as serialized JSON.
 *
 * @returns {string} JSON
 */
PostmanCollection.prototype.getJSON = function () {
  var json = JSON.stringify(this.doc, null, 2);
  return json;
};
