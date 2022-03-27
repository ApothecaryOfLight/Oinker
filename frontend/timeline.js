async function request_oinks() {
  global.last_get = Date.now();
  fetch( ip + '/oinks',
    {
      method: 'GET'
    }
  )
    .then( response => response.json() )
    .then( json => {
      render_timeline( json );
    });
}

function render_timeline( inTimeline ) {
  let div = "";
  for( const oink in inTimeline.oinks ) {
    const icon_place = get_icon_place( inTimeline.oinks[oink].icon_id, inTimeline.icons );
    let oink_data = "favicon.ico";
    if( inTimeline.icons != null ) {
      oink_data = inTimeline.icons[icon_place].icon_blob_data;
    }
    div +=
      "<div class=\"oink\">" +
        "<div class=\"oink_icon_container\">" +
          render_icon_html( inTimeline.icons, icon_place ) +
        "</div>" +
        "<div class=\"oink_name_container\">" +
          "<div class=\"oink_nym\">" + inTimeline.oinks[oink].username_plaintext + "</div>" + 
          "<div class=\"oink_name_id\"></div>" +
          "<div class=\"oink_time\">&nbsp;&#x22C5;&nbsp;" +
            timestampToString( inTimeline.oinks[oink].timestamp ) +
          "</div>" +
          render_delete_html( inTimeline.oinks[oink] ) +
        "</div>" +
        "<div class=\"oink_message_container\">" +
          "<div class=\"oink_message\">" +
            inTimeline.oinks[oink].text_content +
          "</div>" +
          "<div class=\"oink_button_container\">" + "<!--buttons here-->" + "</div>" +
        "</div>" +
      "</div>";
    timestampToString( inTimeline.oinks[oink].timestamp );
  }

  const main_container = document.getElementById("timeline_container");
  main_container.innerHTML = div;
}

function get_icon_place( icon_id, icons_obj ) {
  for( let icon_place in icons_obj ) {
    if( icons_obj[icon_place].icon_id == icon_id ) {
      return icon_place;
    }
  }
}

function render_icon_html( icons, icon_place ) {
  const profile_width = (icons[icon_place].zoom*icons[icon_place].width)/12.5;
  const profile_height = (icons[icon_place].zoom*icons[icon_place].height)/12.5;
  const profile_offset_x = icons[icon_place].offsetX/12.5;
  const profile_offset_y = icons[icon_place].offsetY/12.5;
  const img_text = "<img class=\"oink_icon\" " +
    "style=\"" +
    "width : " + profile_width + "px;" +
    " height : " + profile_height + "px;" +
    " margin-left : " + profile_offset_x + "px;" +
    " margin-right : " + profile_offset_y + "px;" +
    "\" src=\"" + icons[icon_place].icon_blob_data + "\"\>";
  return img_text;
}

function render_delete_html( oink ) {
  const username_hash =
    String.fromCharCode.apply( null, oink.username_hash.data );
  if( username_hash == global.username_hash ) {
    const del_button = "<button onclick=\"delete_oink(" + oink.oink_id +
      ")\">X</button>";
    return del_button;
  }
  return "";
}

function delete_oink( oink_id ) {
  console.log( "Sending delete to server for " + oink_id + "." );
    fetch( ip + '/delete_oink',
    {
      method: 'POST',
      body: JSON.stringify({
        "oink_id": oink_id
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then( response => response.json() )
  .then( json => {
    //console.dir( json );
    request_oinks();
  });
}
