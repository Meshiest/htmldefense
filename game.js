var canvas = $('#canvas')
var g = canvas[0].getContext('2d')
var width = g.canvas.width = canvas.width()
var height = g.canvas.height = canvas.height()

var money = 500
var _transMoney = money-money/5
var baseCost = 20;

var constructs = []

var mouseX;
var mouseX;

var clickMode = 0
var selectedTower = undefined

var MODE_NONE = 0
var MODE_BUY = 1
var MODE_UPGRADE = 2

document.onmousemove = function(e){
    mouseX = e.pageX - width/2
    mouseY = e.pageY - height/2
}

canvas.on('click', function(e) {
	var x = e.pageX - width/2
	var y = e.pageY - height/2
	switch(clickMode) {
	case 0:
		for(var i in constructs) {
			var tower = constructs[i]
			if(Math.hypot(x-tower.x, y-tower.y) < 50) {
				selectedTower = i
				clickMode = MODE_UPGRADE
				showUpgrades()
				return
			}
		}
		break;
	case 1:
		for(var i in constructs) {
			var tower = constructs[i]
			if(Math.hypot(x-tower.x, y-tower.y) < 50) {
				return
			}
		}
		money -= baseCost;
		var tower = {'x': x, 'y': y, 'theta': 0, 'type': 'd'}
		constructs.push(tower)
		clickMode = MODE_UPGRADE
		selectedTower = constructs.indexOf(tower)
		showUpgrades()
		break;
	default:
		$('#upgrades').html("<div class='desc'>No Tower Selected</div>")
		break;
	}
})

function showUpgrades() {
	var tower = constructs[selectedTower]
	$('#upgrades').html('');
	for(var k in towers) {
		var v = towers[k]
		if(!v.parent)
			continue;

		if(v.parent.indexOf(tower.type) != -1) {
			$('#upgrades').append(genUpgradeDesc(k))
		}
	}
}

function genUpgradeDesc(type) {
	var type = towers[type]
	return $('<div class="upgrade">')
		.append($('<span class="icon">&#'+type.char+';</span>'))
		.append($('<span class="name">'+type.name+"</span>"))
}

function buyTower() {
	if(money < baseCost)
		return;
	clickMode = MODE_BUY
}

function drawCrystal() {
	g.fillStyle = '#0ff'
	g.beginPath()
	var count = 5
	var pi = Math.PI*2/count;
	var time = new Date().getTime() * 0.001
	var size = 20 + Math.sin(time*count) * 2;
	for(var i = 0; i < count; i++ ){
		var x = Math.cos(i*pi+time) * size
		var y = Math.sin(i*pi+time) * size
		if(i == 0)
			g.moveTo(x, y)
		else 
			g.lineTo(x, y)
	}
	g.closePath()
	g.fill()
}

function drawTower(char, x, y, theta) {
	if(!theta)
		theta = 0

	g.save()
	g.translate(x, y)
	g.rotate(-theta)
	g.fillStyle="#222"
	g.beginPath()
	g.arc(0, 0, 25, 0, Math.PI * 2, false)
	g.fill()

	g.fillStyle="#fff"
	g.textAlign="center"
	g.font = "50px 'Roboto'"
	g.textBaseline = 'middle'; 
	g.fillText(String.fromCharCode(char), 0, 0)
	g.restore()
}

function tick() {
	g.restore();
	width = g.canvas.width = canvas.width()
	height = g.canvas.height = canvas.height()

	if(money != _transMoney) {
		_transMoney += Math.sign(money-_transMoney)
		$('#moneyVal').text('$'+_transMoney)
	}

	g.fillStyle="#444"
	g.fillRect(0, 0, width, height)
	g.translate(width/2, height/2);

	for(var i in constructs) {
		var tower = constructs[i]
		drawTower(towers[tower.type].char, tower.x, tower.y)
	}

	switch(clickMode) {
		case 0:

			break;
		case 1:
			drawTower(towers.d.char, mouseX, mouseY)
			break;
	}
	

	drawCrystal()
}

setInterval(tick, 5)