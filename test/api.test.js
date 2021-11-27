const request = require('supertest')('http://localhost:5000');

describe('api tests', () => {
  let id = null;
  test('get status code 200', async () => {
    const res = await request.get('/person');
    expect(res.statusCode).toBe(200);
  })
  test('create new person, status code 201', async () => {
    const newPerson = { name: 'Jack', age: 30, hobbies: 'Bike,Diving' };
    const res = await request.post('/person').send(newPerson);
    id = JSON.parse(res.text).id;
    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res.text)).toEqual({ id, name: 'Jack', age: 30, hobbies: ['Bike', 'Diving'] });
  })
  test('get person', async () => {
    const res = await request.get('/person/' + id);
    expect(JSON.parse(res.text)).toEqual({ id, name: 'Jack', age: 30, hobbies: ['Bike', 'Diving'] });
  })
  test('update person', async () => {
    newPerson = { name: 'Jack', age: 33, hobbies: 'Bike,Diving,Theater' };
    const res = await request.put('/person/' + id).send(newPerson);
    expect(JSON.parse(res.text)).toEqual({ id, name: 'Jack', age: 33, hobbies: ['Bike', 'Diving', 'Theater'] });
  })
  test('delete person', async () => {
    const res = await request.delete('/person/' + id);
    expect(res.statusCode).toBe(204);
  })
})