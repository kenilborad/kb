const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/socio-kb').then(() => {
  console.log('Database connected successfully.......');
}).catch((err) => {
  console.log(err);
});

// const { MongoClient } = require('mongodb');

// async function getCurrentOps(host) {
//   const client = await MongoClient.connect(`mongodb://${host}:27017`);
//   const db = client.db('event-management-mongoose');
//   const ops = await db.command({ currentOp: 1 });
//   client.close();
//   return ops;
// }

// async function monitorCluster() {
//   const hosts = ['127.0.0.1'];
//   const ops = await Promise.all(hosts.map(getCurrentOps));
//   console.log('Current operations on cluster:', ops);
// }

// setInterval(monitorCluster, 600);
