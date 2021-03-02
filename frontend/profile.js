function render_user_profile( icon_data ) {
  const test_profile = document.getElementById("new_oink_icon");
  test_profile.src = icon_data.icon_blob_data;

  const profile_width = (icon_data.zoom*icon_data.width)/12.5;
  const profile_height = (icon_data.zoom*icon_data.height)/12.5;
  const profile_offset_x = icon_data.offsetX/12.5;
  const profile_offset_y = icon_data.offsetY/12.5;

  test_profile.style.width = profile_width + "px";
  test_profile.style.height = profile_height + "px";
  test_profile.style['margin-left'] = profile_offset_x + "px";
  test_profile.style['margin-top'] = profile_offset_y + "px";
}

const profile_buttons = {
  "launch_profile_button" : launch_edit_profile_modal
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
  const profile_modal = document.getElementById("modal_background");
  profile_modal.style.display = "flex";
  attach_edit_profile_buttons();
}

const edit_profile_buttons = {
  "edit_profile_modal_exit_button": close_edit_profile_modal,
  "upload_icon": upload_profile_icon
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
  select_image();
}

function close_edit_profile_modal() {
  const profile_modal = document.getElementById("modal_background");
  profile_modal.style.display = "none";
}
