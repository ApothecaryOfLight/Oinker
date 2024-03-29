/*
Function to select an image from your local computer to use as a profile image.
*/
function select_icon_image() {
  //Get the input element reference.
  const input = document.createElement('input');

  //Set up the file reading.
  input.type = 'file';
  input.accept = 'image/*';

  //Set an event listener to listen for a file event.
  input.onchange = e => {
    //Get a reference to the file.
    const file = e.target.files[0];

    //Create a file reader.
    const reader = new FileReader();

    //Read the file.
    reader.readAsDataURL( file );

    //Upon the file being loaded, launch the interface to adjust it.
    reader.onload = readerEvent => {
      launch_icon_image_modal( readerEvent );
    }
  }
  input.click();
}


/*
Function to close the edit profile image modal.
*/
function close_icon_modal() {
  const modal = document.getElementById("edit_icon_modal");
  modal.style.display = "none";
}


/*
Function to launch the profile image editor.

inImageEventReference: The image to be used as a profile image.
*/
function launch_icon_image_modal( inImageEventReference ) {
  //Set the global variables for the profile image editing interface to defaults.
  icon_global.slider_click = false;
  icon_global.move_click = false;
  icon_global.start_click_x = 0;
  icon_global.start_click_y = 0;
  icon_global.width = 0;
  icon_global.height = 0;
  icon_global.zoom = 30;
  icon_global.offsetX = 0;
  icon_global.offsetY = 0;

  //Make sure that the image is small enough.
  const size = inImageEventReference.total/1000000;
  if( size > 15 ) {
    alert("Image too large! 16mb limit." );
    return;
  }

  //Get the mime type.
  const mime_type = inImageEventReference.srcElement.result.substr(
    5,
    inImageEventReference.srcElement.result.indexOf(";")-5
  );

  //Get the data of the image.
  const content = inImageEventReference.target.result;
  const pos = inImageEventReference.target.result.indexOf( "," );
  const data = content.substr( pos+1 );

  //Make the modal visible.
  const modal = document.getElementById("edit_icon_modal");
  modal.style.display = "flex";

  //Set the image source.
  const image_container = document.getElementById("edit_icon_draggable_image");
  image_container.attributeStyleMap.clear();
  icon_global.image_data = "data:" + mime_type + ";base64," + data;
  image_container.src = icon_global.image_data;

  //Wait until the image is loaded to gurantee that the CSS will be calculated.
  image_container.onload = function() {
    //Attach event listeners to the image modal.
    attach_icon_modal();

    //Store the original image dimensions so we can preserve the aspect ratio.
    const draggable_image = document.getElementById("edit_icon_draggable_image");
    const draggable_image_real = window.getComputedStyle( draggable_image );
    const width_txt = draggable_image_real.getPropertyValue('width');
    const height_txt = draggable_image_real.getPropertyValue('height');
    icon_global.width = width_txt.substr( 0, width_txt.length-2 );
    icon_global.height = height_txt.substr( 0, height_txt.length-2 );

    const slider = document.getElementById("edit_icon_framing_slider");
    icon_global.zoom = (slider.value)/100;
    const zoom_width = ((slider.value)/100)*icon_global.width;
    const zoom_height = ((slider.value)/100)*icon_global.height;

    draggable_image.style.width = zoom_width + "px";
    draggable_image.style.height = zoom_height + "px";
  }
}


/*
Global variables for the profile editing interface.
*/
const icon_global = {
  slider_click: false,
  move_click: false,
  start_click_x: 0,
  start_click_y: 0,
  width: 0,
  height: 0,
  image_data: null,
  zoom: 30,
  offsetX: 0,
  offsetY: 0
}


