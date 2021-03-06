const profile_buttons = {
  "launch_profile_button" : launch_edit_profile_modal,
  "edit_profile_modal_save_button": save_profile
}

function save_profile() {
  const name = document.getElementById("edit_profile_nym").value;
  const bio = document.getElementById("edit_profile_description").value;
  const location = document.getElementById("edit_profile_location").value;
  fetch( 'http://34.209.84.105:3000/set_profile',
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
    get_profile();
    get_nym();
    //TODO: Non-success code.
    //TODO: Redraw profile page.
  });
}

function get_profile() {
  fetch( 'http://34.209.84.105:3000/get_profile/' + global.profile_id,
    {
      'method': 'GET'
    }
  ).then( response => response.json() ).
  then( json => {
    console.dir( json );
    global_profile.location = json.location;
    global_profile.description = json.description;
    render_profile();
    render_edit_profile();
  });
}

function get_nym() {
  fetch( 'http://34.209.84.105:3000/get_nym',
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
    //TODO: Non-success code.
    global.nym = json.nym;
    render_nym();
  });
}

const global_profile = {
  location: null,
  description: null
}

function render_profile() {
console.log( "render profile");
  const bio = document.getElementById("profile_description");
  const location = document.getElementById("profile_location");
  bio.innerHTML = global_profile.description;
  location.innerHTML = global_profile.location;

  render_username();
}

function render_edit_profile() {
  const bio = document.getElementById("edit_profile_description");
  const location = document.getElementById("edit_profile_location");
  bio.value = global_profile.description;
  location.value = global_profile.location;
}

function render_nym() {
  const edit_name = document.getElementById("edit_profile_nym");
  edit_name.value = global.nym;
  const name = document.getElementById("profile_nym");
  name.innerHTML = global.nym;

  const profile_username = document.getElementById("profile_title_bar_text");
  profile_username.innerHTML = global.nym;
}

function render_username() {
  const profile_usernameB = document.getElementById("profile_username");
  profile_usernameB.innerHTML = "@" + global.username_plaintext;
}

function attach_profile_buttons() {
  for( button_name in profile_buttons ) {
    const dom_reference = document.getElementById( button_name ) ;
    dom_reference.addEventListener( 'click', profile_buttons[button_name] );
  }
}

function detach_profile_buttons() {
  for( button_name in profile_buttons ) {
    const dom_reference = document.getElementById( button_name ) ;
    dom_reference.removeEventListener( 'click', profile_buttons[button_name] );
  }
}

function launch_edit_profile_modal() {
  const modal_background = document.getElementById("modal_background");
  modal_background.style.display = 'flex';

  const profile_modal = document.getElementById("edit_profile_modal");
  profile_modal.style.display = 'block';

  render_edit_profile_icon();
  attach_edit_profile_buttons();

}

function render_profile_icon() {
  const edit_profile_icon = document.getElementById("profile_icon");
  edit_profile_icon.src = global.icon_data.icon_blob_data;

  const profile_width = (global.icon_data.zoom*global.icon_data.width)/6.25;
  const profile_height = (global.icon_data.zoom*global.icon_data.height)/6.25;
  const profile_offset_x = global.icon_data.offsetX/6.25;
  const profile_offset_y = global.icon_data.offsetY/6.25;

  edit_profile_icon.style.width = profile_width + "px";
  edit_profile_icon.style.height = profile_height + "px";
  edit_profile_icon.style['margin-left'] = profile_offset_x + "px";
  edit_profile_icon.style['margin-top'] = profile_offset_y + "px";
}

function render_edit_profile_icon() {
  const edit_profile_icon = document.getElementById("edit_profile_icon");
  edit_profile_icon.src = global.icon_data.icon_blob_data;

  const profile_width = (global.icon_data.zoom*global.icon_data.width)/6.25;
  const profile_height = (global.icon_data.zoom*global.icon_data.height)/6.25;
  const profile_offset_x = global.icon_data.offsetX/6.25;
  const profile_offset_y = global.icon_data.offsetY/6.25;

  edit_profile_icon.style.width = profile_width + "px";
  edit_profile_icon.style.height = profile_height + "px";
  edit_profile_icon.style['margin-left'] = profile_offset_x + "px";
  edit_profile_icon.style['margin-top'] = profile_offset_y + "px";
}

function render_edit_profile_background() {
  const edit_profile_background = document.getElementById("edit_profile_background");
  edit_profile_background.src = global.background_data.background_blob_data;

  const profile_width = (global.background_data.zoom*global.background_data.width);
  const profile_height = (global.background_data.zoom*global.background_data.height);
  const profile_offset_x = global.background_data.offsetX;
  const profile_offset_y = global.background_data.offsetY;

  edit_profile_background.style.width = profile_width + "px";
  edit_profile_background.style.height = profile_height + "px";
  edit_profile_background.style['margin-left'] = profile_offset_x + "px";
  edit_profile_background.style['margin-top'] = profile_offset_y + "px";
}

const edit_profile_buttons = {
  "edit_profile_modal_exit_button": close_edit_profile_modal,
  "upload_icon": upload_profile_icon,
  "upload_background": upload_profile_background
}

function attach_edit_profile_buttons() {
  for( button_name in edit_profile_buttons ) {
    const dom_reference = document.getElementById( button_name ) ;
    dom_reference.addEventListener(
      'click',
      edit_profile_buttons[button_name]
    );
  }
}

function detach_edit_profile_buttons() {
  for( button_name in edit_profile_buttons ) {
    const dom_reference = document.getElementById( button_name ) ;
    dom_reference.removeEventListener(
      'click',
      edit_profile_buttons[button_name]
    );
  }
}

function upload_profile_icon() {
  select_icon_image();
}

function upload_profile_background() {
  select_background_image();
}

function close_edit_profile_modal() {
  const profile_modal = document.getElementById("modal_background");
  profile_modal.style.display = "none";
}


function request_background() {
  console.log( "request_background" );
  fetch( 'http://34.209.84.105:3000/background_request/' + global.background_id,
    {
      method: 'GET'
    }
  ).then( response => response.json() )
  .then( json => {
    //TODO: Set poster icon here.
    global.background_data = json.background_data;
    render_user_background();
    render_profile_icon();
    render_edit_profile_background();
  });
}

function render_user_background() {
  const test_profile = document.getElementById("user_background");
  test_profile.src = global.background_data.background_blob_data;

  const profile_width = (global.background_data.zoom*global.background_data.width);
  const profile_height = (global.background_data.zoom*global.background_data.height);
  const profile_offset_x = global.background_data.offsetX;
  const profile_offset_y = global.background_data.offsetY;

  if( screen.width < profile_width ) {
    const ratio = screen.width/profile_width;
    const mobile_screen_width = profile_width * ratio;
    const mobile_screen_height = profile_height * ratio;
    test_profile.style.width = mobile_screen_width + "px";
    test_profile.style.height = mobile_screen_height + "px";
    const mobile_screen_offset_x = profile_offset_x * ratio;
    const mobile_screen_offset_y = profile_offset_y * ratio;
    test_profile.style['margin-left'] = mobile_screen_offset_x + "px";
    test_profile.style['margin-top'] = mobile_screen_offset_y + "px";
  } else {
    test_profile.style.width = profile_width + "px";
    test_profile.style.height = profile_height + "px";
    test_profile.style['margin-left'] = profile_offset_x + "px";
    test_profile.style['margin-top'] = profile_offset_y + "px";
  }
}
