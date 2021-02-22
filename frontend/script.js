'use strict';

console.log( "Yipee!" );

window.addEventListener( 'load', (event)=> {
  render_timeline( fake_data.oinks );
  render_whats_happening( fake_data.news );
  attach_to_new_oink();

  request_oinks();

  launch_login_interface();
});

function launch_oink_interface() {
  const root_interface = document.getElementById("root_container");
  const login_interface = document.getElementById("login_interface");
  root_interface.style.display = "grid";
  login_interface.style.display = "none";
  attach_to_new_oink();
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

function render_timeline( inTimeline ) {
  let div = "";
  for( const oink in inTimeline ) {
    div +=
      "<div class=\"oink\">" +
        "<div class=\"oink_icon_container\"><div class=\"oink_icon\">" +
          "image" +
        "</div></div>" +
        "<div class=\"oink_name_container\">" +
          "<div class=\"oink_nym\">" + inTimeline[oink].username + "</div>" +
          "<div class=\"oink_name_id\"></div>" +
          "<div class=\"oink_time\"></div>" +
        "</div>" +
        "<div class=\"oink_message_container\">" +
          "<div class=\"oink_message\">" +
            inTimeline[oink].message +
          "</div>" +
          "<div class=\"oink_button_container\">" + "buttons here" + "</div>" +
        "</div>" +
      "</div>"
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
  fetch( 'http://34.209.84.105:3000/oinks',
    {
      method: 'GET'
    }
  )
    .then( response => response.json() )
    .then( json => {
      console.dir( json );
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
  });
}
