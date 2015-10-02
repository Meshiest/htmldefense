var money = 0;

setInterval(function () {
	money ++;
	$('#moneyVal').html('$'+money);
}, 5);