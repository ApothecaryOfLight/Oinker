'use strict;'

function getDomRef( elementName ) {
  return document.getElementById( elementName );
}

function launch_error_modal( error_message, buttons ) {
  const error_modal_ref = getDomRef( "error_modal" );
  const modal_background = getDomRef( "modal_background" );
  const error_message_ref = getDomRef( "error_modal_message" );
  const error_buttons_container = getDomRef( "error_modal_buttons" );

  modal_background.style.display = "flex";
  error_modal_ref.style.display = "flex";

  error_message_ref.innerHTML = error_message;
  let dom = "";
  if( buttons ) {
    for( button_name in buttons ) {
      dom += "<button onclick=\"" + buttons[button_name] + "\">" +
        button_name + "</button>"
    }
  }
  dom += "<button onclick=\"close_error_modal()\">Close</button>";
  error_buttons_container.innerHTML = dom;
}

function close_error_modal() {
  const error_modal_ref = getDomRef( "error_modal" );
  error_modal_ref.style.display = "none";
  const modal_background = getDomRef( "modal_background" );
  modal_background.style.display = "none";
}
