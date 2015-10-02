var money = 0;
var _transMoney = 0;

/*setInterval(function () {
	money ++;
	$('#moneyVal').html('$'+money);
}, 5);*/

var canvas = $('#canvas')
var g = canvas[0].getContext('2d')

//g.fillStyle = "#fff";
//g.fillRect(0,0,20,20);

function drawCrystal(offX, offY) {
	g.fillStyle = '#0ff';
	g.beginPath();
	var pi = Math.PI/2;
	var time = new Date().getTime() * 0.001;
	for(var i = 0; i < 4; i++ ){
		var x = Math.cos(i*pi+time) * 20 + offX;
		var y = Math.sin(i*pi+time) * 20 + offY;
		if(i == 0)
			g.moveTo(x, y)
		else 
			g.lineTo(x, y);
	}
	g.closePath();
	g.fill();
}
function tick() {
	var width = g.canvas.width = canvas.width();
	var height = g.canvas.height = canvas.height();
	 
	g.fillStyle="#444";
	g.fillRect(0, 0, width, height);
	drawCrystal(width/2, height/2);
}

setInterval(tick, 5);