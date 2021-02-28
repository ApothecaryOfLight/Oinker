function attach_button() {
  const upload_image_button = document.getElementById("launch_modal");
  upload_image_button.addEventListener( 'click', (event) => {
    console.log( "Click!" );
    select_image();
  });
}

function select_image() {
console.log( "select_image()" );
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL( file );
    reader.onload = readerEvent => {
      launch_image_modal( readerEvent );
    }
  }
  input.click();
}

function hide_image_modal() {
  const modal = document.getElementById("edit_image_modal");
  modal.style.display = "none";
}

function launch_image_modal( inImageEventReference ) {
  //1) Make sure that the image is small enough.
  const size = inImageEventReference.total/1000000;
  if( size > 15 ) {
    alert("Image too large! 16mb limit." );
    return;
  }

  //2) Get the mime type.
  const mime_type = inImageEventReference.srcElement.result.substr(
    5,
    inImageEventReference.srcElement.result.indexOf(";")-5
  );

  //3) Get the data of the image.
  const content = inImageEventReference.target.result;
  const pos = inImageEventReference.target.result.indexOf( "," );
  const data = content.substr( pos+1 );

  //4) Make the modal visible.
  const modal = document.getElementById("edit_image_modal");
  modal.style.display = "flex";

  //5) Set the image source.
  const image_container = document.getElementById("draggable_image");
  image_global.image_data = "data:" + mime_type + ";base64," + data;
  image_container.src = image_global.image_data;
  image_global.mime_ype = mime_type;

  //6) Wait until the image is loaded to gurantee that the CSS will be calculated.
  image_container.onload = function() {
    //7) Attach event listeners to the image modal.
    attach_image_modal();

    //8) Store the original image dimensions so we can preserve the aspect ratio.
    const draggable_image_real = window.getComputedStyle( draggable_image );
    const width_txt = draggable_image_real.getPropertyValue('width');
    const height_txt = draggable_image_real.getPropertyValue('height');
    image_global.width = width_txt.substr( 0, width_txt.length-2 );
    image_global.height = height_txt.substr( 0, height_txt.length-2 );

    const slider = document.getElementById("framing_slider");
    image_global.zoom = (slider.value)/100;
    const zoom_width = ((slider.value)/100)*image_global.width;
    const zoom_height = ((slider.value)/100)*image_global.height;

    draggable_image.style.width = zoom_width + "px";
    draggable_image.style.height = zoom_height + "px";
  }
}

const image_global = {
  slider_click: false,
  move_click: false,
  start_click_x: 0,
  start_click_y: 0,
  width: 0,
  height: 0,
  image_data: null,
  zoom: 30,
  offsetX: 0,
  offsetY: 0,
  mime_type: "",
}

function attach_image_modal() {
  //1) Attach slider events.
  const slider = document.getElementById("framing_slider");
  slider.addEventListener( 'mousedown', (click) => {
    image_global.slider_click = true;
  });
  slider.addEventListener( 'mouseup', (click) => {
    image_global.slider_click = false;
  });

  slider.addEventListener( 'mousemove', (unclick) => {
    if( image_global.slider_click == true ) {

      const draggable_image = document.getElementById("draggable_image");

      image_global.zoom = (slider.value)/100;
      const zoom_width = ((slider.value)/100)*image_global.width;
      const zoom_height = ((slider.value)/100)*image_global.height;

      draggable_image.style.width = zoom_width + "px";
      draggable_image.style.height = zoom_height + "px";
    }
  });

  //2) Attach move event.
  const lens = document.getElementById("lens");
  lens.addEventListener( 'mousedown', (click) => {
    image_global.move_click = true;
    image_global.start_click_x = click.x - image_global.offsetX;
    image_global.start_click_y = click.y - image_global.offsetY;
  });
  document.addEventListener( 'mouseup', (unclick) => {
    image_global.move_click = false;
  });
  document.addEventListener( 'mousemove', (move) => {
    if( image_global.move_click == true ) {
      const draggable_image = document.getElementById("draggable_image");
      const offset_x = ((image_global.start_click_x - move.x)*-1)*2;
      const offset_y = ((image_global.start_click_y - move.y)*-1)*2;
      draggable_image.style['margin-left'] = offset_x + "px";
      draggable_image.style['margin-top'] = offset_y + "px";
      image_global.offsetX = offset_x;
      image_global.offsetY = offset_y;
    }
  });

  const save_button = document.getElementById("save_button");
  save_button.addEventListener( 'click', (click) => {
    console.dir( image_global );
    send_profile_to_server();
    hide_image_modal();
  });
}

function render_profile_image( target_element ) {
  const test_profile = document.getElementById( target_element );
  test_profile.src = image_global.image_data;

  const profile_width = (image_global.zoom*image_global.width)/12.5;
  const profile_height = (image_global.zoom*image_global.height)/12.5;
  const profile_offset_x = image_global.offsetX/12.5;
  const profile_offset_y = image_global.offsetY/12.5;

  test_profile.style.width = profile_width + "px";
  test_profile.style.height = profile_height + "px";
  test_profile.style['margin-left'] = profile_offset_x + "px";
  test_profile.style['margin-top'] = profile_offset_y + "px";
}

function send_profile_to_server() {
  fetch( 'http://34.209.84.105:3000/upload_icon',
    {
      method: 'POST',
      body: JSON.stringify({
        "icon_id": global.icon_id,
        "icon_data" : (image_global.image_data),
        "offsetX": image_global.offsetX,
        "offsetY": image_global.offsetY,
        "width": image_global.width,
        "height": image_global.height,
        "zoom": image_global.zoom,
        "original_width": 600,
        "original_height": 600
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  ).then( response => response.json() )
  .then( json => {
    //TODO: Non-success code.
    render_profile_image( "edit_profile_icon" );
  });
}
