'use strict';

console.log( "Yipee!" );

window.addEventListener( 'load', (event)=> {
  render_whats_happening( fake_data.news );

  launch_login_interface();
});

function launch_oink_interface() {
  const root_interface = document.getElementById("root_container");
  const login_interface = document.getElementById("login_interface");
  root_interface.style.display = "grid";
  login_interface.style.display = "none";
  attach_to_new_oink();
  attach_menu_buttons();
  attach_profile_buttons();
  request_oinks();
  request_icon();
}

function request_icon() {
  fetch( 'http://34.209.84.105:3000/icon_request/' + global.icon_id,
    {
      method: 'GET'
    }
  ).then( response => response.json() )
  .then( json => {
    //TODO: Set poster icon here.
    render_user_profile( json.icon_data );
  });
}

function set_container( inContainerName ) {
  const container_names = [
    "home_container",
    "messages_container",
    "profile_container"
  ];
  container_names.forEach( name => {
    const container = document.getElementById(name);
    if( inContainerName == name ) {
      container.style.display = "block";
    } else {
      container.style.display = "none";
    }
  });
}

function timestampToString( then ) {
  const now_raw = new Date(Date.now());
  const now = now_raw.toISOString();
  const simple_date = then.substr(0, 5);

  const then_year = then.substr( 0, 4 );
  const then_month = then.substr( 5, 2 );
  const then_day = then.substr( 8, 2 );
  const then_hour = then.substr( 11, 2 );
  const then_minute = then.substr( 14, 2 );

  const now_year = now.substr( 0, 4 );
  const now_month = now.substr( 5, 2 );
  const now_day = now.substr( 8, 2 );
  const now_hour = now.substr( 11, 2 );
  const now_minute = now.substr( 14, 2 );

  const diff_year = now_year - then_year;
  const diff_month = now_month - then_month;
  const diff_day = now_day - then_day;
  const diff_hour = now_hour - then_hour;
  const diff_minute = now_minute - then_minute;

  const packed_date = new Date(then);

  var opt = { month: 'short', day: 'numeric' };
  const short_date = new Date(then).toLocaleDateString( 'en-US', opt );

  opt = { month: 'short', day: 'numeric', year: 'numeric' };
  const long_date = new Date(then).toLocaleDateString( 'en-US', opt );

  if( diff_year >= 1 ) {
    return( long_date );
  } else if( diff_month >= 1 ) {
    return( short_date );
  } else if( diff_day >= 1 ) {
    return( short_date );
  } else if( diff_hour >= 1 ) {
    return( diff_hour +  "h" );
  } else if( diff_minute >= 1 ) {
    return( diff_minute + "m" );
  } else {
    return( "Now" );
  }
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
    fetch( 'http://34.209.84.105:3000/delete_oink',
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
          "<div class=\"oink_button_container\">" + "buttons here" + "</div>" +
        "</div>" +
      "</div>";
    timestampToString( inTimeline.oinks[oink].timestamp );
  }

  const main_container = document.getElementById("timeline_container");
  main_container.innerHTML = div;
}

function not_imp_yet() {
  alert( "Not implemented yet." );
}

async function request_oinks() {
  global.last_get = Date.now();
  fetch( 'http://34.209.84.105:3000/oinks',
    {
      method: 'GET'
    }
  )
    .then( response => response.json() )
    .then( json => {
      render_timeline( json );
    });
}

const global = {
  logged: false,
  username_hash: "",
  username_plaintext: "",
  last_get: "",
  icon_id: null,
  icon_data: null
}

window.addEventListener( 'mousemove', (event) => {
  if( global.logged == true ) {
    const now = Date.now();
    if( now - global.last_get > 5000 ) {
      request_oinks();
    }
  }
});
