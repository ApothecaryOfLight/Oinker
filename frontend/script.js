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
    //global.user_icon = json.icon.icon_blob_data;
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
    //launch_edit_profile_modal();
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
/*    launch_image_framing_modal();
return;
    console.log( "upload icon." );
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL( file );
      reader.onload = readerEvent => {
        console.dir( readerEvent );
        const size = readerEvent.total/1000000;
        console.log( size + "mb" );
        if( size > 15 ) {
          alert("Image too large! 16mb limit." );
          return;
        }
        const mime_type = readerEvent.srcElement.result.substr(
          5,
          readerEvent.srcElement.result.indexOf(";")-5
        );

        const content = readerEvent.target.result;
        const pos = readerEvent.target.result.indexOf( "," );
        const data = content.substr( pos+1 );

        fetch( 'http://34.209.84.105:3000/upload_icon',
          {
            method: 'POST',
            body: JSON.stringify({
              "icon_id": global.icon_id,
              "icon_data" : ("data:" + mime_type + ";base64," + data)
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ).then( response => response.json() )
        .then( json => {
          const image = document.getElementById("edit_profile_icon");
          image.src = json.icon_data;
        });
      }
    };
    input.click();*/
  });
}

function set_container( inContainerName ) {
  const container_names = [
    "home_container",
    "messages_container",
    "profile_container"
  ];
  container_names.forEach( name => {
console.log( name );
    const container = document.getElementById(name);
    if( inContainerName == name ) {
      container.style.display = "block";
    } else {
      container.style.display = "none";
    }
  });
}

