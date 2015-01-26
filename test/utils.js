/*
 * utils.js
 *
 * Testing Utility Functions
 */

var fs = require("fs");

exports.random = function () {
    var id = "";
    var characters = "0123456789";

    for (var i = 0; i < 5; i++)
        id += characters.charAt(Math.floor(Math.random() * characters.length));

    return id;
}

exports.generateImage = function () {
    
    /* Generate some image data for testing */

    var image = {
        id: 'image_id',
        user: "foo",
        tags: ["tag1", "tag2"],
        type: "image/jpeg"
    }

    try  {
        image.data = fs.readFileSync(__dirname + "/image.jpg");
    } catch (e) {
        console.log(e.message);
        throw Error(e);
    }
    
    return image;
};

exports.generateTags = function () {

    /* Generate some tags for testing */

    return ['tag3', 'tag4'];
};
