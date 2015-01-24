var fs = require("fs");
var uuid = require("node-uuid");

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
            id = 'image_id',
            user = "foo",
            tags = ["tag1", "tag2"],
            type = "image/jpeg";
    
        try  {
            var data = fs.readFileSync(__dirname + "/image.jpg");
        } catch (e) {
            console.log(e.message);
            throw Error(e);
        }

        console.log("creating image with id " + id);

        this.store.addImage(id, user, tags, data, type, getImage);

        function getImage() {
            setTimeout( function () {
                this_.store.getImage(id, verifyImage);
            }, 1000);
        }

        function verifyImage( image ) {
            test.equals(image.id, id);
            test.equals(image.user, user);
            test.ok(utils.compareArrays(image.tags, tags));
            test.equals(image.type, type);
            test.equals(image.data.toString(), data.toString());
            test.done();
        };
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

