/*
Function to draw the profile image.
*/
function render_user_profile() {
  //If there isn't an image, simply return.
  if( global.icon_data.icon_blob_data == null ) { return; }

  //Get a reference to the profile image container.
  const test_profile = document.getElementById("new_oink_icon");

  //Set the profile image container's value to the profile image.
  test_profile.src = global.icon_data.icon_blob_data;

  //Set the dimensions of the profile image.
  const profile_width = (global.icon_data.zoom*global.icon_data.width)/12.5;
  const profile_height = (global.icon_data.zoom*global.icon_data.height)/12.5;
  const profile_offset_x = global.icon_data.offsetX/12.5;
  const profile_offset_y = global.icon_data.offsetY/12.5;
  test_profile.style.width = profile_width + "px";
  test_profile.style.height = profile_height + "px";
  test_profile.style['margin-left'] = profile_offset_x + "px";
  test_profile.style['margin-top'] = profile_offset_y + "px";
}


/*
Attach events to the create new oink message interface.
*/
function attach_to_new_oink() {
  //Get a reference to the new oink message element.
  const new_oink_message = document.getElementById("new_oink_message");

  //Attach a keydown event to the new oink message interface.
  new_oink_message.onkeydown = (event) => {
    //If the text box contains the placeholder message, blank it upon key press.
    if( new_oink_message.innerText == "What's happening?" ) {
      new_oink_message.innerText = "";

      //Set the text color to black, instead of the placeholder text color of grey.
      new_oink_message.style.color = "black";
    }
  };

  //Attach a click event to the new oink message interface.
  new_oink_message.onclick = (event) => {
    if( new_oink_message.innerText == "What's happening?" ) {
      //If the text box contains the placeholder message, select the text so that
      //upon the next keypress the default message will be replaced with whatever
      //the user is typing.
      let range = document.createRange();
      let sel = window.getSelection();
      range.setStart( new_oink_message.childNodes[0], new_oink_message.childNodes[1] );
      range.collapse( true );
      sel.removeAllRanges();
      sel.addRange( range );

      //Set the text color to black, instead of the placeholder text color of grey.
      new_oink_message.style["caret-color"] = "black";
    }
  };

  //Attach the click event listener to the new oink button.
  const new_oink_button = document.getElementById("new_oink_button");
  new_oink_button.addEventListener( 'mousedown', send_new_oink );
}


/*
Detach the new oink mouse-click event listener from the new oink button.
*/
function detach_new_oink_buttons() {
  const new_oink_button = document.getElementById("new_oink_button");
  new_oink_button.removeEventListener( 'mousedown', send_new_oink );
}


/*
Function to sanitize text for the server using regex..

inText: Input text to sanitize.
*/
function process_text( inText ) {
  //Replace apostrophes with HTML code apostrophe.
  const regex = /'/g;
  processed_text = inText.replace( regex, "&#39;" );

  //Replace quotation marks with HTML code quoration marks.
  processed_text = processed_text.replace( /"/g, "&quot;" );

  //Replace new-lines with HTML new line element.
  processed_text = processed_text.replace( /\r\n|\n/g, "<br>" );
  return processed_text;
}


/*
Function to send a new oink to the server.
*/
function send_new_oink() {
  //Get a reference to the new oink interface.
  const new_oink_field = document.getElementById("new_oink_message");

  //Sanitize the text.
  const new_oink_text = process_text( new_oink_field.innerText );

  //Get a timestamp, convert it into server-acceptable format.
  const timestamp_raw = new Date(Date.now());
  const timestamp_string = timestamp_raw.toISOString();
  const date = timestamp_string.substr( 0, 10 );
  const time = timestamp_string.substr( 11, 8 );
  const clean_timestamp = date + " " + time;

  //Ensure that the message is not a placeholder message.
  if( new_oink_text != "What's happening?" ) {
    //Send the message to the server.
    fetch( ip + '/new_oink',
    {
      method: 'POST',
      body: JSON.stringify({
        username_hash: global.username_hash,
        username_plaintext: global.username_plaintext,
        text_content: new_oink_text,
        timestamp: clean_timestamp,
        icon_id: global.icon_id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then( response => response.json() )
  .then( json => {
    //Reset the contents of the new oink to the placeholder text and color.
    new_oink_field.innerHTML = "What's happening?";
    new_oink_field.style.color = "#80808066";

    //Request any new oinks available from the server.
    request_oinks();
  });
  }
}