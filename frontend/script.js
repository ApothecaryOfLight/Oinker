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

function detach_new_oink() {

}

function detach_menu_buttons() {

}

function detach_profile_buttons() {

}

function request_icon() {
console.log( "request_icon" );
  fetch( 'http://34.209.84.105:3000/icon_request/' + global.icon_id,
    {
      method: 'GET'
    }
  ).then( response => response.json() )
  .then( json => {
    console.log( "Setting icon data." );
    console.dir( json );
    //TODO: Set poster icon here.
    render_user_profile( json.icon_data );
  });
}

function render_user_profile( icon_data ) {
  console.dir( icon_data );
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
  new_oink_button.addEventListener( 'mousedown', (event) => {
    send_new_oink();
  });
}

function send_new_oink() {
  const new_oink_field = document.getElementById("new_oink_message");
  const new_oink_text = new_oink_field.innerText;

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

let fake_data = {
  news : [
    {
      topic: "Science",
      headline: "Another Rover on Mars",
      message: "Chastisements Abound About Distinction Between GNU and Linux"
    },
    {
      topic: "Entertainment",
      headline: "DC Movies Continue to Be Bad",
      message: "Watch Wandavision! Hahnaissance time! Who would've thought?"
    },
    {
      topic: "Crime",
      headline: "Cocaine Cocoa-Puffs Intercepted",
      message: "Who? Why Cincinnati? Perhaps most perplexingly: how!?"
    },
    {
      topic: "Politics",
      headline: "Miracle Vaccines Eeyored",
      message: "Preventing 100% of serious disease not enough, say insane people."
    }
  ]
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
console.log( "render_icon_html" );
  console.dir( icons[icon_place] );
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
  console.log( img_text );
  return img_text;
}

function render_timeline( inTimeline ) {
  let div = "";
  for( const oink in inTimeline.oinks ) {
    const icon_place = get_icon_place( inTimeline.oinks[oink].icon_id, inTimeline.icons );
    let oink_data = "favicon.ico";
    if( inTimeline.icons != null ) {
      oink_data = inTimeline.icons[icon_place].icon_blob_data;
    }
console.dir( inTimeline.oinks[oink] );
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

function render_whats_happening( news ) {
  let dom = "<div class=\"news_items_title\">What\'s Happening</div>";
  for( const news_item in news ) {
    dom += "<div onclick=\"not_imp_yet()\" class=\"news_item_container\">" +
      "<div class=\"news_item_topic\">" + news[news_item].topic + "</div>" +
      "<div class=\"news_item_headline\">" + news[news_item].headline + "</div>" +
      "<div class=\"news_item_message\">" + news[news_item].message + "</div>" +
    "</div>"
  }

  const opt_container = document.getElementById("news_items_container");
  opt_container.innerHTML = dom;
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
