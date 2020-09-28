//swagger stuff
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "C304 Coffee API Documents",
            description: "API Information",
            contact: {
                name: "real live failure"
            },
            servers: ["https://c304coffee.herokuapp.com/"]
        }
    },
    apis: ["./routes/*.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

exports.serve =  swaggerUi.serve;
exports.setup =  swaggerUi.setup(swaggerDocs);