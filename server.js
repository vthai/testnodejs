var http = require("http");
var url = require("url");
var util = require("./util.js");
var employeeService = require("./employee.js");
var leaveRequestService = require("./leaveRequest.js");
var testAsync = require("./testAsync.js");

function serviceRequest(request, response) {
    console.log(">>>>>>>>>>>>>>>> start to service the request------");
    var urlAction = url.parse(request.url, true, false).pathname;
    var param = url.parse(request.url, true, false).query;
    var body = '';

    if (request.method == 'POST' || request.method == 'PUT') {
        request.on('data', function(chunk) {
            body += chunk.toString();
        });
        // ASYNC
        request.on('end', function() {
            console.log(">>>>>>>>>>>>>>>> Start to service response for POST/PUT--------");
            serviceResponse(response, param, urlAction, body);
        });
    } else {
        // SYNC
        console.log(">>>>>>>>>>>>>>>> Start to service response for GET--------");
        serviceResponse(response, param, urlAction);
    }
    console.log("<<<<<<<<<<<<<<<<< finish serving the request------");
}

function serviceResponse(response, param, urlAction, body) {
    var result = {};
    try {
        result = routeRequest(param, urlAction, body);
    } catch (e) {
        result.returnType = {
            "Content-Type" : "text/plain"
        };
        result.content = e.toString() + "\r\n";
    } finally {
        if(!result.content) {
            result.content = "Nothing to serve";
        }
    }

    console.log("<<<<<<<<<<<<<<<<<<< Start to Sent RESPONSE --------");
    response.writeHead(200, result.returnType);
    response.write(result.content);
    response.end();
}

function routeRequest(param, urlAction, body) {
    console.log("user request:" + urlAction);
    console.log("user body:" + body);
    console.log("user param:");
    util.printPropertiesOfObj(param);

    var returnObj = {};
    returnObj.returnType = {
        "Content-Type" : "text/plain"
    };
    
    if(isResource(urlAction)) {
        serverResource(param, urlAction, body, returnObj);
    } else {
        switch (urlAction) {
        case "/employee/add":
            employeeService.addEmployee(body);
            returnObj.content = "Add employee success";
            break;
        case "/employee/update":
            employeeService.updatetEmployee(body);
            returnObj.content = "Update employee success";
            break;
        case "/employee/get":
            returnObj.returnType = {
                "Content-Type" : "application/json"
            };
            returnObj.content = employeeService.getEmployee(param);
            break;
        case "/leave/get":
            returnObj.returnType = {
                "Content-Type" : "application/json"
            };
            returnObj.content = leaveRequestService.getLeaveRequest(param);
            break;
        case "/leave/add":
            leaveRequestService.addLeaveRequest(param, body);
            returnObj.content = "Add leave success";
            break;
        case "/hello" :
            returnObj.returnType = {
                    "Content-Type" : "text/html"
            };
            returnObj.content = util.returnStaticHTMLPage(urlAction);
            break;
        case "/test" :
            testAsync.writeDataToFile(param);
            break;
        case "/":
            returnObj.content = "Hello World";
            break;
        }
    }
    return returnObj;
}

function isResource(urlAction) {
    return urlAction.match("/css/*|/js/*|/lib/*");
}

function serverResource(param, urlAction, body, returnObj) {
    returnObj.content = util.returnResource(urlAction);
}

employeeService.readFromFileToCache();
leaveRequestService.readFromFileToCache();
http.createServer(serviceRequest).listen(8888);
console.log("Server has started.");