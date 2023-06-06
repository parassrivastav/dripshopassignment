const { createClient } = require('redis');
const express = require('express');

const app = express();

async function createUser(user) {
  const client = createClient();

  client.on('error', err => console.log('Redis Client Error', err));

  await new Promise((resolve, reject) => {
    client.on('ready', () => {
      resolve();
    });
    client.on('error', (err) => {
      reject(err);
    });
    client.connect();
  });

  await client.set(user.id + '', JSON.stringify(user));
  const value = await client.get(user.id);

  console.log('user created', value);

  await client.disconnect();
}

async function updateUser(id, user) {
  const client = createClient();

  client.on('error', err => console.log('Redis Client Error', err));

  await new Promise((resolve, reject) => {
    client.on('ready', () => {
      resolve();
    });
    client.on('error', (err) => {
      reject(err);
    });
    client.connect();
  });

  await client.set(id, JSON.stringify(user));
  const value = await client.get(id);

  console.log('user updated', value);

  await client.disconnect();
}

async function readUser(id) {
  const client = createClient();

  client.on('error', err => console.log('Redis Client Error', err));

  await new Promise((resolve, reject) => {
    client.on('ready', () => {
      resolve();
    });
    client.on('error', (err) => {
      reject(err);
    });
    client.connect();
  });

  const value = await client.get(id);

  console.log('reading', value);

  await client.disconnect();

  return value;
}

async function deleteUser(id) {
  const client = createClient();

  client.on('error', err => console.log('Redis Client Error', err));

  await new Promise((resolve, reject) => {
    client.on('ready', () => {
      resolve();
    });
    client.on('error', (err) => {
      reject(err);
    });
    client.connect();
  });

  await client.del(id);

  console.log('user deleted');

  await client.disconnect();
}

app.get('/getUsers', async function (req, res) {
  const client = createClient();

  client.on('error', err => console.log('Redis Client Error', err));

  await new Promise((resolve, reject) => {
    client.on('ready', () => {
      resolve();
    });
    client.on('error', (err) => {
      reject(err);
    });
    client.connect();
  });

  const keys = await client.keys('*');
  const users = [];

  for (const key of keys) {
    const value = await client.get(key);

    try {
      const user = JSON.parse(value);

      // Check if the user matches the query
      if (user && matchesQuery(user, req.query)) {
        users.push(user);
      }
    } catch (err) {
      console.log(`Error parsing user with key ${key}:`, err);
    }
  }

  console.log('users:', users);

  await client.disconnect();

  res.send(users);
});

function matchesQuery(user, query) {
  for (const prop in query) {
    if (!user[prop] || !user[prop].toString().toLowerCase().includes(query[prop].toLowerCase())) {
      return false;
    }
  }
  return true;
}




async function performOperations() {
  await Promise.all([
    createUser({ name: 'John', age: 30, id: '111' }),
      createUser({ name: 'Maria', age: 40, id: '112' }),
        createUser({ name: 'Clara', age: 30, id: '113' }),
        createUser({ name: 'James', age: 30, id: '114' }),
    readUser('111'),
    updateUser('111', { name: 'Mike', age: 31, id: '111' }),
    readUser('111'),
    // deleteUser('111'),
    // readUser('111'),
  ]);
}

performOperations();

app.listen(3001);