function attach_menu_buttons() {
  const menu_home = document.getElementById("menu_button_home");
//  const menu_notification = document.getElementById("menu_button_notification");
  const menu_email = document.getElementById("menu_button_email");
//  const menu_search = document.getElementById("menu_button_search");
  const menu_profile = document.getElementById("menu_button_profile");
  const menu_new_oink = document.getElementById("menu_button_new_oink");
  menu_home.addEventListener( 'click', (click) => {
    set_container( "home_container" );
  });
/*  menu_notification.addEventListener( 'click', (click) => {
    not_imp_yet();
  });*/
  menu_email.addEventListener( 'click', (click) => {
    not_imp_yet();
  });
/*  menu_search.addEventListener( 'click', (click) => {
    not_imp_yet();
  });*/
  menu_profile.addEventListener( 'click', (click) => {
    set_container( "profile_container" );
  });
  menu_new_oink.addEventListener( 'click', (click) => {
    not_imp_yet();
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
  //console.log( timestamp_raw );
  const timestamp_string = timestamp_raw.toISOString();
  //console.log( timestamp_string );
  const date = timestamp_string.substr( 0, 10 );
  //console.log( date );
  const time = timestamp_string.substr( 11, 8 );
  //console.log( time );
  const clean_timestamp = date + " " + time;
  //console.log( clean_timestamp );

  if( new_oink_text != "What's happening?" ) {
    //console.log( new_oink_text );
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
//render_icon_html( inTimeline.icons, icon_place );
    div +=
      "<div class=\"oink\">" +
        "<div class=\"oink_icon_container\">" +
//          "<img class=\"oink_icon\" src=\"" + oink_data + "\"\>" +
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

function launch_login_interface() {
  const root_interface = document.getElementById("root_container");
  const login_interface = document.getElementById("login_interface");
  root_interface.style.display = "none";
  login_interface.style.display = "flex";
  attach_login();
}

function attach_login() {
  const login_button = document.getElementById("button_login");
  const create_account_button = document.getElementById("button_create_account");
  login_button.addEventListener( 'click', (event) => {
    const username_field = document.getElementById("username_field");
    const password_field = document.getElementById("password_field");
    console.log( "Attempting login!" );
    attempt_login( username_field.value, password_field.value );
  });
  create_account_button.addEventListener( 'click', (event) => {
    console.log( "Attempting create account!" );
    attempt_create_account( username_field.value, password_field.value );
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

async function attempt_login( inUsername, inPassword ) {
  fetch( 'http://34.209.84.105:3000/attempt_login',
    {
      method: 'POST',
      body: JSON.stringify({
        "username_hash": md5(inUsername),
        "password_hash": md5(inPassword),
        "username_plaintext": inUsername
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then( response => response.json() )
  .then( json => {
    if( json.result == "approve" ) {
      global.logged = true;
      global.username_hash = md5(inUsername);
      global.username_plaintext = inUsername;
      global.icon_id = json.icon_id;
      launch_oink_interface();
    } else {
      alert( json.error_message );
    }
  });
}

async function attempt_create_account( inUsername, inPassword ) {
  fetch( 'http://34.209.84.105:3000/attempt_create_account',
    {
      method: 'POST',
      body: JSON.stringify({
        "username_hash": md5(inUsername),
        "password_hash": md5(inPassword),
        "username_plaintext": inUsername
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then( response => response.json() )
  .then( json => {
    if( json.result == "approve" ) {
      global.logged = true;
      global.username_hash = md5(inUsername);
      global.username_plaintext = inUsername;
      global.icon_id = json.icon_id;
      launch_oink_interface();
    } else {
      alert( json.error_message );
    }
  });
}

window.addEventListener( 'mousemove', (event) => {
  if( global.logged == true ) {
    const now = Date.now();
    if( now - global.last_get > 5000 ) {
      request_oinks();
    }
  }
});


/*function launch_edit_profile_modal() {
  console.log( "launch_edit_profile_modal" );
}*/

/*function render_framing_modal_icon() {
  console.log( "render_framing_modal_icon" );
  console.dir( global );
  if( global.user_icon != null ) {
    console.log( "yepp" );
    const dom = "<img id=\"framed_image\" class=\"framing_image\" src=\"" + global.user_icon + "\">";
    const image_container = document.getElementById("image_framing_modal_image_container" );
    image_container.innerHTML = dom;
    make_div_draggable();
  }
}*/

/*const mouse_obj = {
  start_click : {
    x: null,
    y: null
  },
  end_click: {
    x: null,
    y: null
  },
  isClicked: false
}
function make_div_draggable() {
  const frame = document.getElementById("image_frame");
  frame.addEventListener( 'mousedown', (click) => {
    mouse_obj.isClicked = true;
  });
  document.addEventListener( 'mousemove', (move) => {
    if( mouse_obj.isClicked == true ) {
      console.dir( move );
      console.dir( frame );
      frame.style.left = move.offsetX + "px";
      frame.style.top = move.offsetY + "px";
    }
  });
  document.addEventListener( 'mouseup', (unclick) => {
    mouse_obj.isClicked = false;
  });
}*/

/*function launch_image_framing_modal() {
  console.log( "launch_image_framing_modal" );
  const image_framing_modal = document.getElementById("image_framing_modal");
  image_framing_modal.style.display = "flex";
  if( global.icon_data != null ) {
    const dom = "<img class=\"framing_image\" src=\"" + global.user_icon + "\">";
    const image_container = document.getElementById("image_framing_modal_image_container" );
    image_container.innerHTML = dom;
  }
  attach_image_framing_modal_buttons();
}*/

/*function attach_image_framing_modal_buttons() {
  const load = document.getElementById("load_image");
  load.addEventListener('click', (click) => {
    select_image();
  });
  const save = document.getElementById("save_image");
  save.addEventListener( 'click', (click) => {
    save_image();
  });
}*/

/*function select_image() {
  console.log( "upload icon." );
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL( file );
    reader.onload = readerEvent => {
      console.dir( readerEvent );
      const size = readerEvent.total/1000000;
      console.log( size + "mb" );
      if( size > 15 ) {
        alert("Image too large! 16mb limit." );
        return;
      }
      const mime_type = readerEvent.srcElement.result.substr(
        5,
        readerEvent.srcElement.result.indexOf(";")-5
      );
      const content = readerEvent.target.result;
      const pos = readerEvent.target.result.indexOf( "," );
      const data = content.substr( pos+1 );
      global.user_icon = "data:" + mime_type + ";base64," + data;
      render_framing_modal_icon();
    }
  };
  input.click();
}*/

/*function save_image() {
  fetch( 'http://34.209.84.105:3000/upload_icon',
   {
     method: 'POST',
     body: JSON.stringify({
      "icon_id": global.icon_id,
      "icon_data" : global.user_icon
     }),
     headers: {
       'Content-Type': 'application/json'
     }
   }
 ).then( response => response.json() )
 .then( json => {
   const image = document.getElementById("edit_profile_icon");
   image.src = json.icon_data;
 });
}*/
