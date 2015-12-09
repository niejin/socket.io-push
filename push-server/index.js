var config = require("./config");
console.log("config " + JSON.stringify(config));
var instance =  process.env.LBS_INSTANCE  || "1";
console.log("starting instance #" + instance);
var ioPort = config["io_" + instance].port;
var apiPort = config["api_" + instance].port;
console.log("start server on port " + ioPort);
var io = require('socket.io')(ioPort);
var socketIoRedis = require('socket.io-redis')({ host: config.redis.host , port: config.redis.port });
io.adapter(socketIoRedis);
var directKey = socketIoRedis.directKey;
console.log(socketIoRedis.directKey);
var redis = require("redis")
var pubClient = redis.createClient({ host: config.redis.host, port: config.redis.port });
var subClient = redis.createClient({ host: config.redis.host, port: config.redis.port });
var redisStore = require('./redisStore.js')(pubClient,subClient,directKey);
var stats = require('./stats.js')();



var proxyServer = require('./proxyServer.js')(io,stats, redisStore);

// push
var restApi = require('./restApi.js')(io, stats,redisStore, apiPort);