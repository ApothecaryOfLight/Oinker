const express = require('express');
const app = express();
const cors = require('cors');
app.use( cors() );
const body_parser = require('body-parser');
app.use( body_parser.json({limit:'2mb'}) );

/*mySQL*/
const mysql = require('mysql2');
const sqlPool = mysql.createPoolPromise({
  host: 'localhost',
  user: 'Oinker_User',
  password: 'Oinker_Password',
  database: 'OinkerDB',
  connectionLimit: 50
});

app.get('/icon_request/:icon_id', async function(req,res) {
  try {
    const icon_query = "SELECT * FROM icons WHERE icon_id=" +
      req.params.icon_id + ";"
    const [icon_row,icon_field] = await sqlPool.query( icon_query );
    res.send( JSON.stringify({
      "result": "sucess",
      "icon_data": icon_row[0]
    }));
  } catch(error) {
    console.dir( error );
    res.send( JSON.stringify({
      "result": "error",
      "error_message": "Unspecified icon error."
    }));
  }
});

app.get('/background_request/:background_id', async function(req,res) {
  try {
    const background_query = "SELECT * FROM backgrounds WHERE background_id=" +
      req.params.background_id + ";"
    const [background_row,background_field] = await sqlPool.query( background_query );
    res.send( JSON.stringify({
      "result": "sucess",
      "background_data": background_row[0]
    }));
  } catch(error) {
    console.dir( error );
    res.send( JSON.stringify({
      "result": "error",
      "error_message": "Unspecified background error."
    }));
  }
});

app.post('/upload_icon', async function(req,res) {
  try {
    const insert_icon_query = "UPDATE icons set icon_blob_data = " +
      "\"" + req.body.icon_data + "\", " +
      "offsetX = " + req.body.offsetX + ", " +
      "offsetY = " + req.body.offsetY + ", " +
      "width = " + req.body.width + ", " +
      "height = " + req.body.height + ", " +
      "zoom = " + req.body.zoom + ", " +
      "original_width = " + req.body.original_width + ", " +
      "original_height = " + req.body.original_height + " " +
      "WHERE " + req.body.icon_id + " = icon_id" +
      ";";

    const [icon_row,icon_field] = await sqlPool.query( insert_icon_query );

    res.send( JSON.stringify({
      "result": "success"
    }));
  } catch( error ) {
    console.dir( error );
    res.send( JSON.stringify({
      "result": "error"
    }));
  }
});

app.post('/upload_background', async function(req,res) {
  try {
    const insert_background_query = "UPDATE backgrounds set background_blob_data = " +
      "\"" + req.body.background_data + "\", " +
      "offsetX = " + req.body.offsetX + ", " +
      "offsetY = " + req.body.offsetY + ", " +
      "width = " + req.body.width + ", " +
      "height = " + req.body.height + ", " +
      "zoom = " + req.body.zoom + ", " +
      "original_width = " + req.body.original_width + ", " +
      "original_height = " + req.body.original_height + " " +
      "WHERE " + req.body.background_id + " = background_id" +
      ";";

    const [background_row,background_field] = await sqlPool.query( insert_background_query );

    res.send( JSON.stringify({
      "result": "success"
    }));
  } catch( error ) {
    console.dir( error );
    res.send( JSON.stringify({
      "result": "error"
    }));
  }
});

app.post('/attempt_login', async function(req,res) {
  try {
    const login_query = "SELECT password_hash, icon_id, background_id, profile_id FROM users WHERE " +
      "username_hash = \'" + req.body.username_hash + "\';"
    const [login_row,login_field] = await sqlPool.query( login_query );
    const password_hash = String.fromCharCode.apply(null, login_row[0].password_hash);
    if( password_hash == req.body.password_hash ) {
      res.send( JSON.stringify({
        "result": "approve",
        "username_hash": req.body.username_hash,
        "username_plaintext": req.body.username_plaintext,
        "icon_id": login_row[0].icon_id,
        "background_id": login_row[0].background_id,
        "profile_id": login_row[0].profile_id
      }));
    } else {
      res.send( JSON.stringify({
        "result": "refused",
        "error_message": "Credentials failed to authenticate!",
      }));
    }
  } catch( error ) {
    console.log( error );
    res.send( JSON.stringify({
      "result": "refused",
      "error_message": "Unspecified error occured."
    }));
  }
});

