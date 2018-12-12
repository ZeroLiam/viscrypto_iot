var app = require('express')();
var http = require('http').Server(app);

app.get('/select-files', function(req, res){
  res.send('<h1>Hello world</h1>');
});

http.listen(8081, function(){
  console.log('listening on *:8081');
});