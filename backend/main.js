const express = require('express');
const app = express();
const cors = require('cors');
app.use( cors() );
const body_parser = require('body-parser');
app.use( body_parser.json() );


app.post('/bot_post', function(req,res) {
  console.log( "Bot post received." );
  console.log( req.body.bot_username + " says: " + req.body.bot_message );

  res.send( 'Received bot message.' );
});

app.get( '/oinks', function(req,res) {
  console.log( "Oinks get request received." );
  res.send( JSON.stringify({
    oink: "yes"
  }));
});

app.listen( 3000 );
