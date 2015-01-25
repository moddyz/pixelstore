/*
 * teststore.js
 *
 * This testing module which purely tests the database transaction
 * integrity of the Store class. These are fairly simple and lower level tests.
 */

var fs = require("fs"),
    uuid = require("node-uuid"),
    async = require("async");

var utils = require("./utils.js");
var Store = require("../db/store.js");

module.exports = {

    setUp: function (callback) {
        var config = JSON.parse(fs.readFileSync(__dirname + "/../config.json"));
        this.store = new Store(config.cassandra);
        this.keyspace = config.cassandra.keyspace + "_" + utils.random();
        
        console.log("Setting up keyspace " + this.keyspace);
        this.store.setup(this.keyspace, function () {
            callback();
        });
    },

    tearDown: function (callback) {
        this.store.shutdown();
        callback();
    },
    
    testAddImage: function (test) {
            
        var this_ = this,
            imageA = utils.generateImage();

        async.waterfall([

            function (done) {
                this_.store.addImage(imageA.id, imageA.user, imageA.tags, imageA.data, imageA.type, done);
            },
            
            function (done) {
                this_.store.getImage(imageA.id, done);
            },

            function (imageB, done) {
                test.equals(imageA.id, imageB.id);
                test.equals(imageA.user, imageB.user);
                test.ok(utils.compareArrays(imageA.tags, imageB.tags));
                test.equals(imageA.type, imageB.type);
                test.equals(imageA.data.toString(), imageB.data.toString());
                done();
            }
        ], function (error, results) {
            if (error) return console.error(error);
            test.done();
        });
    }

    /*
    testRemoveImage: function (test) {
        test.ok(true, "true");
        test.done();
    },

    testGetImageByTag: function (test) {
        test.ok(true, "true");
        test.done();
    },

    testGetImagesByTag: function (test) {
        test.ok(true, "true");
        test.done();
    },

    testAddTags: function (test) {
        test.ok("yes");
        test.done();
    },

    testRemoveTags: function (test) {
        test.ok("yes");
        test.done();
    },

    testRemoveTags: function (test) {
        test.ok("yes");
        test.done();
    },
    */
};

