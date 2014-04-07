var fileSystem = require("fs");
var util = require("./util.js");

var leaveRequestCache = {};
var primaryKey = 1;

function getLeaveRequest(param) {
    var result = {};
    if (param.hasOwnProperty("leaveId")) {
        result = getALeaveRequestOfEmployee(param);
    } else if (!util.isEmpty(param)) {
        result = getAllLeaveRequestOfEmployee(param);
    } else {
        result = leaveRequestCache;
    }
    return JSON.stringify(result);
}

function getAllLeaveRequestOfEmployee(param) {
    if (util.isEmpty(leaveRequestCache)) {
        readFromFileToCache();
    }

    var result = leaveRequestCache[param.empId];
    if (result) {
        return result;
    } else {
        return {};
    }

}

function getALeaveRequestOfEmployee(param) {
    if (util.isEmpty(leaveRequestCache)) {
        readFromFileToCache();
    }

    var result = leaveRequestCache[param.empId][param.leaveId];
    if (result) {
        return result;
    } else {
        return {};
    }

}

function addLeaveRequest(param, body) {
    var newLeaveRequest = JSON.parse(body);

    if(!leaveRequestCache[param.empId]) {
        leaveRequestCache[param.empId] = {};
    }
    increasePrimaryKey(param.empId);
    leaveRequestCache[param.empId][primaryKey] = newLeaveRequest;
    var convertToString = JSON.stringify(leaveRequestCache);

    fileSystem.writeFileSync(__dirname + "/data/leave.txt", convertToString);
}

function readFromFileToCache() {
    var data = fileSystem.readFileSync(__dirname + "/data/leave.txt", "utf8");
    console.log(data);
    leaveRequestCache = JSON.parse(data);
}

function increasePrimaryKey(empId) {
    var allLeaveRequestOfAnEmp = leaveRequestCache[empId];
    primaryKey = Object.keys(allLeaveRequestOfAnEmp).length + 1;
    return primaryKey;
}

exports.getLeaveRequest = getLeaveRequest;
exports.readFromFileToCache = readFromFileToCache;
exports.addLeaveRequest = addLeaveRequest;