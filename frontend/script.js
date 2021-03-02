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
  request_background();
}

function request_background() {
  console.log( "request_background" );
  fetch( 'http://34.209.84.105:3000/background_request/' + global.background_id,
    {
      method: 'GET'
    }
  ).then( response => response.json() )
  .then( json => {
    //TODO: Set poster icon here.
    global.background_data = json.background_data;
    render_user_background();
    render_edit_profile_background();
  });
}

function request_icon() {
  console.log( "request_icon" );
  fetch( 'http://34.209.84.105:3000/icon_request/' + global.icon_id,
    {
      method: 'GET'
    }
  ).then( response => response.json() )
  .then( json => {
    //TODO: Set poster icon here.
    global.icon_data = json.icon_data;
    render_user_profile();
    render_edit_profile_icon();
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

function not_imp_yet() {
  alert( "Not implemented yet." );
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
