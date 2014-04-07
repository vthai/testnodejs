var http = require("http");
var url = require("url");
var fileSystem = require("fs");

var employeeArrCache = {};
var body = '';
var urlAction = '';
var empPrimaryKey = 1;

function serviceRequest(request, response) {
    urlAction = url.parse(request.url, true, false).pathname;
    if (request.method == 'POST') {
        request.on('data', function(chunk) {
            body += chunk.toString();
        });
        
        request.on('end', function() {
            routeRequest(null);
            
            var returnObj = {};
            returnObj.returnType = {
                "Content-Type" : "text/plain"
            };
            returnObj.content = "Employee Saved";
            
            response.writeHead(200, returnObj.returnType);
            response.write(returnObj.content);
            response.end();
        });
    } else {
        var param = url.parse(request.url, true, false).query;
        serviceResponse(response, param);
    }
}

function serviceResponse(response, param) {
    var result = routeRequest(param);

    response.writeHead(200, result.returnType);
    response.write(result.content);
    response.end();
}

function routeRequest(param) {
    console.log("user request: " + urlAction);
    
    var returnObj = {};
    switch (urlAction) {
        case "/employee/add":
            addEmployee(body);
            break;
        case "/employee/get":
            returnObj = getEmployee(param);
            break;
        case "/":
            returnObj.returnType = {
                "Content-Type" : "text/plain"
            };
            returnObj.content = "Hello World";
            break;
        default:
            returnObj.returnType = {
                "Content-Type" : "text/plain"
            };
            returnObj.content = "Welcome";
            break;
    }
    return returnObj;
}

function addEmployee(body) {
    var newEmployee = JSON.parse(body);
    var data = fileSystem.readFileSync(__dirname + "/data.txt", "utf8");
    var employeeArrayFromFile = JSON.parse(data);
    
    employeeArrayFromFile[empPrimaryKey] = newEmployee;
    var convertToString = JSON.stringify(employeeArrayFromFile);
    
    fileSystem.writeFileSync(__dirname + "/data.txt", convertToString);
    readFromFileToCache();
}

//new function to use key to lookup employee
function getEmployee(param) {
    var returnObj = {};
    returnObj.returnType = {
        "Content-Type" : "application/json"
    };


    var employee = lookupEmployeeById(param);
    
    returnObj.content = employee;
    returnObj.content = JSON.stringify(returnObj.content);

    return returnObj;
}

function lookupEmployeeById(param) {
    if (isEmpty(employeeArrCache)) {
        readFromFileToCache();
    } 

    if (!isEmpty(param)) {
        console.log("emp ID: " + param.id);
        console.log("object to return: " + employeeArrCache[param.id]);
        return employeeArrCache[param.id];
    } else {
        return employeeArrCache;
    }

}

function readFromFileToCache() {
    var data = fileSystem.readFileSync(__dirname + "/data.txt", "utf8");
    console.log(data);
    employeeArrCache = JSON.parse(data);

    increaseEmployeePrimaryKey();
}

function isEmpty(obj) { 
    for ( var prop in obj) { 
    if (obj.hasOwnProperty(prop)) 
        return false; 
    }

    return true; 
}

function increaseEmployeePrimaryKey() {
    empPrimaryKey = Object.keys(employeeArrCache).length + 1;
}

http.createServer(serviceRequest).listen(8888);
console.log("Server has started.");