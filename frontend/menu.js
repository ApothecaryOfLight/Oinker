
const menu_buttons = {
  "menu_button_home": set_container.bind( null, "home_container" ),
/*  "menu_button_email": not_imp_yet,*/
  "menu_button_profile": set_container.bind( null, "profile_container" ),
  "menu_button_new_oink": not_imp_yet,
  "menu_button_logout": logout
};

function scroll_to_top() {
  window.scrollTo( 0,0 );
}

function attach_menu_buttons() {
/*  const menu_home = document.getElementById("menu_button_home");
  const menu_email = document.getElementById("menu_button_email");
  const menu_profile = document.getElementById("menu_button_profile");
  const menu_new_oink = document.getElementById("menu_button_new_oink");
  const menu_logout = document.getElementById("menu_button_logout");
  menu_home.addEventListener( 'click', (click) => {
    set_container( "home_container" );
  });
  menu_email.addEventListener( 'click', (click) => {
    not_imp_yet();
  });

  menu_profile.addEventListener( 'click', (click) => {
    set_container( "profile_container" );
  });
  menu_new_oink.addEventListener( 'click', (click) => {
    not_imp_yet();
  });
  menu_logout.addEventListener( 'click', (click) => {
    logout();
  });*/

  for( element in menu_buttons ) {
    const element_ref = document.getElementById( element );
    element_ref.addEventListener( 'click', menu_buttons[element] );
    element_ref.addEventListener( 'click', scroll_to_top );
  }

}

function detach_menu_buttons() {
  for( element in menu_buttons ) {
    const element_ref = document.getElementById( element );
    element_ref.removeEventListener( 'click', menu_buttons[element] );
    element_ref.removeEventListener( 'click', scroll_to_top );
  }
}
