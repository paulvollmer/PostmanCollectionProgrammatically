var assert = require('assert');
var PostmanCollection = require('../lib');


describe('PostmanCollection', function() {

  describe('initialize', function() {
    it('should create a new instance without data', function() {
      var postman = new PostmanCollection();
      assert.equal(typeof postman.doc, 'object');
    });

    it('should create a new instance', function() {
      var postman = new PostmanCollection({
        name: 'test-init',
        description: 'init description',
        timestamp: '123',
        synced: true
      });
      assert.equal(postman.doc.name, 'test-init');
      assert.equal(postman.doc.description, 'init description');
      assert.equal(postman.doc.timestamp, '123');
      assert.equal(postman.doc.synced, true);
    });

    it('should create a new instance with folders', function() {
      var postman = new PostmanCollection({
        folders: [
          {name: 'folder-1'},
          {name: 'folder-2'}
        ]
      });
      assert.equal(postman.doc.folders.length, 2);
    });

    it('should create a new instance with requests', function() {
      var postman = new PostmanCollection({
        requests: [
          {name: 'requests-1'},
          {name: 'requests-2'}
        ]
      });
      assert.equal(postman.doc.requests.length, 2);
    });
  });

  describe('isMethodValid()', function() {
    var postman = new PostmanCollection();

    it('should return false if method has no parameter', function () {
      assert.equal(postman.isMethodValid(), false);
    });

    it('should return false if method is invalid', function () {
      assert.equal(postman.isMethodValid('FOO'), false);
    });

    it('should return true if method is valid', function () {
      assert.equal(postman.isMethodValid('GET'), true);
      assert.equal(postman.isMethodValid('get'), true);
      assert.equal(postman.isMethodValid('POST'), true);
      assert.equal(postman.isMethodValid('post'), true);
      assert.equal(postman.isMethodValid('PUT'), true);
      assert.equal(postman.isMethodValid('put'), true);
      assert.equal(postman.isMethodValid('DELETE'), true);
      assert.equal(postman.isMethodValid('delete'), true);
    });
  });

  describe('addRequest()', function() {
    it('should add a new request item without data', function() {
      var postman = new PostmanCollection();
      assert.equal(postman.doc.requests.length, 0);
      postman.addRequest();
      assert.equal(postman.doc.requests.length, 1);
    });

    it('should add a new request item', function() {
      var postman = new PostmanCollection();
      assert.equal(postman.doc.requests.length, 0);
      postman.addRequest({
        name: 'my-request',
        description: 'request description',
        method: 'GET',
        url: 'http://localhost:8080',
        headers: 'Content-Type: application/json',
        pathVariables: 'foo',
        preRequestScript: 'request-script',
        data: '123',
        dataMode: 'mode1',
        tests: 'some tests',
        responses: 'hello world',
        synced: true,
        time: '2014'
      });
      assert.equal(postman.doc.requests.length, 1);
      assert.equal(postman.doc.requests[0].name, 'my-request');
      assert.equal(postman.doc.requests[0].description, 'request description');
      assert.equal(postman.doc.requests[0].method, 'GET');
      assert.equal(postman.doc.requests[0].url, 'http://localhost:8080');
      assert.equal(postman.doc.requests[0].headers, 'Content-Type: application/json');
      assert.equal(postman.doc.requests[0].pathVariables, 'foo');
      assert.equal(postman.doc.requests[0].preRequestScript, 'request-script');
      assert.equal(postman.doc.requests[0].data, '123');
      assert.equal(postman.doc.requests[0].dataMode, 'mode1');
      assert.equal(postman.doc.requests[0].tests, 'some tests');
      assert.equal(postman.doc.requests[0].responses, 'hello world');
      assert.equal(postman.doc.requests[0].synced, true);
      assert.equal(postman.doc.requests[0].time, '2014');
    });

    it('should add a new request item with invalid method', function() {
      var postman = new PostmanCollection();
      postman.addRequest({method: 'FOO'});
      assert.equal(postman.doc.requests[0].method, 'GET');
    });

    it('should add a new request item to a folder', function() {
      var postman = new PostmanCollection();
      postman.addRequest({name: 'my-request'}, 'folder-1');
      assert.equal(postman.doc.requests[0].name, 'my-request');
      assert.equal(postman.doc.folders.length, 1);
    });

    it('should add a new request item to a folder that already exists', function() {
      var postman = new PostmanCollection();
      postman.addFolder({name: 'folder-1'});
      postman.addRequest({name: 'my-request'}, 'folder-1');
      assert.equal(postman.doc.requests[0].name, 'my-request');
      assert.equal(postman.doc.folders.length, 1);
    });
  });

  describe('folderExists()', function () {
    var postman = new PostmanCollection();
    postman.addFolder({name: 'foo'});

    it('should return false if folder does not exist', function () {
      assert.equal(postman.folderExists('bar'), false);
    });

    it('should return true if folder already exist', function () {
      assert.equal(postman.folderExists('foo'), true);
    });
  });

  describe('addFolder()', function() {
    it('should add a new folder item without data', function() {
      var postman = new PostmanCollection();
      assert.equal(postman.doc.folders.length, 0);
      postman.addFolder();
      assert.equal(postman.doc.folders.length, 1);
    });

    it('should add a new folder item', function() {
      var postman = new PostmanCollection();
      assert.equal(postman.doc.folders.length, 0);
      postman.addFolder({
        name: 'my-folder',
        description: 'my folder description',
        order: '123'
      });
      assert.equal(postman.doc.folders.length, 1);
      assert.equal(postman.doc.folders[0].name, 'my-folder');
      assert.equal(postman.doc.folders[0].description, 'my folder description');
      assert.equal(postman.doc.folders[0].order, '123');
    });

  });

});
