var fileSystem = require("fs");
var util = require("./util.js");

var employeeArrCache = {};
var primaryKey = 1;

function addEmployee(body) {
    var newEmployee = JSON.parse(body);
    increasePrimaryKey();
    employeeArrCache[primaryKey] = newEmployee;
    var convertToString = JSON.stringify(employeeArrCache);

    fileSystem.writeFileSync(__dirname + "/data/data.txt", convertToString);
}

function getEmployee(param) {
    var result = lookupEmployeeById(param);

//    var startTime = new Date().getTime();
//    while (new Date().getTime() < startTime + 15000);

    return JSON.stringify(result);
}

function updatetEmployee(body) {
    var toBeUpdateEmployee = JSON.parse(body);
    
//    console.log("Waiting");
//    var startTime = new Date().getTime();
//    while (new Date().getTime() < startTime + 15000);
//    console.log("finish Waiting");
    
    if (toBeUpdateEmployee.id) {

        employeeArrCache[toBeUpdateEmployee.id] = toBeUpdateEmployee;
        var convertToString = JSON.stringify(employeeArrCache);

        //fileSystem.writeFileSync(__dirname + "/data/data.txt", convertToString);
        fileSystem.writeFile(__dirname + "/data/data.txt", convertToString);
    }
}

function lookupEmployeeById(param) {
    if (util.isEmpty(employeeArrCache)) {
        readFromFileToCache();
    }

    if (!util.isEmpty(param)) {
        var result = employeeArrCache[param.id];
        if (result) {
            return result;
        } else {
            return {};
        }
    } else {
        var empList = [];
        for ( var p in employeeArrCache) {
            empList.push(employeeArrCache[p]);
        }
        return empList;
    }
    return {};
}

function readFromFileToCache() {
    var data = fileSystem.readFileSync(__dirname + "/data/data.txt", "utf8");
    console.log(data);
    employeeArrCache = JSON.parse(data);
}

function increasePrimaryKey() {
    primaryKey = Object.keys(employeeArrCache).length + 1;
    return primaryKey;
}

exports.addEmployee = addEmployee;
exports.getEmployee = getEmployee;
exports.updatetEmployee = updatetEmployee;
exports.readFromFileToCache = readFromFileToCache;
