require('dotenv').config();
const http = require('http');
let data = require('./db');
const { validate } = require('uuid');
const Person = require('./models/Person');
const CustomError = require('./models/Error');

const routes = (req, res) => {
  try {
    let personId = null;
    if (req.url.match(/^\/person\//) && req.url.split('/').length === 3) {
      personId = req.url.split('/')[2];
    }
    if (req.method === 'GET' && req.url === '/person') {
      res.writeHead(200);
      res.end(JSON.stringify(data));
    } else if (req.method === 'GET' && personId) {
      if (!validate(personId)) throw new CustomError(400, `Not valid id - ${personId}`);
      const person = data.find(item => item.id === personId);
      if (!person) throw new CustomError(404, 'Person not found');
      res.writeHead(200);
      res.end(JSON.stringify(person));
    } else if (req.method === 'POST' && req.url === '/person') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      })
      req.on('end', () => {
        const { name, age, hobbies } = JSON.parse(body);
        if (!name || !age || !hobbies) throw new CustomError(400, 'The fields "name", "age", "hobbies" is required');
        const person = new Person(name, age, hobbies);
        data.push(person);
        res.writeHead(201);
        res.end(JSON.stringify(person));
      })
    } else if (req.method === 'PUT' && personId) {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      })
      req.on('end', () => {
        const { name, age, hobbies } = JSON.parse(body);
        if (!name || !age || !hobbies) throw new CustomError(400, 'The fields "name", "age", "hobbies" is required');
        if (!validate(personId)) throw new CustomError(400, `Not valid id - ${personId}`);
        const person = data.find(item => item.id === personId);
        if (!person) throw new CustomError(404, 'Person not found');
        const updatedPerson = { id: personId, name, age, hobbies };
        data = data.map(item => item.id === personId ? item = { ...updatedPerson } : item)
        res.writeHead(200);
        res.end(JSON.stringify(updatedPerson));
      })
    } else if (req.method === 'DELETE' && personId) {
      
    } else {
      throw new CustomError(404, 'Page not found');
    }
  } catch (error) {
    errorHandler(error, res)
  }
}

const errorHandler = (error, res) => {
  const { status, message, custom } = error;
  if (custom) {
    res.writeHead(status);
    res.end(JSON.stringify({ message }));
  } else {
    res.writeHead(500);
    res.end({ message: 'Server error' });
  }
}

const port = process.env.PORT || 3000;
const server = http.createServer(routes);



server.listen(port, () => console.log(`Server is running on ${port}`))

