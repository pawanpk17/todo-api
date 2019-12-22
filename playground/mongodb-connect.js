var {MongoClient, ObjectID} = require('mongodb');

var url = "mongodb://localhost:27017/TodoApp";

MongoClient.connect(url, (err, client) => {
    if(err)
    {
        return console.log('Cannnot connect to mongo db server', err);
    }

    console.log('connected to mongo db server');
    const db = client.db('TodoApp');

    db.collection('Todos').insertOne({
        text: 'Drive car',
        completed: false
    }, (err, result) => {
        if(err)
            return console.log('Unable to insert Todos', err);

        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    db.collection('Users').insertOne({
        _id: 12345,
        name: 'Pawan',
        age: 31,
        location: 'Banaglore'
    }, (err, result) => {
        if(err)
            return console.log('Unable to insert User', err);

        console.log(JSON.stringify(result.ops, undefined, 2));
    });

    client.close();
});