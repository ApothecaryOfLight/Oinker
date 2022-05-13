/*
Global object conatining the DOM IDs as keys and the functions to bind to them as
values.
*/
const profile_buttons = {
  "launch_profile_button" : launch_edit_profile_modal,
  "edit_profile_modal_save_button": save_profile
}


/*
Function to request from the server the user's profile.
*/
function get_profile() {
  fetch( ip + '/get_profile/' + global.profile_id,
    {
      'method': 'GET'
    }
  ).then( response => response.json() ).
  then( json => {
    //Set the global profile values.
    global_profile.location = json.location;
    global_profile.description = json.description;

    //Draw the profile's relevant data to screen.
    render_profile();

    //Draw the profile's relevant data to the edit profile interface.
    render_edit_profile();
  });
}


/*
Function to fetch the user's nym (changeable username, seperate from the login
credentials) from the server.
*/
function get_nym() {
  fetch( ip + '/get_nym',
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
    global.nym = json.nym;
    render_nym();
  });
}


/*
Global object containing profile data.
*/
const global_profile = {
  location: null,
  description: null
}


/*
Function to use the profile data to fill in the relevant text fields.
*/
function render_profile() {
  const bio = document.getElementById("profile_description");
  const location = document.getElementById("profile_location");
  if( global_profile.description != null ) {
    bio.innerHTML = global_profile.description;
  }
  if( global_profile.location != null ) {
    location.innerHTML = global_profile.location;
  }
  render_username();
}


/*
Function to fill in the profile nym where appropraite.
*/
function render_nym() {
  const edit_name = document.getElementById("edit_profile_nym");
  edit_name.value = global.nym;
  const name = document.getElementById("profile_nym");
  name.innerHTML = global.nym;

  const profile_username = document.getElementById("profile_title_bar_text");
  profile_username.innerHTML = global.nym;
}


/*
Function to fill in the username where appropraite.
*/
function render_username() {
  const profile_usernameB = document.getElementById("profile_username");
  profile_usernameB.innerHTML = "@" + global.username_plaintext;
}


/*
Function to attach event listeners to profile buttons.
*/
function attach_profile_buttons() {
  for( button_name in profile_buttons ) {
    const dom_reference = document.getElementById( button_name ) ;
    dom_reference.addEventListener( 'click', profile_buttons[button_name] );
  }
}


/*
Function to detach event listeners from profile buttons.
*/
function detach_profile_buttons() {
  for( button_name in profile_buttons ) {
    const dom_reference = document.getElementById( button_name ) ;
    dom_reference.removeEventListener( 'click', profile_buttons[button_name] );
  }
}


/*
Function to draw the profile icon where appropriate.
*/
function render_profile_icon() {
  //If there is no image, simply return.
  if( !global.icon_data.icon_blob_data ) { return; }

  //Get a reference to the profile icon container.
  const edit_profile_icon = document.getElementById("profile_icon");

  //Put the image data into the profile icon container.
  edit_profile_icon.src = global.icon_data.icon_blob_data;

  //Set the profile image dimensions.
  const profile_width = (global.icon_data.zoom*global.icon_data.width)/6.25;
  const profile_height = (global.icon_data.zoom*global.icon_data.height)/6.25;
  const profile_offset_x = global.icon_data.offsetX/6.25;
  const profile_offset_y = global.icon_data.offsetY/6.25;
  edit_profile_icon.style.width = profile_width + "px";
  edit_profile_icon.style.height = profile_height + "px";
  edit_profile_icon.style['margin-left'] = profile_offset_x + "px";
  edit_profile_icon.style['margin-top'] = profile_offset_y + "px";
}


/*
Function to request the profile background from the server.
*/
function request_background() {
  console.log( "request_background" );
  fetch( ip + '/background_request/' + global.background_id,
    {
      method: 'GET'
    }
  ).then( response => response.json() )
  .then( json => {
    //Upon success, store the background image data.
    global.background_data = json.background_data;

    //Draw the background image.
    render_user_background();

    //Add an event listener to redraw the background upon window resizing.
    window.addEventListener( 'resize', render_user_background );

    //Add the background image to the edit profile interface.
    render_edit_profile_background();
  });
}


/*
Function to draw the user background.
*/
function render_user_background() {
  //If there is no background image, simply return.
  if( !global.background_data.background_blob_data ) {
    return;
  }

  //Get a reference to the user background container.
  const test_profile = document.getElementById("user_background");

  //Assign the user background image to the container.
  test_profile.src = global.background_data.background_blob_data;

  //Set the dimensions of the user background image.
  const profile_width = (global.background_data.zoom*global.background_data.width);
  const profile_height = (global.background_data.zoom*global.background_data.height);
  const profile_offset_x = global.background_data.offsetX;
  const profile_offset_y = global.background_data.offsetY;

  //Get the real size of the background image after CSS has been applied.
  const profile = document.getElementById("profile_container");
  const cc_profile = window.getComputedStyle(profile);
  const profile_element_width = cc_profile.getPropertyValue('width');
  //Remove the trailing "px" so the value can be used for computation.
  const profile_width_number = profile_element_width.slice(
    0,
    profile_element_width.length-2
  );

  //Based upon the size of the window, set the following image dimensions.
  if( window.innerWidth < 500 ) {
    const ratio = 0.6;
    const mobile_screen_width = profile_width * ratio;
    const mobile_screen_height = profile_height * ratio;
    test_profile.style.width = mobile_screen_width + "px";
    test_profile.style.height = mobile_screen_height + "px";
    const mobile_screen_offset_x = profile_offset_x * ratio;
    const mobile_screen_offset_y = profile_offset_y * ratio;
    test_profile.style['margin-left'] = mobile_screen_offset_x + "px";
    test_profile.style['margin-top'] = mobile_screen_offset_y + "px";
    const container = document.getElementById("user_background_container");
    container.style.height = (200*ratio) + "px";
  } else if( window.innerWidth < 700 ) {
    const ratio = profile_width_number / 600;
    const mobile_screen_width = profile_width * ratio;
    const mobile_screen_height = profile_height * ratio;
    test_profile.style.width = mobile_screen_width + "px";
    test_profile.style.height = mobile_screen_height + "px";
    const mobile_screen_offset_x = profile_offset_x * ratio;
    const mobile_screen_offset_y = profile_offset_y * ratio;
    test_profile.style['margin-left'] = mobile_screen_offset_x + "px";
    test_profile.style['margin-top'] = mobile_screen_offset_y + "px";
    const container = document.getElementById("user_background_container");
    container.style.height = (200*ratio) + "px";
  } else {
    test_profile.style.width = profile_width + "px";
    test_profile.style.height = profile_height + "px";
    test_profile.style['margin-left'] = profile_offset_x + "px";
    test_profile.style['margin-top'] = profile_offset_y + "px";
  }
}