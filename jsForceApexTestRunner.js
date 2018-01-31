const jsforce = require("jsforce");

const apexUnitTest = function() {
  const conn = new jsforce.Connection({
    serverUrl: "Server Url",
    sessionId: "Session Id"
  });

  const url = conn._baseUrl() + "/tooling/runTestsSynchronous/";

  function runTest(className, testMethod) {
    const parameters = { tests: [{ className: className, testMethods: [testMethod] }] };

    return conn.requestPost(url, parameters).then(parseResponse).catch(errorHandler);
  }

  function parseResponse(response) {
    const result = {};
    if (response.successes.length) {
      result[response.successes[0].methodName] = { isSuccess: true, message: "none" };
    }
    if (response.failures.length) {
      result[response.failures[0].methodName] = {
        isSuccess: false,
        message: response.failures[0].methodName +
          " test failed: " +
          response.failures[0].message +
          " " +
          response.failures[0].stackTrace
      };
    }
    return result;
  }

  function errorHandler(err) {
    throw err;
  }
  return {
    runTest: runTest
  };
};
module.exports = apexUnitTest;

