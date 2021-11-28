const { v4 } = require("uuid");

class Person {
  constructor(name, age, hobbies) {
    this.id = v4();
    this.name = name;
    this.age = age;
    this.hobbies = hobbies.split(',');
  }
}

module.exports = Person;