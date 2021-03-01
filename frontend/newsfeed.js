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
