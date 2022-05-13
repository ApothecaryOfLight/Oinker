/*
function to be called when the profile is updated.
*/
function save_profile() {
  //Get the text values of the profile text fields.
  const name = document.getElementById("edit_profile_nym").value;
  const bio = document.getElementById("edit_profile_description").value;
  const location = document.getElementById("edit_profile_location").value;

  //Send these values to the server.
  fetch( ip + '/set_profile',
    {
      method: 'POST',
      body: JSON.stringify({
        "profile_id": global.profile_id,
        "nym" : name,
        "description": bio,
        "location": location,
        "username_hash": global.username_hash
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then( response => response.json() )
  .then( json => {
    //Upon success, get the updated profile and nym (changeable username, seperate
    //from login credentials).
    get_profile();
    get_nym();
  });
}


/*
Populate the edit profile interface.
*/
function render_edit_profile() {
  const bio = document.getElementById("edit_profile_description");
  const location = document.getElementById("edit_profile_location");
  if( global_profile.description != null ) {
    bio.value = global_profile.description;
  }
  if( global_profile.location != null ) {
    location.value = global_profile.location;
  }
}


/*
Open the edit profile interface.
*/
function launch_edit_profile_modal() {
  //Display the edit profile modal interface.
  const modal_background = document.getElementById("modal_background");
  modal_background.style.display = 'flex';
  const profile_modal = document.getElementById("edit_profile_modal");
  profile_modal.style.display = 'block';

  //Show the profile picture.
  render_edit_profile_icon();

  //Attach button event listeners for the edit profile modal interface.
  attach_edit_profile_buttons();
}


/*
Draw the profile picture in the edit profile interface.
*/
function render_edit_profile_icon() {
  //If there is no image, simply return.
  if( !global.icon_data.icon_blob_data ) { return; }

  //Get a reference to the edit profile interface profile image.
  const edit_profile_icon = document.getElementById("edit_profile_icon");

  //Draw the profile image.
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
Draw the profile background picture in the edit profile interface.
*/
function render_edit_profile_background() {
  //If there is no image, simply return.
  if( !global.background_data.background_blob_data ) { return; }

  //Get a reference to the edit profile interface background image.
  const test_profile = document.getElementById("edit_profile_background");
  
  //Draw the background image.
  test_profile.src = global.background_data.background_blob_data;

  //Set the profile image dimensions.
  const profile_width = (global.background_data.zoom*global.background_data.width);
  const profile_height = (global.background_data.zoom*global.background_data.height);
  const profile_offset_x = global.background_data.offsetX;
  const profile_offset_y = global.background_data.offsetY;

  //Get a reference to the background image container.
  const profile = document.getElementById("edit_profile_background_container");
  //Get the actual dimensions.
  const cc_profile = window.getComputedStyle(profile);
  const profile_element_width = cc_profile.getPropertyValue('width');
  //Remove the trailing "px" so the width can be used in calculations.
  const profile_width_number = profile_element_width.slice(
    0,
    profile_element_width.length-2
  );

  //If the window is smaller than a certain amount,
  if( window.innerWidth < 500 ) {
    //Set these dimensions.
    const ratio = 0.6;
    const mobile_screen_width = profile_width * ratio;
    const mobile_screen_height = profile_height * ratio;
    test_profile.style.width = mobile_screen_width + "px";
    test_profile.style.height = mobile_screen_height + "px";
    const mobile_screen_offset_x = profile_offset_x * ratio;
    const mobile_screen_offset_y = profile_offset_y * ratio;
    test_profile.style['margin-left'] = mobile_screen_offset_x + "px";
    test_profile.style['margin-top'] = mobile_screen_offset_y + "px";

    const container = document.getElementById("edit_profile_background_container");
    container.style.height = (200*ratio) + "px";
  } else if( window.innerWidth < 700 ) {
    //Otherwise, if larger, use these dimensions.
    const ratio = profile_width_number / 600;
    const mobile_screen_width = profile_width * ratio;
    const mobile_screen_height = profile_height * ratio;
    test_profile.style.width = mobile_screen_width + "px";
    test_profile.style.height = mobile_screen_height + "px";
    const mobile_screen_offset_x = profile_offset_x * ratio;
    const mobile_screen_offset_y = profile_offset_y * ratio;
    test_profile.style['margin-left'] = mobile_screen_offset_x + "px";
    test_profile.style['margin-top'] = mobile_screen_offset_y + "px";

    const container = document.getElementById("edit_profile_background_container");
    container.style.height = (200*ratio) + "px";
  } else {
    //Otherwise, if larger still, use these dimensions.
    test_profile.style.width = profile_width + "px";
    test_profile.style.height = profile_height + "px";
    test_profile.style['margin-left'] = profile_offset_x + "px";
    test_profile.style['margin-top'] = profile_offset_y + "px";
  }
}


/*
Edit profile button DOM IDs and their respective functions.
*/
const edit_profile_buttons = {
  "edit_profile_modal_exit_button": close_edit_profile_modal,
  "upload_icon": upload_profile_icon,
  "upload_background": upload_profile_background
}


/*
Attach to each edit profile element its respective function.
*/
function attach_edit_profile_buttons() {
  for( button_name in edit_profile_buttons ) {
    const dom_reference = document.getElementById( button_name ) ;
    dom_reference.addEventListener(
      'click',
      edit_profile_buttons[button_name]
    );
  }
}


/*
Detach all functions from edit profile elements.
*/
function detach_edit_profile_buttons() {
  for( button_name in edit_profile_buttons ) {
    const dom_reference = document.getElementById( button_name ) ;
    dom_reference.removeEventListener(
      'click',
      edit_profile_buttons[button_name]
    );
  }
}


/*
Function to be called upon upload of the profile image.
*/
function upload_profile_icon() {
  select_icon_image();
}


/*
Function to be called upon upload of the profile background image.
*/
function upload_profile_background() {
  select_background_image();
}


/*
Functo to close the edit profile interface.
*/
function close_edit_profile_modal() {
  const profile_modal = document.getElementById("modal_background");
  profile_modal.style.display = "none";
}
