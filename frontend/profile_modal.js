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
  });
}
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
function launch_edit_profile_modal() {
  const modal_background = document.getElementById("modal_background");
  modal_background.style.display = 'flex';

  const profile_modal = document.getElementById("edit_profile_modal");
  profile_modal.style.display = 'block';

  render_edit_profile_icon();
  attach_edit_profile_buttons();
}

function render_edit_profile_icon() {
  if( !global.icon_data.icon_blob_data ) { return; }

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
  if( !global.background_data.background_blob_data ) { return; }

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
