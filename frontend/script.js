'use strict';

console.log( "Yipee!" );

window.addEventListener( 'load', (event)=> {
  render_timeline( fake_data.oinks );
  render_whats_happening( fake_data.news );
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
    {
      topic: "Politics",
      headline: "Joe Manchin is Sexist",
      message: "Who knew!? I know no other Democrat can get elected in West Virignia, but have we considered getting rid of West Virginia?"
    },
    {
      topic: "Sports",
      headline: "Organized Sports: Worse Than Organized Crime?",
      message: "Why can\'t y\'all just play pick up games? Why does it have to consume society like a disease?"
    },
    {
      topic: "Politics",
      headline: "Cruz Abandons Dog",
      message: "Polls show his voters care more about that than him leaving them all to freeze."
    },
    {
      topic: "Politics",
      headline: "Low-Info Voters Upset Biden Not Using Doctor Strange Powers",
      message: "Why hasn\'t he fixed everything yet?"
    },
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
    },
    {
      topic: "Entertainment",
      headline: "Judas and the Black Messiah",
      message: "Actually happened almost exactly as depicted. Compare with West Wing and other Sorkin ventures, which have absolutely no relation to reality. Discuss."
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

  const main_container = document.getElementById("main_container");
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
