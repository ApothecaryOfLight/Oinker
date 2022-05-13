/*
Function to launch the login interface.
*/
function launch_login_interface() {
  //Get references to the interfaces.
  const root_interface = document.getElementById("root_container");
  const login_interface = document.getElementById("login_interface");

  //Display the login interface and hide the others.
  root_interface.style.display = "none";
  login_interface.style.display = "flex";

  //Attach event listeners.
  attach_login();
}


/*
Login functions as values to be attached to the elements as keys.
*/
const login_functions = {
  "button_login": attempt_login,
  "button_create_account": attempt_create_account
}


/*
Function to attach login events to the login interface elements.
*/
function attach_login() {
  //Iterate through the login functions and attach them to their respective elements.
  for( element in login_functions ) {
    const element_ref = document.getElementById( element );
    element_ref.addEventListener( 'click', login_functions[element] );
  }
}


/*
Function to detach login events from the login interface elements.
*/
function detach_login() {
  //Iterate through the login functions and detach them from their respective elements.
  for( element in login_functions ) {
    const element_ref = document.getElementById( element );
    element_ref.removeEventListener( 'click', login_functions[element] );
  }
}


/*
Function to send a login attemp to the server.
*/
async function attempt_login() {
  //Get the username and password values provided.
  const username = document.getElementById("username_field").value;
  const password = document.getElementById("password_field").value;
  console.log( ip );
  fetch( ip + '/attempt_login',
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
      //On sucess, launch the main interface.
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
      //Otherwise, notify the user of an error.
      launch_error_modal( json.error_message );
    }
  });
}


/*
Function to attempt to create an account.
*/
async function attempt_create_account() {
  //Get the provided username and password values.
  const username = document.getElementById("username_field").value;
  const password = document.getElementById("password_field").value;
  fetch( ip + '/attempt_create_account',
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
      //Upon sucess, launch the main interface.
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
      //Otherwise, notify the user of an error.
      launch_error_modal( json.error_message );
    }
  });
}


/*
Function to be called upon a logout event.
*/
function logout() {
  //Set the interface to the login screen.
  set_container("home_container");

  //Initialize the global variables.
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

  //Blank the images.
  const user_background_ref = document.getElementById("user_background");
  user_background_ref.src = "//:0";
  const profile_ref = document.getElementById("profile_icon");
  profile_ref.src = "//:0";
  const new_oink_icon_ref = document.getElementById("new_oink_icon");
  new_oink_icon_ref.src = "//:0";

  //Detach events, launch the login interface.
  detach_menu_buttons();
  detach_profile_buttons();
  detach_new_oink_buttons();
  launch_login_interface();

  //Hide any modal that is displayed.
  const error_modal = document.getElementById("error_modal");
  error_modal.style.display = "none";
}


/*
Function to reset image globals.
*/
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