/*
Attach event listeners to the profile editing modal.
*/
function attach_icon_modal() {
  //Attach slider events.
  const slider = document.getElementById("edit_icon_framing_slider");
  slider.addEventListener( 'mousedown', (click) => {
    icon_global.slider_click = true;
  });
  slider.addEventListener( 'mouseup', (click) => {
    icon_global.slider_click = false;
  });

  slider.addEventListener( 'touchstart', (click) => {
    icon_global.slider_click = true;
  });
  slider.addEventListener( 'touchend', (click) => {
    icon_global.slider_click = false;
  });

  slider.addEventListener( 'mousemove', (unclick) => {
    if( icon_global.slider_click == true ) {

      const draggable_image = document.getElementById("edit_icon_draggable_image");

      icon_global.zoom = (slider.value)/100;
      const zoom_width = ((slider.value)/100)*icon_global.width;
      const zoom_height = ((slider.value)/100)*icon_global.height;

      draggable_image.style.width = zoom_width + "px";
      draggable_image.style.height = zoom_height + "px";
    }
  });
  slider.addEventListener( 'touchmove', (unclick) => {
    if( icon_global.slider_click == true ) {

      const draggable_image = document.getElementById("edit_icon_draggable_image");

      icon_global.zoom = (slider.value)/100;
      const zoom_width = ((slider.value)/100)*icon_global.width;
      const zoom_height = ((slider.value)/100)*icon_global.height;

      if( window.innerWidth <= 500 ) {
        draggable_image.style.width = (zoom_width*.6) + "px";
        draggable_image.style.height = (zoom_height*.6) + "px";
      } else {
        draggable_image.style.width = zoom_width + "px";
        draggable_image.style.height = zoom_height + "px";
      }
    }
  });


  //Attach move event.
  const lens = document.getElementById("edit_icon_lens");
  lens.addEventListener( 'mousedown', (click) => {
    icon_global.move_click = true;
    icon_global.start_click_x = click.x - (icon_global.offsetX/2);
    icon_global.start_click_y = click.y - (icon_global.offsetY/2);
  });
  document.addEventListener( 'mouseup', (unclick) => {
    icon_global.move_click = false;
  });
  document.addEventListener( 'mousemove', (move) => {
    if( icon_global.move_click == true ) {
      const draggable_image = document.getElementById("edit_icon_draggable_image");
      const offset_x = ((icon_global.start_click_x - move.x)*-1)*2;
      const offset_y = ((icon_global.start_click_y - move.y)*-1)*2;
      draggable_image.style['margin-left'] = offset_x + "px";
      draggable_image.style['margin-top'] = offset_y + "px";
      icon_global.offsetX = offset_x;
      icon_global.offsetY = offset_y;
    }
  });


  lens.addEventListener( 'touchstart', (click) => {
    icon_global.move_click = true;
    icon_global.start_click_x = click.touches[0].screenX - (icon_global.offsetX/2);
    icon_global.start_click_y = click.touches[0].screenY - (icon_global.offsetY/2);
  });
  document.addEventListener( 'touchend', (unclick) => {
    icon_global.move_click = false;
  });
  document.addEventListener( 'touchmove', (move) => {
    if( icon_global.move_click == true ) {
      const draggable_image = document.getElementById("edit_icon_draggable_image");
      const offset_x = ((icon_global.start_click_x - move.touches[0].screenX)*-1)*2;
      const offset_y = ((icon_global.start_click_y - move.touches[0].screenY)*-1)*2;
      draggable_image.style['margin-left'] = offset_x + "px";
      draggable_image.style['margin-top'] = offset_y + "px";
      icon_global.offsetX = offset_x;
      icon_global.offsetY = offset_y;
    }
  });

  //Attach save button click event.
  const save_button = document.getElementById("edit_icon_save_button");
  save_button.addEventListener( 'click', (click) => {
    send_icon_to_server();
    close_icon_modal();
  });

  //Attach back button click event.
  const back_button = document.getElementById("edit_icon_back_button");
  back_button.addEventListener( 'click', (click) => {
    const icon_modal = document.getElementById("edit_icon_modal");
    icon_modal.style.display = "none";
  });
}


/*
Function for the user to select a profile background image.
*/
function select_background_image() {
  //Get a reference to the input element.
  const input = document.createElement('input');

  //Set the file reading properties of the element.
  input.type = 'file';

  //Attach an event to listen for the initiation of the file load.
  input.onchange = e => {
    //Get a reference to the file.
    const file = e.target.files[0];

    //Create a new file reader.
    const reader = new FileReader();

    //Read the data.
    reader.readAsDataURL( file );

    //Add an event listener that will fire upon the image being fully loaded.
    reader.onload = readerEvent => {
      //Launch the interface to adjust the background image.
      launch_background_image_modal( readerEvent );
    }
  }
  input.click();
}


