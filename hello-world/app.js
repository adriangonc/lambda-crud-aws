// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-2'});

const TABLE_NAME = 'PRIMEIRA_TABELA';

exports.lambdaHandler = async (event, context) => {
        
    var body;

    if(event.httpMethod == "POST"){
        body = await createItem(event);
    }

    if(event.httpMethod == "GET"){
        body = await getItem();
    }

    if(event.httpMethod == "DELETE"){
        body = await deleteItem();
    }

    if(event.httpMethod == "PUT"){
        body = await updateItem();
    }
    
    const response = {
        body: JSON.stringify(body)
    }

    return response
};

async function getItem(){
    var docClient = conectDynamo();

    var params = {
        TableName: TABLE_NAME,
        Key: {'id': "2"}
    };

    var body;

    try {
        const data = await docClient.get(params).promise()

        body = data.Item;
    } catch (err) {
        console.log(err);
        body = err;
    }

    return body
}

function conectDynamo() {
    // Create DynamoDB document client
    return new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
}

async function createItem(event){
    var docClient = conectDynamo();

    var event_body = JSON.parse(event.body);

    console.log("Cadastrando usuario: " + event_body);
    const crypto = require("crypto");
    const user_id = crypto.randomBytes(16).toString("hex");

    var params = {
        TableName: TABLE_NAME,
        Item: {
            'id': user_id,
            'nome': event_body.nome,
            'categoria': event_body.categoria
        }
    };

    var body;

    try {
        const data = await docClient.put(params).promise()
        body = data.Item;
    } catch (err) {
        console.log(err);
        body = err;
    }

    return body
}

async function deleteItem(){
    var docClient = conectDynamo();
    var params = {
        TableName: TABLE_NAME,
        Key: {'id': "1"}
    };

    var body;

    try {
        const data = await docClient.delete(params).promise()

        body = data.Item;
    } catch (err) {
        console.log(err);
        body = err;
    }

    return body
}

async function updateItem(){
    var docClient = conectDynamo();

    var params = {
        TableName: TABLE_NAME,
        Key: {'id': "1"},
        UpdateExpression: "set nome = :nome, categoria = :categoria",
        ExpressionAttributeValues: {
            ":nome": "Sara Karine",
            ":ategoria": 3
        }
    };

    var body;

    try {
        const data = await docClient.update(params).promise()

        body = data.Item;
    } catch (err) {
        console.log(err);
        body = err;
    }

    return body
}