function launch_login_interface() {
  const root_interface = document.getElementById("root_container");
  const login_interface = document.getElementById("login_interface");
  root_interface.style.display = "none";
  login_interface.style.display = "flex";
  attach_login();
}

const login_functions = {
  "button_login": attempt_login,
  "button_create_account": attempt_create_account
}

function attach_login() {
  for( element in login_functions ) {
    const element_ref = document.getElementById( element );
    element_ref.addEventListener( 'click', login_functions[element] );
  }
}

function detach_login() {
  for( element in login_functions ) {
    const element_ref = document.getElementById( element );
    element_ref.removeEventListener( 'click', login_functions[element] );
  }
}

async function attempt_login() {
  const username = document.getElementById("username_field").value;
  const password = document.getElementById("password_field").value;
  fetch( 'https://oinker.xyz:3000/attempt_login',
    {
      method: 'POST',
      body: JSON.stringify({
        "username_hash": md5(username),
        "password_hash": md5(password),
        "username_plaintext": username
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then( response => response.json() )
  .then( json => {
    if( json.result == "approve" ) {
      global.logged = true;
      global.username_hash = md5(username);
      global.username_plaintext = username;
      global.icon_id = json.icon_id;
      global.background_id = json.background_id;
      global.profile_id = json.profile_id;
      launch_oink_interface();
      detach_login();
      get_profile();
      get_nym();
    } else {
//      alert( json.error_message );
      launch_error_modal( json.error_message );
    }
  });
}

async function attempt_create_account() {
  const username = document.getElementById("username_field").value;
  const password = document.getElementById("password_field").value;
  fetch( 'https://oinker.xyz:3000/attempt_create_account',
    {
      method: 'POST',
      body: JSON.stringify({
        "username_hash": md5(username),
        "password_hash": md5(password),
        "username_plaintext": username
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then( response => response.json() )
  .then( json => {
    if( json.result == "approve" ) {
console.log( "new account" );
console.dir( json );
      global.logged = true;
      global.username_hash = md5(username);
      global.username_plaintext = username;
      global.icon_id = json.icon_id;
      global.background_id = json.background_id;
      global.profile_id = json.profile_id;
      launch_oink_interface();
      detach_login();
      get_profile();
      get_nym();
    } else {
      alert( json.error_message );
    }
  });
}

function logout() {
/*  fetch( 'http://34.209.84.105:3000/logout',
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
    console.dir( json );
  });*/
  set_container("home_container");

  global.logged = false;
  global.username_hash = "";
  global.username_plaintext = "";
  document.getElementById("username_field").value = "";
  document.getElementById("password_field").value = "";
  global.icon_id = null;
  global.background_id = null;
  global.profile_id = null;
  global.icon_data = null;
  global.background_data = null;

  const user_background_ref = document.getElementById("user_background");
  user_background_ref.src = "//:0";
  const profile_ref = document.getElementById("profile_icon");
  profile_ref.src = "//:0";
  const new_oink_icon_ref = document.getElementById("new_oink_icon");
  new_oink_icon_ref.src = "//:0";


  detach_menu_buttons();
  detach_profile_buttons();
  detach_new_oink_buttons();
  launch_login_interface();

  const error_modal = document.getElementById("error_modal");
  error_modal.style.display = "none";
}

function reset_globals() {
  icon_global.slicker_click = false;
  icon_global.move_click = false;
  icon_global.start_click_x = 0;
  icon_global.start_click_y = 0;
  icon_global.width = 0;
  icon_global.height = 0;
  icon_global.image_data = null;
  icon_global.zoom = 30;
  icon_global.offsetX = 0;
  icon_global.offsetY = 0;

  background_global.slicker_click = false;
  background_global.move_click = false;
  background_global.start_click_x = 0;
  background_global.start_click_y = 0;
  background_global.width = 0;
  background_global.height = 0;
  background_global.image_data = null;
  background_global.zoom = 30;
  background_global.offsetX = 0;
  background_global.offsetY = 0;
}