/*
Function to close the background editing modal.
*/
function close_background_modal() {
  const modal = document.getElementById("edit_background_modal");
  modal.style.display = "none";
}


/*
Function to launch the background editing modal.

inImageEventReference: Reference to the file being loaded as the background image.
*/
function launch_background_image_modal( inImageEventReference ) {
  background_global.slider_click = false;
  background_global.move_click = false;
  background_global.start_click_x = 0;
  background_global.start_click_y = 0;
  background_global.width = 0;
  background_global.height = 0;
  background_global.zoom = 30;
  background_global.offsetX = 0;
  background_global.offsetY = 0;

  //Make sure that the image is small enough.
  const size = inImageEventReference.total/1000000;
  if( size > 15 ) {
    alert("Image too large! 16mb limit." );
    return;
  }

  //Get the mime type.
  const mime_type = inImageEventReference.srcElement.result.substr(
    5,
    inImageEventReference.srcElement.result.indexOf(";")-5
  );

  //Get the data of the image.
  const content = inImageEventReference.target.result;
  const pos = inImageEventReference.target.result.indexOf( "," );
  const data = content.substr( pos+1 );

  //Make the modal visible.
  const modal = document.getElementById("edit_background_modal");
  modal.style.display = "flex";

  //Set the image source.
  const image_container = document.getElementById("edit_background_draggable_image");
  image_container.attributeStyleMap.clear();
  background_global.image_data = "data:" + mime_type + ";base64," + data;
  image_container.src = background_global.image_data;

  //Wait until the image is loaded to gurantee that the CSS will be calculated.
  image_container.onload = function() {
    //Attach event listeners to the image modal.
    attach_background_modal();

    //Store the original image dimensions so we can preserve the aspect ratio.
    const draggable_image = document.getElementById("edit_background_draggable_image");
    const draggable_image_real = window.getComputedStyle( draggable_image );
    const width_txt = draggable_image_real.getPropertyValue('width');
    const height_txt = draggable_image_real.getPropertyValue('height');
    background_global.width = width_txt.substr( 0, width_txt.length-2 );
    background_global.height = height_txt.substr( 0, height_txt.length-2 );

    const slider = document.getElementById("edit_background_framing_slider");
    background_global.zoom = (slider.value)/100;
    const zoom_width = ((slider.value)/100)*background_global.width;
    const zoom_height = ((slider.value)/100)*background_global.height;

    if( window.innerWidth <= 500 ) {
      draggable_image.style.width = (zoom_width*.6) + "px";
      draggable_image.style.height = (zoom_height*.6) + "px";
    } else {
      draggable_image.style.width = zoom_width + "px";
      draggable_image.style.height = zoom_height + "px";
    }
  }
}


/*
Global variables for the background editing interface.
*/
const background_global = {
  slider_click: false,
  move_click: false,
  start_click_x: 0,
  start_click_y: 0,
  width: 0,
  height: 0,
  image_data: null,
  zoom: 30,
  offsetX: 0,
  offsetY: 0
}


