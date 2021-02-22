const express = require('express');
const app = express();
const cors = require('cors');
app.use( cors() );
const body_parser = require('body-parser');
app.use( body_parser.json() );

/*mySQL*/
const mysql = require('mysql2');
const sqlPool = mysql.createPoolPromise({
  host: 'localhost',
  user: 'Oinker_User',
  password: 'Oinker_Password',
  database: 'OinkerDB',
  connectionLimit: 50
});


app.post('/attempt_login', async function(req,res) {
  try {
    const login_query = "SELECT password_hash FROM users WHERE " +
      "username_hash = \'" + req.body.username_hash + "\';"
    const [login_row,login_field] = await sqlPool.query( login_query );
    const password_hash = String.fromCharCode.apply(null, login_row[0].password_hash);
    if( password_hash == req.body.password_hash ) {
      res.send( JSON.stringify({
        "result": "approve",
        "username_hash": req.body.username_hash,
        "username_plaintext": req.body.username_plaintext
      }));
    } else {
      res.send( JSON.stringify({
        "result": "refused",
        "reason": "Credentials failed to authenticate!",
      }));
    }
  } catch( error ) {
    console.log( error );
    res.send( JSON.stringify({
      "result": "refused",
      "reason": "Unspecified."
    }));
  }
});

app.post('/attempt_create_account', async function(req,res) {
  try {
    const create_acct_query = "INSERT INTO users " +
      "( username_hash, password_hash )" +
      " VALUES ( \'" + req.body.username_hash + "\'," +
      " \'" + req.body.password_hash + "\');";
    const [create_acct_row, create_acct_field] =
      await sqlPool.query( create_acct_query );
    res.send( JSON.stringify({
      "result": "approve",
      "username_hash": req.body.username_hash,
      "username_plaintext": req.body.username_plaintext
    }));
  } catch( error ) {
    console.log( error );
    res.send( JSON.stringify({
      "result": "error",
      "error_message": "Unspecified error attempting to create account."
    }));
  }
});


app.post('/bot_post', function(req,res) {
  console.log( "Bot post received." );
  console.log( req.body.bot_username + " says: " + req.body.bot_message );

  res.send( 'Received bot message.' );
});

app.post( '/new_oink', async function(req,res) {
  console.log( "New oink received." );
  console.dir( req.body );

  const get_new_id = "SELECT OinksDB.generate_new_id( 2 ) AS new_id;";
  const [out_id,out_id_fields] = await sqlPool.query( get_new_id );

  const addOinkQuery = "INSERT INTO oinks " +
    "(oink_id, username_hash, username_plaintext, text_content, timestamp) " +
    " VALUES ( " +
    out_id[0].new_id + ", " +
    "\'" + req.body.username_hash + "\', " +
    "\'" + req.body.username_plaintext + "\', " +
    "\'" + req.body.text_content + "\', " +
    "\'" + req.body.timestamp + "\');";

  const [out_row,out_field] = await sqlPool.query( addOinkQuery );

  console.log( out_row );

  //TODO: Error handling.
  res.send( JSON.stringify({
    result: "success"
  }));
});

app.get( '/oinks', function(req,res) {
  console.log( "Oinks get request received." );
  res.send( JSON.stringify({
    oink: "yes"
  }));
});

app.listen( 3000 );
