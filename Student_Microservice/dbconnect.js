const mongoose = require("mongoose");

mongoose.connect("mongodb://admin:Sreymom123@ac-3grmazs-shard-00-00.x0rsgrt.mongodb.net:27017,ac-3grmazs-shard-00-01.x0rsgrt.mongodb.net:27017,ac-3grmazs-shard-00-02.x0rsgrt.mongodb.net:27017/?ssl=true&replicaSet=atlas-p5m3sk-shard-0&authSource=admin&appName=UniversityCluster")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

module.exports = mongoose;