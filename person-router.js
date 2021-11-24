const { validate } = require('uuid');
const Person = require('./models/Person');

let data = [
  {
    id: '51570566-b3b3-4e43-983b-7956a2521379',
    name: 'Jack Jackson',
    age: 33,
    hobbies: ['Football', 'Diving']
  },
  {
    id: '4b6384af-e54a-4ea2-958b-22cc65b12234',
    name: 'Tom Tompson',
    age: 25,
    hobbies: ['Bike']
  }
];

module.exports = (req, res) => {
  try {
    let personId = null;
    if (req.url.match(/^\/person\//) && req.url.split('/').length === 3) personId = req.url.split('/')[2];
    switch (req.method) {
      case 'GET':
        if (req.url === '/person') res.send(200, data);
        else if (personId) {
          if (!validate(personId)) return res.send(400, { message: `Not valid id - ${personId}` });
          const person = data.find(item => item.id === personId);
          if (!person) return res.send(404, { message: 'Person not found' });
          res.send(200, person);
        } else {
          res.send(404, { message: 'Page not found' })
        }
        break;
      case 'POST':
        if (req.url === '/person') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk.toString();
          })
          req.on('end', () => {
            const { name, age, hobbies } = JSON.parse(body);
            if (!name || !age || !hobbies) return res.send(400, { message: 'The fields "name", "age", "hobbies" is required' });
            const person = new Person(name, age, hobbies);
            data.push(person);
            res.send(201, person);
          })
        }
        break;
      case 'PUT':
        if (personId) {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk.toString();
          })
          req.on('end', () => {
            const { name, age, hobbies } = JSON.parse(body);
            if (!name || !age || !hobbies) return res.send(400, { message: 'The fields "name", "age", "hobbies" is required' });
            if (!validate(personId)) return res.send(400, { message: `Not valid id - ${personId}` });
            const person = data.find(item => item.id === personId);
            if (!person) return res.send(404, { message: 'Person not found' });
            const updatedPerson = new Person(name, age, hobbies);
            updatedPerson.id = personId;
            data = data.map(item => item.id === personId ? item = { ...updatedPerson } : item)
            res.send(200, updatedPerson);
          })
        }
        break;
      case 'DELETE':
        if (personId) {
          if (!validate(personId)) return res.send(400, { message: `Not valid id - ${personId}` });
          const person = data.find(item => item.id === personId);
          if (!person) return res.send(404, { message: 'Person not found' });
          data = data.filter(item => item.id !== personId);
          res.send(204, { message: 'Entry has been deleted' });
        }
        break;
      default:
        break;
    }
  } catch (error) {
    res.send(500, { message: 'Server error' });
  }
}