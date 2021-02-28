function launch_login_interface() {
  const root_interface = document.getElementById("root_container");
  const login_interface = document.getElementById("login_interface");
  root_interface.style.display = "none";
  login_interface.style.display = "flex";
  attach_login();
}

function attach_login() {
  const login_button = document.getElementById("button_login");
  const create_account_button = document.getElementById("button_create_account");
  document.getElementById("username_field").value = "";
  document.getElementById("password_field").value = "";
  login_button.addEventListener( 'click', (event) => {
    const username_field = document.getElementById("username_field");
    const password_field = document.getElementById("password_field");
    console.log( "Attempting login!" );
    attempt_login( username_field.value, password_field.value );
  });
  create_account_button.addEventListener( 'click', (event) => {
    console.log( "Attempting create account!" );
    attempt_create_account( username_field.value, password_field.value );
  });
}

function detach_login() {

}

async function attempt_login( inUsername, inPassword ) {
  fetch( 'http://34.209.84.105:3000/attempt_login',
    {
      method: 'POST',
      body: JSON.stringify({
        "username_hash": md5(inUsername),
        "password_hash": md5(inPassword),
        "username_plaintext": inUsername
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then( response => response.json() )
  .then( json => {
    if( json.result == "approve" ) {
      global.logged = true;
      global.username_hash = md5(inUsername);
      global.username_plaintext = inUsername;
      global.icon_id = json.icon_id;
      launch_oink_interface();
    } else {
      alert( json.error_message );
    }
  });
}

async function attempt_create_account( inUsername, inPassword ) {
  fetch( 'http://34.209.84.105:3000/attempt_create_account',
    {
      method: 'POST',
      body: JSON.stringify({
        "username_hash": md5(inUsername),
        "password_hash": md5(inPassword),
        "username_plaintext": inUsername
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then( response => response.json() )
  .then( json => {
    if( json.result == "approve" ) {
      global.logged = true;
      global.username_hash = md5(inUsername);
      global.username_plaintext = inUsername;
      global.icon_id = json.icon_id;
      launch_oink_interface();
    } else {
      alert( json.error_message );
    }
  });
}

function logout() {
  fetch( 'http://34.209.84.105:3000/logout',
    {
      method: 'POST',
      body: JSON.stringify({
        "username_hash": global.username_hash
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then( response => response.json() )
  .then( json => {
/*    if( json.result == "approve" ) {
    } else {
      alert( json.error_message );
    }*/
  });
  global.logged = false;
  global.username_hash = "";
  global.username_plaintext = "";
  global.icon_id = null;
  launch_login_interface();
}
