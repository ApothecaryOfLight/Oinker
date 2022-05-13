/*
Global containing menu button DOM IDs as keys and their respetive bound functions
as values.
*/
const menu_buttons = {
  "menu_button_home": set_container.bind( null, "home_container" ),
  "menu_button_profile": set_container.bind( null, "profile_container" ),
  "menu_button_new_oink": not_imp_yet,
  "menu_button_logout": logout
};


/*
Function to scroll to top of website.
*/
function scroll_to_top() {
  window.scrollTo( 0,0 );
}


/*
Function to attach menu button click events.
*/
function attach_menu_buttons() {
  for( element in menu_buttons ) {
    const element_ref = document.getElementById( element );
    element_ref.addEventListener( 'click', menu_buttons[element] );
    element_ref.addEventListener( 'click', scroll_to_top );
  }

}


/*
Function to detach menu button click events.
*/
function detach_menu_buttons() {
  for( element in menu_buttons ) {
    const element_ref = document.getElementById( element );
    element_ref.removeEventListener( 'click', menu_buttons[element] );
    element_ref.removeEventListener( 'click', scroll_to_top );
  }
}
