const fs = require("fs/promises")

exports.fetchingAllPathInfo = () => {
    return fs.readFile("./endpoints.json", "utf-8")
        .then((endpointFile) => {
            return JSON.parse(endpointFile);
        })
}