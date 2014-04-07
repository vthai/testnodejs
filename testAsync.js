var fileSystem = require("fs");

function writeDataToFile(data) {
    var date = new Date();
    var value = date.getTime();
    var finalValue = "(" + data.id + ")" + " arrives at " + value + "\n";
    
    fileSystem.readFile(__dirname + "/data/test.txt", "utf8", callback);
/*    fileSystem.readFile(__dirname + "/data/test.txt", "utf8", function (err, data) {
        try {
            var result = data.split("\n");
            var length = result.length;
            
            finalValue = length + ":" + finalValue;
            data = data + finalValue;
            //console.log("now Data is " + oldData);
            fileSystem.writeFile(__dirname + "/data/test.txt", data);
        } catch (e) {
            console.log(e.toString());
        }
    });
    */
}


var callback = function (err, data, finalValue) {
    var result = data.split("\n");
    var length = result.length;
    
    finalValue = length + ":" + finalValue;
    data = data + finalValue;
    //console.log("now Data is " + oldData);
    fileSystem.writeFile(__dirname + "/data/test.txt", data);
};

exports.writeDataToFile = writeDataToFile;