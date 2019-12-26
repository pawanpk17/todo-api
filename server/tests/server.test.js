const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const todos = [{
    'text' : 'First test todo'
}, {
    'text' : 'Second test todo'
}];

const users = [{
    'email' : 'First test user email'
}, {
    'email' : 'Second test user email'
}];

beforeEach((done) => {
    Todo.deleteMany({})
        .then(() => {
            return Todo.insertMany(todos)
        })
        .then(() => {
            return User.deleteMany({})
        })
        .then(() => {
            return User.insertMany(users)
        })
        .then(() => done());
  });

describe('POST /todo', function() {
    it('should post a new todo', (done) => {
        var text = "test todo data"

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err)
                    return done(err);
                
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err)
                    return done(err);

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});

describe('POST /user', function() {

    it('should create a new user in Users collection', (done) => {
        var testEmail = 'test email';
        request(app)
            .post('/users')
            .send({email : testEmail})
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(testEmail);
            })
            .end((err, res) => {
                if(err)
                    return done(err);

                User.find({testEmail}).then((users) => {
                    expect(users.length).toBe(1);
                    expect(users[0].email).toBe(testEmail);
                    done();
                }).catch((e) => { 
                    done(e);
                 });
            });
    });

    it('should not create a user with empty data', (done) => {
        request(app)
            .post('/users')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err)
                    return done(err);
                
                User.find().then((users) => {
                    expect(users.length).toBe(2);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});

describe('GET /todos', function() {
    it('should read all the todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBeGreaterThanOrEqual(1);
            })
            .end(done); 
    });
});

describe('GET /users', function() {
    it('should read all the users', (done) => {
        request(app)
            .get('/users')
            .expect(200)
            .expect((res) => {
                expect(res.body.users.length).toBeGreaterThanOrEqual(1);
            })
            .end(done); 
    });
});