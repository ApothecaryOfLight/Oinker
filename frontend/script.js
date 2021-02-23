'use strict';

console.log( "Yipee!" );

window.addEventListener( 'load', (event)=> {
  //render_timeline( fake_data.oinks );
  render_whats_happening( fake_data.news );
  //attach_to_new_oink();

  //request_oinks();

  launch_login_interface();
});

function launch_oink_interface() {
  const root_interface = document.getElementById("root_container");
  const login_interface = document.getElementById("login_interface");
  root_interface.style.display = "grid";
  login_interface.style.display = "none";
  attach_to_new_oink();
  request_oinks();
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
  console.log( timestamp_raw );
  const timestamp_string = timestamp_raw.toISOString();
  console.log( timestamp_string );
  const date = timestamp_string.substr( 0, 10 );
  console.log( date );
  const time = timestamp_string.substr( 11, 8 );
  console.log( time );
  const clean_timestamp = date + " " + time;
  console.log( clean_timestamp );

  if( new_oink_text != "What's happening?" ) {
    console.log( new_oink_text );
    fetch( 'http://34.209.84.105:3000/new_oink',
    {
      method: 'POST',
      body: JSON.stringify({
        username_hash: global.username_hash,
        username_plaintext: global.username_plaintext,
        text_content: new_oink_text,
        timestamp: clean_timestamp
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then( response => response.json() )
  .then( json => {
    console.dir( json );
    new_oink_field.innerHTML = "What's happening?";
      new_oink_field.style.color = "#80808066";
    request_oinks();
  });
  }
}


let fake_data = {
  oinks : [
    {
      username: "Tom",
      message: "This is Tom\'s first oink!"
    },
    {
      username: "Sandy",
      message: "And this is Sandy\'s first oink!"
    },
    {
      username: "Tom",
      message: "Second oink!"
    },
    {
      username: "Sandy",
      message: "Right!?"
    },
    {
      username: "Tom",
      message: "So cool."
    },
    {
      username: "Sandy",
      message: "so great! Adorable piggy!"
    },
    {
      username: "Sandy",
      message: "I'm all about this piggy."
    },
    {
      username: "Tom",
      message: "Piggy forever!"
    },
    {
      username: "Sandy",
      message: "Oinkus amoungstus!"
    },
    {
      username: "Tom",
      message: "I'm making this pig my religion."
    },
    {
      username: "Sandy",
      message: "That might be too much."
    }
  ],
  news : [
    {
      topic: "Science",
      headline: "Another Rover on Mars",
      message: "Nerds Argue About GNU vs Linux"
    },
    {
      topic: "Entertainment",
      headline: "DC Movies Continue to Suck",
      message: "Watch Wandavision! Hahnaissance time!"
    },
    {
      topic: "Crime",
      headline: "Cocaine Cocoa-Puffs Intercepted",
      message: "Who? Why Cincinnati? Perhaps most perplexingly: how!?"
    },
    {
      topic: "Politics",
      headline: "US Right Wingers Continue to Confuse Freedom with Whatever-The-Hell-I-Want",
      message: "Performative anti-mask and other pro-plague behaviors continue to endanger world at large as US variants surge. Yet again, this reporter must ask: why is my country so selfish and stupid?"
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

function render_timeline( inTimeline ) {
  let div = "";
  for( const oink in inTimeline ) {
    div +=
      "<div class=\"oink\">" +
        "<div class=\"oink_icon_container\"><div class=\"oink_icon\">" +
          "image" +
        "</div></div>" +
        "<div class=\"oink_name_container\">" +
          "<div class=\"oink_nym\">" + inTimeline[oink].username_plaintext + "</div>" +
          "<div class=\"oink_name_id\"></div>" +
          "<div class=\"oink_time\">&nbsp;&#x22C5;&nbsp;" +
            timestampToString( inTimeline[oink].timestamp ) +
          "</div>" +
        "</div>" +
        "<div class=\"oink_message_container\">" +
          "<div class=\"oink_message\">" +
            inTimeline[oink].text_content +
          "</div>" +
          "<div class=\"oink_button_container\">" + "buttons here" + "</div>" +
        "</div>" +
      "</div>";
    timestampToString( inTimeline[oink].timestamp );
  }

  const main_container = document.getElementById("timeline_container");
  main_container.innerHTML = div;
}

function render_whats_happening( news ) {
  let dom = "<div class=\"news_items_title\">What\'s Happening</div>";
  for( const news_item in news ) {
    dom += "<div class=\"news_item_container\">" +
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
      console.dir( json );
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
    console.log( username_field.value + "/" + password_field.value );
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
  last_get: ""
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
    console.dir( json );
    global.logged = true;
    global.username_hash = md5(inUsername);
    global.username_plaintext = inUsername;
    launch_oink_interface();
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
    console.dir( json );
    global.logged = true;
    global.username_hash = md5(inUsername);
    global.username_plaintext = inUsername;
    launch_oink_interface();
  });
}

var delay;
function request_update() {
  delayed = window.setTimeout( request_oinks, 500 );
}
window.addEventListener( 'mousemove', (event) => {
  console.log( "mouse moving" );
  if( global.logged == true ) {
    const now = Date.now();
    if( now - global.last_get > 5000 ) {
      console.log( "Been too long!" );
      request_oinks();
    }
  }
});
//request_oinks
