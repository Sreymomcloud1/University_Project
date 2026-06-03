// STEP-1: IMPORT MONGOOSE PACKAGE
const mongoose = require('mongoose');

// Database Connection URL (localhost)
const uri = 'mongodb://admin:Sreymom123@ac-3grmazs-shard-00-00.x0rsgrt.mongodb.net:27017,ac-3grmazs-shard-00-01.x0rsgrt.mongodb.net:27017,ac-3grmazs-shard-00-02.x0rsgrt.mongodb.net:27017/?ssl=true&replicaSet=atlas-p5m3sk-shard-0&authSource=admin&appName=UniversityCluster';

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    // STEP-2: ESTABLISH CONNECTION WITH MONGODB DATABASE
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // comment out disconnect so connection stays open
    // await mongoose.disconnect();
  }
}

run().catch(console.dir);

// STEP-3: EXPORT MODULE
module.exports = mongoose;