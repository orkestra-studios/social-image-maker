var drag, canvas, ctx;
var posX = 0, posY = 0;
var lastX, lastY;
var logo, image;
var alpha, brightness
var header1 = "Dünya üzerinde tam 1 milyar aktif" 
var header2 = "Apple cihazı bulunmakta."
var caption = "Neredeyse Hindistan nüfusu kadar!", hashtag = "#orkestra";

var img_values = {"header1":"", "header2":"", "caption":"", "image":"/maker/img/fback.png", "hashtag":"#orkestra", "brightness":"0.3", "alpha":"0.8", "img-scale":"100"}

drawLogo = function () {
	logo=document.createElement("img");
	logo.onload=function(){
		ctx.drawImage(logo,510,10,90,90);
	}
	logo.src="/maker/img/logo.png";
}

drawHeading = function () {
    alpha = img_values["alpha"]/100.0;
    brigh = img_values["brightness"];
    tcolr = 255-brigh;
	ctx.beginPath();
	ctx.fillStyle = "rgba("+brigh+","+brigh+","+brigh+","+alpha+")";
	ctx.lineTo(0,200);
	ctx.lineTo(600,200);
	ctx.lineTo(600,0);
	ctx.lineTo(0,0);
	ctx.fill();
	
	ctx.textBaseline = "alphabetic"
	ctx.textAlign = "left";
	ctx.fillStyle = "rgba("+tcolr+","+tcolr+","+tcolr+",0.9)";
	ctx.font = 'bold 32px "Arial Rounded MT Bold"';
	ctx.fillText(img_values["header1"], 20, 64 , 600)
	ctx.fillText(img_values["header2"], 20, 128 , 600)
	
	hoffset = img_values["header2"].length>0?60:0;

	ctx.fillStyle = "rgba("+tcolr-20+","+tcolr-20+","+tcolr-20+"0.9)";
	ctx.font = 'normal 22px "Arial Rounded MT Bold"';
	ctx.fillText(img_values["caption"], 20, 125+hoffset , 600)
}

drawHashtag = function() {
	ctx.fillStyle = "rgba(248,248,248,1)";
	ctx.font = 'bold 22px "Avenir Next Condensed"';
	ctx.textBaseline = "middle";
	ctx.textAlign = "center";
	var text = ctx.measureText(img_values["hashtag"]);
	offset = text.width/2+22;
	ctx.fillText(img_values["hashtag"], 600-offset, 600-30)
	ctx.strokeStyle = "rgba(248,248,248,1)";
	ctx.lineWidth = 4;
	loffset = text.width+30
	ctx.strokeRect(600-loffset,600-51,text.width+16,36);
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
