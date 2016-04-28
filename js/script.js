var drag, canvas, ctx;
var posX = 0, posY = 0;
var lastX, lastY;
var logo, image;
var alpha, brightness
var caption = "Neredeyse Hindistan nüfusu kadar!", hashtag = "#orkestra";
var lines = new Array();

var img_values = {"caption":"", "image":"/maker/img/fback.png", "hashtag":"#orkestra", "brightness":"80", "alpha":"80", "img-scale":"100", "hashtag-pos":"right", "header-pos":"top"}

drawLogo = function () {
	logo=document.createElement("img");
	logo.onload=function(){
    if(img_values['header-pos']=='left')
      cheight = 100;
    else
      cheight = lines.length>0?lines.length * 29 + 40:100;
		ctx.drawImage(logo,510, cheight/2.0 - 45 ,90,90);
	}
	logo.src="/maker/img/logo.png";
}

drawHeading = function () {
    alpha = img_values["alpha"]/100.0;
    brigh = img_values["brightness"];
    tcolr = 255-brigh;
	  ctx.beginPath();
	  ctx.fillStyle = "rgba("+brigh+","+brigh+","+brigh+","+alpha+")";

  text = img_values["caption"]
  lines = new Array();
  var width = 0, i, j;
  max_width = img_values['header-pos']=='left'?200:460;
  while ( text.length ) {
      for( i=text.length; ctx.measureText(text.substr(0,i)).width > max_width; i-- );
      result = text.substr(0,i);
      if ( i !== text.length )
          for( j=0; result.indexOf(" ",j) !== -1; j=result.indexOf(" ",j)+1 );
      lines.push( result.substr(0, j|| result.length) );
      width = Math.max( width, ctx.measureText(lines[ lines.length-1 ]).width);
      text  = text.substr( lines[ lines.length-1 ].length, text.length );
  }

  cheight = lines.length>0?lines.length * 29 + 40:0;

  if(img_values['header-pos']=='top') {
      ctx.lineTo(0,cheight);
      ctx.lineTo(600,cheight);
      ctx.lineTo(600,0);
      ctx.lineTo(0,0);
      ctx.fill();
  } else if(img_values['header-pos']=='top-slanted') {
      ctx.lineTo(0,250);
      ctx.lineTo(600,60);
      ctx.lineTo(600,0);
      ctx.lineTo(0,0);
      ctx.fill();
  } else if(img_values['header-pos']=='left') {
      ctx.lineTo(250,0);
      ctx.lineTo(250,600);
      ctx.lineTo(0,600);
      ctx.lineTo(0,0);
      ctx.fill();
  }

	ctx.textBaseline = "middle"
	ctx.textAlign = "left";
  ctx.fillStyle = "rgba("+tcolr+","+tcolr+","+tcolr+",0.9)";
	ctx.font = '400 21px signika';

  top_offset = img_values['header-pos']=='left'?(600 - lines.length*29)/2 : 16

  for ( i=0, j=lines.length; i<j; ++i ) {
	  ctx.fillText(lines[i], 20, top_offset+20 + 29 * i)
  }

}

drawHashtag = function() {
	ctx.fillStyle = "rgba(248,248,248,1)";
	ctx.font = 'bold 20px signika';
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	ctx.strokeStyle = "rgba(248,248,248,1)";
	ctx.lineWidth = 4;
	var text = ctx.measureText(img_values["hashtag"]);
	offset = text.width/2+22;
	if(img_values['hashtag-pos']=='left') {
		ctx.fillText(img_values["hashtag"], offset, 600-31)
		ctx.strokeRect(14,600-51,text.width+16,36);
	} if(img_values['hashtag-pos']=='right') {
		loffset = text.width+30
		ctx.fillText(img_values["hashtag"], 600-offset, 600-31)
		ctx.strokeRect(600-loffset,600-51,text.width+16,36);
	}
}

drawImage = function () {
	image=document.createElement("img");
	image.onload=function(){
		ctx.drawImage(image,posX,posY,image.width*img_values['img-scale']/100,image.height*img_values['img-scale']/100);
		drawHeading();
		drawHashtag();
		drawLogo();
	}
	image.src=img_values["image"];
}

redraw = function() {
	image.src=img_values["image"];
	ctx.drawImage(image,posX,posY,image.width*img_values['img-scale']/100,image.height*img_values['img-scale']/100);
	drawHeading();
	drawHashtag();
	ctx.drawImage(logo,872,10,120,120);
}

$(document).ready(function(){

    $('input').on("change",handleValueChange);
    $('textarea').on("change",handleValueChange);

	canvas=document.getElementById("canvas");
	container = $("#canvas-container")
	console.log('cw:'+container.width());
	console.log('ch:'+container.height());
	ctx=canvas.getContext("2d");
	cdim = container.width()-10;
	canvas.width =  cdim; //max width
	canvas.height = cdim; //max height
	ctx.scale(cdim/600.0,cdim/600.0);
	console.log('cs:'+cdim/600.0);

    ctx.mozImageSmoothingEnabled = true;
    ctx.webkitImageSmoothingEnabled = true;
    ctx.msImageSmoothingEnabled = true;
    ctx.imageSmoothingEnabled = true;

    drawImage();	
	init();

	function init(){
		canvas.addEventListener('mousedown', function(){
			drag = true;
			lastX=null;
			lastY=null;
		});

		document.addEventListener('mouseup', function(){
			drag = false;
		});

		document.addEventListener('mousemove', function(evt) {
			if(drag){
				var mousePos = getMousePos(canvas, evt);
				var x = mousePos.x;
				var y = mousePos.y;
				ctx.clearRect(0,0,canvas.width,canvas.height);
				if(lastX && lastY){
					posX += x-lastX;
					posY += y-lastY;
					if(posX>0) posX=0;
					if(posY>0) posY=0;
					if(posX<-image.width*img_values['img-scale']/100+canvas.width) posX = -image.width*img_values['img-scale']/100+canvas.width;
					if(posY<-image.height*img_values['img-scale']/100+canvas.height) posY = -image.height*img_values['img-scale']/100+canvas.height;
					redraw();
				}
				lastX=x;
				lastY=y;
			}
		}, false);
	}

	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}

    var button = document.getElementById('btn-download');
    button.addEventListener('click', function (e) {
        var dataURL = canvas.toDataURL('image/png');
        button.href = dataURL;
    });
});


handleValueChange = function(e) {
    console.log('key: ',e.target.name);
    console.log('val: ',e.target.value);
    img_values[e.target.name] = e.target.value;
    if(e.target.type=='file') {
        reader = new FileReader();
        file = e.target.files[0]
        reader.onload = function (event) {
            console.log("q: ", event.target);
            img_values["image"] = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    redraw();
};
