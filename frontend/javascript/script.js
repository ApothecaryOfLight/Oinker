'use strict';

/*
Event listener to act as entry-point for application.
*/
window.addEventListener( 'load', (event)=> {
  //Render the placeholder current events.
  render_whats_happening( fake_data.news );

  //Launch the login interface (attach events, show login screen, etc).
  launch_login_interface();
});


/*
Launch the main interface.
*/
function launch_oink_interface() {
  //Get references to the relevant elements. Hide and show them as appropriate.
  const root_interface = document.getElementById("root_container");
  const login_interface = document.getElementById("login_interface");
  root_interface.style.display = "grid";
  login_interface.style.display = "none";

  //Attach event listeners.
  attach_to_new_oink();
  attach_menu_buttons();
  attach_profile_buttons();

  //Get necessary information from server.
  request_oinks();
  request_icon();
  request_background();

  //Scroll to top.
  window.scrollTo( 0,0 );
}


/*
Request the profile image from the server.
*/
function request_icon() {
  console.log( "request_icon" );
  fetch( ip + '/icon_request/' + global.icon_id,
    {
      method: 'GET'
    }
  ).then( response => response.json() )
  .then( json => {
    //Upon success, store the profile image data.
    global.icon_data = json.icon_data;
    //Draw the profile image where appropriate.
    render_user_profile();
    render_profile_icon();
    render_edit_profile_icon();
  });
}


/*
Function to set which part of the main interface is active.

inContainerName: Subset of main interface to dispaly.
*/
function set_container( inContainerName ) {
  const container_names = [
    "home_container",
    "messages_container",
    "profile_container"
  ];

  //Iterate through each subset of the main interace.
  container_names.forEach( name => {
    //If this is the targeted interface, show it.
    //Otherwise, hide it.
    const container = document.getElementById(name);
    if( inContainerName == name ) {
      if( name == "profile_container" ) {
        //Profile container is dispalyed using CSS Grid.
        container.style.display = "grid";
      } else {
        //All other subsets are displayed using block.
        container.style.display = "block";
      }
    } else {
      container.style.display = "none";
    }
  });
}


/*
Function to convert a timestamp to a string.

then: Timestamp to convert.
*/
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


/*
Placeholder function to notify a user that an attempted function is not yet
implemented.
*/
function not_imp_yet() {
  alert( "Not implemented yet." );
}


/*
Global object containing various variables.
*/
const global = {
  logged: false,
  username_hash: "",
  username_plaintext: "",
  last_get: "",
  icon_id: null,
  icon_data: null,
  background_id: null,
  profile_id: null
}


/*
Event listener that looks for mouse movements. If the mouse has moved recently,
then ask the server for recent oinks.

This is an idling function, designed to ensure that new oinks will only be loaded
when the user is interacting with the interface.
*/
window.addEventListener( 'mousemove', (event) => {
  if( global.logged == true ) {
    const now = Date.now();
    if( now - global.last_get > 5000 ) {
      request_oinks();
    }
  }
});
