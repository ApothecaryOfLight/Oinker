function save_profile() {
  const name = document.getElementById("edit_profile_nym").value;
  const bio = document.getElementById("edit_profile_description").value;
  const location = document.getElementById("edit_profile_location").value;
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
console.log( "render_edit_profile_background" );
  const test_profile = document.getElementById("edit_profile_background");
  test_profile.src = global.background_data.background_blob_data;

/*  const profile_width = (global.background_data.zoom*global.background_data.width);
  const profile_height = (global.background_data.zoom*global.background_data.height);
  const profile_offset_x = global.background_data.offsetX;
  const profile_offset_y = global.background_data.offsetY;

  edit_profile_background.style.width = profile_width + "px";
  edit_profile_background.style.height = profile_height + "px";
  edit_profile_background.style['margin-left'] = profile_offset_x + "px";
  edit_profile_background.style['margin-top'] = profile_offset_y + "px";*/
  const profile_width = (global.background_data.zoom*global.background_data.width);
  const profile_height = (global.background_data.zoom*global.background_data.height);
  const profile_offset_x = global.background_data.offsetX;
  const profile_offset_y = global.background_data.offsetY;

  const profile = document.getElementById("edit_profile_background_container");
  const cc_profile = window.getComputedStyle(profile);
  const profile_element_width = cc_profile.getPropertyValue('width');
  const profile_width_number = profile_element_width.slice(
    0,
    profile_element_width.length-2
  );
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

    const container = document.getElementById("edit_profile_background_container");
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

    const container = document.getElementById("edit_profile_background_container");
    container.style.height = (200*ratio) + "px";
  } else {
    test_profile.style.width = profile_width + "px";
    test_profile.style.height = profile_height + "px";
    test_profile.style['margin-left'] = profile_offset_x + "px";
    test_profile.style['margin-top'] = profile_offset_y + "px";
  }
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
