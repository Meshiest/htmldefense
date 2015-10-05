var canvas = $('#canvas')
var g = canvas[0].getContext('2d')
var width = g.canvas.width = canvas.width()
var height = g.canvas.height = canvas.height()

var money = 500
var _transMoney = money-money/5
var baseCost = 20;
var maxLives = 20;
var lives = maxLives;

var lastTime = new Date().getTime()
var currTime = lastTime;

var constructs = []

var enemies = []

var lastSpawn = 0;

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

var isDragging = false;
var canvasOff = {'x': 0, 'y': 0}
var lastDragPos = {'x': 0, 'y': 0}

canvas
	.mousedown(function(e){
		var x = e.pageX - width/2
		var y = e.pageY - height/2
		switch(clickMode) {
		case 0: case 2:
			for(var i in constructs) {
				var tower = constructs[i]
				if(Math.hypot(x-tower.x - canvasOff.x, y-tower.y - canvasOff.y) < 25) {
					clickMode = MODE_UPGRADE
					selectedTower = i
					showUpgrades()
					return
				}
			}
			clickMode = MODE_NONE
			selectedTower = undefined
			$('#upgrades').html("<div class='desc'>No Tower Selected</div>")
			break;
		case 1:
			if(Math.hypot(x, y) < 100)
				return;
			for(var i in constructs) {
				var tower = constructs[i]
				if(Math.hypot(x-tower.x - canvasOff.x, y-tower.y - canvasOff.y) < 50) {
					return
				}
			}
			money -= baseCost;
			var tower = {'x': x - canvasOff.x, 'y': y - canvasOff.y, 'theta': 0, 'type': 'd', 'value': baseCost}
			constructs.push(tower)
			clickMode = MODE_UPGRADE
			selectedTower = constructs.indexOf(tower)
			showUpgrades()
			return;
		default:
			$('#upgrades').html("<div class='desc'>No Tower Selected</div>")
			break;
		}

		isDragging = true;
		lastDragPos.x = e.pageX
		lastDragPos.y = e.pageY
		
	})
	.mouseup(function(e){
		isDragging = false;
	})
	.mousemove(function(e){
		if(!isDragging)
			return;
		canvasOff.x += e.pageX - lastDragPos.x
		canvasOff.y += e.pageY - lastDragPos.y
		
		lastDragPos.x = e.pageX
		lastDragPos.y = e.pageY
	})
	


function showUpgrades(tower) {
	if(!tower)
		var tower = constructs[selectedTower]
	console.log(tower)
	$('#upgrades').html('');

	for(var k in towers) {
		var v = towers[k]
		if(!v.parent)
			continue;

		if(v.parent.indexOf(tower.type) != -1) {
			$('#upgrades').append(genUpgradeDesc(k))
		}
	}
	if($('#upgrades').children().length == 0) {
		$('#upgrades').html("<div class='desc'>No More Upgrades</div>")
	}

}

function clickUpgrade(e) {
	var type = $(e).attr('type')
	var tower = constructs[selectedTower]
	if(towers[type].cost > money)
		return;
	money -= towers[type].cost
	tower.type = type;
	showUpgrades()
}

function genUpgradeDesc(type) {
	var tower = towers[type]
	return $('<div class="upgrade'+(tower.cost > money?" disabled":"")+'" type="'+type+'" onclick="clickUpgrade(this)">')
		.append($('<div class="icon">&#'+tower.char+';</div>'))
		.append($('<div class="name">'+tower.name+"</div>"))
		.append($('<div class="cost">$'+tower.cost+"</div>"))
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

	g.beginPath()
	g.strokeStyle = '#000'
	g.lineWidth = 4;
	g.arc(0, 0, size + 5, 0, Math.PI * 2, false)
	g.closePath();
	g.stroke()
	g.beginPath()
	g.strokeStyle='#0f0'
	g.arc(0, 0, size + 5, 0, Math.PI * 2 * (lives/maxLives), false)
	g.stroke()


}

