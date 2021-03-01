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

function attach_profile_buttons() {
  const launch_profile_button = document.getElementById("launch_profile_button");
  launch_profile_button.addEventListener( 'click', (click) => {
    const profile_modal = document.getElementById("modal_background");
    profile_modal.style.display = "flex";
    attach_edit_profile_buttons();
  });
}

function attach_edit_profile_buttons() {
  const exit_profile_modal_button = document.getElementById("edit_profile_modal_exit_button");
  exit_profile_modal_button.addEventListener( 'click', (click) => {
    const profile_modal = document.getElementById("modal_background");
    profile_modal.style.display = "none";
  });

  const edit_profile_upload_icon = document.getElementById("upload_icon");
  edit_profile_upload_icon.addEventListener( 'click', (click) => {
    console.log( "upload profile image" );
    select_image();
  });
}
