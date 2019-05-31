//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
//var socketio = require('socket.io');
var express = require('express');
var npm = require('./npm');
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
//var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));

/*router.get('/stats/:libName',function(req,res){
  console.log("route called."+req.params.libName);
  npm.getStats(req.params.libName)
  .then(function(statsResponse){
    res.send({
      library:{
        name:req.params.libName,
        stats:statsResponse
      }
    });  
  }).catch(function(statsError){
    res.send({
      library:{
        name:req.params.libName,
        stats:"The stats are not available at the moment"
      },
      error:{
        details:statsError
      }
    });
  });
    
});
*/
router.get('/stats/:libName',function(req,res){
  console.log("details route called."+req.params.libName);
  npm.getAllStats(req.params.libName)
  .then(function(detailsResponse){
    res.send(detailsResponse);  
  }).catch(function(detailsError){
    res.status(404).send({
        code:'LIB_NOT_FOUND',
        message:"The library does not exists or something went wrong.",
        data:null
    });
  });
    
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