function drawEnemy(enemy) {
	g.save()
	g.translate(enemy.x, enemy.y)
	g.fillStyle="#f00"
	g.beginPath()
	g.arc(0, 0, 20, 0, Math.PI * 2, false)
	g.closePath()
	g.fill()

	g.restore()
}

function drawTower(char, x, y, theta, selected) {
	var time = new Date().getTime();
	
	if(!theta)
		theta = 0

	g.save()
	g.translate(x, y)
	g.fillStyle="#222"
	if(clickMode != MODE_BUY && Math.hypot(mouseX-x - canvasOff.x, mouseY-y - canvasOff.y) < 25)
			g.fillStyle="#333"
	if(selected) {
		var k = Math.floor(Math.sin(time*0.01)*8+32)
		g.fillStyle = 'rgb('+k+','+k+','+k+')'
	}
	g.beginPath()
	g.arc(0, 0, 25, 0, Math.PI * 2, false)
	g.closePath();
	g.fill()

	if(selected) {
		g.save()
		g.strokeStyle='#ff0'
		g.lineWidth = 4
		var circ = Math.PI * 2 * 25;
		g.setLineDash([circ/4])
		g.lineDashOffset = (time*0.1)%circ;
		g.stroke()
		g.restore()
	}

	g.fillStyle="#fff"
	g.textAlign="center"
	g.font = "50px 'Roboto'"
	g.textBaseline = 'middle'; 
	g.save()
	g.rotate(theta)
	g.fillText(String.fromCharCode(char), 0, 0)
	g.restore()

	g.restore()
}

function tick() {
	lastTime = currTime;
	currTime = new Date().getTime()
	var delta = (currTime-lastTime)/1000.0;

	if(lastSpawn + 1000 < currTime) {
		lastSpawn = currTime;
		var angle = Math.random() * 2 * Math.PI
		var x = Math.cos(angle)*420
		var y = Math.sin(angle)*420
		var enemy  = {'x': x, 'y': y, 'health': 15}
		enemies.push(enemy)
	}

	for(var i in enemies) {
		var enemy = enemies[i];
		var theta = Math.atan2(-enemy.y, -enemy.x);
		enemy.x += Math.cos(theta) * 20 * delta;
		enemy.y += Math.sin(theta) * 20 * delta;
	}


	g.restore();
	width = g.canvas.width = canvas.width()
	height = g.canvas.height = canvas.height()

	if(money != _transMoney) {
		_transMoney += Math.sign(money-_transMoney)
		$('#moneyVal').text('$'+_transMoney)
	}

	g.fillStyle="#000"
	g.fillRect(0, 0, width, height)
	g.translate(width/2+canvasOff.x, height/2+canvasOff.y);
	g.fillStyle="#444"
	g.beginPath()
	g.arc(0, 0, 400, 0, Math.PI * 2, false)
	g.fill()
	g.closePath()
	
	//g.fillRect(-400, -400, 800, 800)

	var hypot = Math.hypot(canvasOff.x, canvasOff.y);
	if(hypot > 400) {
		canvasOff.x += (canvasOff.x / hypot * 400 - canvasOff.x) * 0.03;
		canvasOff.y += (canvasOff.y / hypot * 400 - canvasOff.y) * 0.03;	
	}

	for(var i in constructs) {
		var tower = constructs[i]
		var distance = 150
		var closest = undefined
		for(var j in enemies) {
			var enemy = enemies[j]
			var enemyDist = Math.hypot(tower.x-enemy.x, tower.y-enemy.y);
			if(enemyDist < distance) {
				distance = enemyDist
				closest = enemy
			}
		}
		if(closest) {
			tower.theta = Math.atan2(closest.y-tower.y, closest.x-tower.x)
		}
		drawTower(towers[tower.type].char, tower.x, tower.y, tower.theta, selectedTower == i)
	}

	for(var i in enemies) {
		drawEnemy(enemies[i]);
	}

	switch(clickMode) {
		case 1:
			drawTower(towers.d.char, mouseX-canvasOff.x, mouseY-canvasOff.y)
			break;
	}
	

	drawCrystal()
}

setInterval(tick, 5)