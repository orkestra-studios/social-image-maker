var drag, canvas, ctx;
var posX = 0, posY = 0;
var lastX, lastY;
var logo, image;
var alpha, brightness
var header1 = "Dünya üzerinde tam 1 milyar aktif" 
var header2 = "Apple cihazı bulunmakta."
var caption = "Neredeyse Hindistan nüfusu kadar!", hashtag = "#orkestra";

drawLogo = function () {
	logo=document.createElement("img");
	logo.onload=function(){
		console.log('loaded logo');
		ctx.drawImage(logo,872,10,120,120);
	}
	logo.src="./logo.png";
}

drawHeading = function () {
	ctx.beginPath();
	ctx.fillStyle = "rgba(60,60,60,0.5)";
	ctx.lineTo(0,300);
	ctx.lineTo(1000,300);
	ctx.lineTo(1000,0);
	ctx.lineTo(0,0);
  ctx.fill();
	
	ctx.textBaseline = "alphabetic"
	ctx.textAlign = "left";
	ctx.fillStyle = "rgba(256,256,256,0.9)";
	ctx.font = 'bold 48px "Arial Rounded MT Bold"';
	ctx.fillText(header1, 20, 60 , 1000)
	ctx.fillText(header2, 20, 120 , 1000)
	
	hoffset = header2.length>0?50:0;

	ctx.fillStyle = "rgba(228,228,228,0.9)";
	ctx.font = 'normal 32px "Arial Rounded MT Bold"';
	ctx.fillText(caption, 20, 125+hoffset , 600)
}

drawHashtag = function() {
	ctx.fillStyle = "rgba(248,248,248,1)";
	ctx.font = 'bold 32px "Avenir Next Condensed"';
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	var text = ctx.measureText(hashtag);
	offset = text.width/2+38;
	ctx.fillText(hashtag, 1000-offset, 1000-48)
	ctx.strokeStyle = "rgba(248,248,248,1)";
	ctx.lineWidth = 6;
	loffset = text.width+48
	ctx.strokeRect(1000-loffset,1000-80,text.width+18,56);
}

drawImage = function (x,y) {
	image=document.createElement("img");
	image.onload=function(){
		ctx.drawImage(image,x,y);
		drawHeading();
		drawHashtag();
		drawLogo();
	}
	image.src="./1443372210269.jpg";
}

redraw = function(x,y) {
		ctx.drawImage(image,x,y);
		drawHeading();
		drawHashtag();
	  ctx.drawImage(logo,872,10,120,120);
}

$(document).ready(function(){
	canvas=document.getElementById("canvas");
	canvas.width = 500;
	canvas.height = 500;
	ctx=canvas.getContext("2d");
	ctx.scale(0.5,0.5)

  drawImage(posX,posY);	
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
					if(posX<-image.width+canvas.width) posX = -image.width+canvas.width;
					if(posY<-image.height+canvas.height) posY = -image.height+canvas.height;
					redraw(posX, posY);
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
});
