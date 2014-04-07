var fileSystem = require("fs");

exports.isEmpty = function (obj) {
    for ( var prop in obj) {
        if (obj.hasOwnProperty(prop))
            return false;
    }
    return true;
};

exports.printPropertiesOfObj = function (obj) {
    for (var p in obj) {
        console.log(p + "=" + obj[p]);
    }
};

function printPropertiesOfObj (obj) {
    for (var p in obj) {
        console.log(p + "=" + obj[p]);
    }
};

exports.aaa = printPropertiesOfObj;

function returnStaticHTMLPage(path) {
    var data = fileSystem.readFileSync(__dirname + "/client/" + path + ".html", "utf8");
    return data;
}

exports.returnStaticHTMLPage = returnStaticHTMLPage;

function returnResource(path) {
    var data = fileSystem.readFileSync(__dirname + "/client/" + path, "utf8");
    return data;
}

exports.returnResource = returnResource;