app.post('/attempt_create_account', async function(req,res) {
  try {
    const get_new_id = "SELECT OinkerDB.generate_new_id( 1 ) AS new_id;";
    const [out_id,out_id_fields] = await sqlPool.query( get_new_id );

    const create_icon_query = "INSERT INTO icons " +
      "(icon_id) VALUES " + "( " + out_id[0].new_id + " );";
    const [create_icon_row,create_icon_field] =
      await sqlPool.query( create_icon_query );

    const create_background_query = "INSERT INTO backgrounds " +
      "(background_id) VALUES " + "( " + out_id[0].new_id + " );";
    const [create_background_row,create_background_field] =
      await sqlPool.query( create_background_query );

    const create_profile_query = "INSERT INTO profiles " +
      "(profile_id) VALUES " + "( " + out_id[0].new_id + " );";
    const [create_profile_row,create_profile_field] =
      await sqlPool.query( create_profile_query );


    const create_acct_query = "INSERT INTO users " +
      "( username_hash, password_hash, icon_id, " +
      " background_id, profile_id )" +
      " VALUES ( \'" + req.body.username_hash + "\'," +
      " \'" + req.body.password_hash + "\'," +
      out_id[0].new_id + "," +
      out_id[0].new_id + "," +
      out_id[0].new_id +
      ");";
    const [create_acct_row, create_acct_field] =
      await sqlPool.query( create_acct_query );

    res.send( JSON.stringify({
      "result": "approve",
      "username_hash": req.body.username_hash,
      "username_plaintext": req.body.username_plaintext,
      "icon_id": out_id[0].new_id,
      "background_id": out_id[0].new_id,
      "profile_id": out_id[0].new_id
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
  const get_new_id = "SELECT OinkerDB.generate_new_id( 2 ) AS new_id;";
  const [out_id,out_id_fields] = await sqlPool.query( get_new_id );

  const addOinkQuery = "INSERT INTO oinks " +
    "(oink_id, username_hash, username_plaintext, text_content, icon_id, timestamp) " +
    " VALUES ( " +
    out_id[0].new_id + ", " +
    "\'" + req.body.username_hash + "\', " +
    "\'" + req.body.username_plaintext + "\', " +
    "\'" + req.body.text_content + "\', " +
    req.body.icon_id + ", " +
    "\'" + req.body.timestamp + "\');";

  const [out_row,out_field] = await sqlPool.query( addOinkQuery );

  res.send( JSON.stringify({
    result: "success"
  }));
});

app.post( '/delete_oink', async function(req,res) {
  const delete_query = "DELETE FROM oinks WHERE oink_id=" +
    req.body.oink_id + ";";
  const [del_row,del_field] = await sqlPool.query( delete_query );
  res.send( JSON.stringify({
    result: "success"
  }));
});

//NB: ORDER BY on timestamp is unacceptably inefficient.
//Indexing is required to solve this problem: indexing by topic,
//indexing by following, indexing by popularity, indexing by
//machine learning. Beyond the scope of this project, currently.
app.get( '/oinks', async function(req,res) {
  try {
    const get_oinks_query = "SELECT * FROM oinks ORDER BY timestamp DESC LIMIT 200";
    const [oinks_rows,oinks_fields] = await sqlPool.query( get_oinks_query );

    let icon_ids = [];
    for( entity in oinks_rows ) {
      if( oinks_rows[entity].icon_id != null ) {
        icon_ids.push( oinks_rows[entity].icon_id );
      }
    }
    let icons_rows_ref = null;
    if( icon_ids.length > 0 ) {
      const unique_icon_ids = new Set(icon_ids);
      let unique_icons_list = "";
      for( let unique_icon_id of unique_icon_ids ) {
        unique_icons_list += "icon_id = " + unique_icon_id + " OR ";
      }
      unique_icons_list = unique_icons_list.slice(0, unique_icons_list.length-4 );
      const get_icons_query = "SELECT * FROM icons WHERE " +
        unique_icons_list + ";";
      const [icons_rows,icons_fields] = await sqlPool.query( get_icons_query );
      icons_rows_ref = icons_rows;
    }

    res.send( JSON.stringify({
      "oinks": oinks_rows,
      "icons": icons_rows_ref
    }));
  } catch( error ) {
    console.log( error );
    res.send( JSON.stringify({
      "result": "error",
      "error_message": "Unspecified error attempting to create account."
    }));
  }
});

app.post( '/set_profile', async function(req,res) {
  try {
    const set_profile_query = "UPDATE profiles " +
      "SET location = \"" + req.body.location + "\", " +
      "description = \"" + req.body.description + "\"" +
      " WHERE profile_id = " + req.body.profile_id + ";";
    const [set_profile_row,set_profile_field] =
      await sqlPool.query( set_profile_query );

    const set_nym_query = "UPDATE users " +
      "SET nym = \"" + req.body.nym + "\"" +
      "WHERE username_hash = \"" + req.body.username_hash + "\"";
    const [set_nym_row,set_nym_field] = await sqlPool.query( set_nym_query );

    res.send( JSON.stringify({
      "result": "success"
    }));
  } catch(error) {
    res.send( JSON.stringify({
      "result": "error",
      "error_message": error
    }));
  }
});

app.get( '/get_profile/:profile_id', async function(req,res) {
  try {
    const get_profile_query = "SELECT * FROM profiles " +
      "WHERE profile_id = " + req.params.profile_id + ";"
    console.log( get_profile_query );
    const [get_profile_row,get_profile_field] = await sqlPool.query( get_profile_query );
    res.send( JSON.stringify({
      "description": get_profile_row[0].description,
      "location": get_profile_row[0].location
    }));
  } catch( error ) {
    res.send( JSON.stringify({
      "result": "error",
      "error_message": "Unspecified error message."
    }));
  }
});

app.post( '/get_nym', async function(req,res) {
  try {
    const get_nym_query = "SELECT nym FROM users " +
      "WHERE username_hash = \"" + req.body.username_hash + "\";"
    const [get_nym_row,get_nym_field] = await sqlPool.query( get_nym_query );
    res.send( JSON.stringify({
      "nym": get_nym_row[0].nym
    }));
  } catch(error) {

  }
});

/*HTTP or HTTPS*/
var fs = require('fs');
var https = require('https');
var privateKey;
var certificate;
var credentials;

if( process.argv[2] == "https" ) {
  privateKey = fs.readFileSync('../oinker-privkey.pem');
  certificate = fs.readFileSync('../oinker-fullchain.pem');
  credentials = {key: privateKey, cert: certificate};
  var server = https.createServer( credentials, app );
  server.listen( 3004 );
} else {
  app.listen( 3004 );
}