'use strict';

console.log( "Yipee!" );

window.addEventListener( 'load', (event)=> {
  render_timeline( fake_data.oinks );
});


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

  const main_container = document.getElementById("main_container");
  main_container.innerHTML = div;
}
