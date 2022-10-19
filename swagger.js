const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info : {
        title : 'API',
        descrption: 'API 文檔'
    },
    host:'localhost:3000',
    schemes:['http','https'],
    securityDefinitions :{
        apiAuth :{
            type: 'apiKey',
            in: 'headers',
            name: 'authorization',
            description : 'auth for api'
        }
    }
}

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];


swaggerAutogen(outputFile,endpointsFiles,doc)