/*
Function to attach events to the background editing modal.
*/
function attach_background_modal() {
  //1) Attach slider events.
  const slider = document.getElementById("edit_background_framing_slider");
  slider.addEventListener( 'mousedown', (click) => {
    background_global.slider_click = true;
  });
  slider.addEventListener( 'touchstart', (click) => {
    background_global.slider_click = true;
  });

  slider.addEventListener( 'mouseup', (click) => {
    background_global.slider_click = false;
  });
  slider.addEventListener( 'touchend', (click) => {
    background_global.slider_click = false;
  });

  slider.addEventListener( 'mousemove', (unclick) => {
    if( background_global.slider_click == true ) {
      const draggable_image = document.getElementById("edit_background_draggable_image");

      background_global.zoom = (slider.value)/100;
      const zoom_width = ((slider.value)/100)*background_global.width;
      const zoom_height = ((slider.value)/100)*background_global.height;

      if( window.innerWidth <= 500 ) {
        draggable_image.style.width = (zoom_width*.6) + "px";
        draggable_image.style.height = (zoom_height*.6) + "px";
      } else {
        draggable_image.style.width = zoom_width + "px";
        draggable_image.style.height = zoom_height + "px";
      }
    }
  });
  slider.addEventListener( 'touchmove', (unclick) => {
    if( background_global.slider_click == true ) {

      const draggable_image = document.getElementById("edit_background_draggable_image");

      background_global.zoom = (slider.value)/100;
      const zoom_width = ((slider.value)/100)*background_global.width;
      const zoom_height = ((slider.value)/100)*background_global.height;

      if( window.innerWidth <= 500 ) {
        draggable_image.style.width = (zoom_width*.6) + "px";
        draggable_image.style.height = (zoom_height*.6) + "px";
      } else {
        draggable_image.style.width = zoom_width + "px";
        draggable_image.style.height = zoom_height + "px";
      }
    }
  });

  //Attach move event.
  const lens = document.getElementById("edit_background_lens");
  lens.addEventListener( 'mousedown', (click) => {
    background_global.move_click = true;
    background_global.start_click_x = click.x - (background_global.offsetX/2);
    background_global.start_click_y = click.y - (background_global.offsetY/2);
  });
  document.addEventListener( 'mouseup', (unclick) => {
    background_global.move_click = false;
  });
  document.addEventListener( 'mousemove', (move) => {
    if( background_global.move_click == true ) {
      const draggable_image = document.getElementById("edit_background_draggable_image");
      const offset_x = ((background_global.start_click_x - move.x)*-1)*2;
      const offset_y = ((background_global.start_click_y - move.y)*-1)*2;
      draggable_image.style['margin-left'] = offset_x + "px";
      draggable_image.style['margin-top'] = offset_y + "px";
      background_global.offsetX = offset_x;
      background_global.offsetY = offset_y;
    }
  });

  lens.addEventListener( 'touchstart', (click) => {
    background_global.move_click = true;
    background_global.start_click_x = click.touches[0].screenX - (background_global.offsetX/2);
    background_global.start_click_y = click.touches[0].screenY - (background_global.offsetY/2);
  });
  document.addEventListener( 'touchend', (unclick) => {
    background_global.move_click = false;
  });
  document.addEventListener( 'touchmove', (move) => {
    if( background_global.move_click == true ) {
      const draggable_image = document.getElementById("edit_background_draggable_image");
      const offset_x = ((background_global.start_click_x - move.touches[0].screenX)*-1)*2;
      const offset_y = ((background_global.start_click_y - move.touches[0].screenY)*-1)*2;
      draggable_image.style['margin-left'] = offset_x + "px";
      draggable_image.style['margin-top'] = offset_y + "px";
      background_global.offsetX = offset_x;
      background_global.offsetY = offset_y;
    }
  });


  //Attach save button click event.
  const save_button = document.getElementById("edit_background_save_button");
  save_button.addEventListener( 'click', (click) => {
    send_background_to_server();
    close_background_modal();
  });

  //Attach back button click event.
  const back_button = document.getElementById("edit_background_back_button");
  back_button.addEventListener( 'click', (click) => {
    const background_modal = document.getElementById("edit_background_modal");
    background_modal.style.display = "none";
  });
}


/*
Function to send the background image to the server.
*/
function send_background_to_server() {
  let multiplier = 1;
  if( window.innerWidth <= 500 ) {
    multiplier = 1.6;
  }

  fetch( ip + '/upload_background',
    {
      method: 'POST',
      body: JSON.stringify({
        "background_id": global.background_id,
        "background_data" : (background_global.image_data),
        "offsetX": background_global.offsetX*multiplier,
        "offsetY": background_global.offsetY*multiplier,
        "width": background_global.width,
        "height": background_global.height,
        "zoom": background_global.zoom,
        "original_width": 600,
        "original_height": 600
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then( response => response.json() )
  .then( json => {
    request_background();
  });
}


/*
Function to send the profile image to the server.
*/
function send_icon_to_server() {
  let multiplier = 1;
  if( window.innerWidth <= 500 ) {
    multiplier = 1.6;
  }
  fetch( ip + '/upload_icon',
    {
      method: 'POST',
      body: JSON.stringify({
        "icon_id": global.icon_id,
        "icon_data" : (icon_global.image_data),
        "offsetX": icon_global.offsetX*multiplier,
        "offsetY": icon_global.offsetY*multiplier,
        "width": icon_global.width,
        "height": icon_global.height,
        "zoom": icon_global.zoom,
        "original_width": 600,
        "original_height": 600
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then( response => response.json() )
  .then( json => {
    request_icon();
  });
}