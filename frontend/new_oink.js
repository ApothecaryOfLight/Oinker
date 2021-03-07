/*New Oink*/
function render_user_profile() {
  const test_profile = document.getElementById("new_oink_icon");
  test_profile.src = global.icon_data.icon_blob_data;

  const profile_width = (global.icon_data.zoom*global.icon_data.width)/12.5;
  const profile_height = (global.icon_data.zoom*global.icon_data.height)/12.5;
  const profile_offset_x = global.icon_data.offsetX/12.5;
  const profile_offset_y = global.icon_data.offsetY/12.5;

  test_profile.style.width = profile_width + "px";
  test_profile.style.height = profile_height + "px";
  test_profile.style['margin-left'] = profile_offset_x + "px";
  test_profile.style['margin-top'] = profile_offset_y + "px";
}


function attach_to_new_oink() {
  const new_oink_message = document.getElementById("new_oink_message");
  new_oink_message.onkeydown = (event) => {
    if( new_oink_message.innerText == "What's happening?" ) {
      new_oink_message.innerText = "";
      new_oink_message.style.color = "black";
    }
  };
  new_oink_message.onclick = (event) => {
    if( new_oink_message.innerText == "What's happening?" ) {
      let range = document.createRange();
      let sel = window.getSelection();
      range.setStart( new_oink_message.childNodes[0], new_oink_message.childNodes[1] );
      range.collapse( true );
      sel.removeAllRanges();
      sel.addRange( range );
      new_oink_message.style["caret-color"] = "black";
    }
  };

  const new_oink_button = document.getElementById("new_oink_button");
  new_oink_button.addEventListener( 'mousedown', send_new_oink );
}

function detach_new_oink_buttons() {
  const new_oink_button = document.getElementById("new_oink_button");
  new_oink_button.removeEventListener( 'mousedown', send_new_oink );
}

function process_text( inText ) {
  const regex = /'/;
  processed_text = inText.replace( regex, "&#39;" );
  processed_text = processed_text.replace( /"/, "&quot;" );
  return processed_text;
}

function send_new_oink() {
  const new_oink_field = document.getElementById("new_oink_message");
  const new_oink_text = process_text( new_oink_field.innerText );
  const timestamp_raw = new Date(Date.now());
  const timestamp_string = timestamp_raw.toISOString();
  const date = timestamp_string.substr( 0, 10 );
  const time = timestamp_string.substr( 11, 8 );
  const clean_timestamp = date + " " + time;

  if( new_oink_text != "What's happening?" ) {
    fetch( 'http://34.209.84.105:3000/new_oink',
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
    //console.dir( json );
    new_oink_field.innerHTML = "What's happening?";
      new_oink_field.style.color = "#80808066";
    request_oinks();
  });
  }
}
