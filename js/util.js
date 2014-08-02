// ======================================================================
// formats a given hashrate (H/s) to humand readable hashrate
// like xxx.yyy GH/s
// ======================================================================

var formatHashrate= function(rate) {
  rate= parseFloat(rate); unit= 'H/s';
  if(rate >= 1000) { rate /= 1000; unit= 'KH/s'; }
  if(rate >= 1000) { rate /= 1000; unit= 'MH/s'; }
  if(rate >= 1000) { rate /= 1000; unit= 'GH/s'; }
  if(rate >= 1000) { rate /= 1000; unit= 'TH/s'; }
  if(rate >= 1000) { rate /= 1000; unit= 'PH/s'; }
  return (rate.toFixed(2) + ' ' + unit);
}

// ======================================================================
// format seconds to an interval like '1d 7h 5s'

String.prototype.formatSeconds = function () {
    var sec_num = parseInt(this, 10);
    var days    = Math.floor(sec_num / 86400);
    var hours   = Math.floor((sec_num - (days * 86400)) / 3600);
    var minutes = Math.floor((sec_num - (days * 86400  + hours * 3600)) / 60);
    var seconds = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60);

    var time= '';
    if(days > 0) time+= days + 'd ';
    time += hours + 'h ' + minutes + 'm ' + seconds + ' s';
    return time;
}

// ======================================================================

var satoshiToBTC = function(satoshis) {
  return parseFloat(satoshis) * 1e-8;
}

var BTCToUSD = function(bitcoin_amount) {
  if (dollar_per_bitcoin) {
    return parseFloat(bitcoin_amount) * parseFloat(dollar_per_bitcoin);
  }
}

var getLatestBitcoinPrice = function() {
  $.ajax('https://blockchain.info/ticker?cors=true', {
      async: true,
      cache: true,
      success: function(ticker) {
          if (ticker) {
              dollar_per_bitcoin = parseFloat(ticker['USD']['last']);
          }
      }
  });
}

var bindCurrencyConversionButtons = function () {
  $('button.to_usd').unbind();

  $('button.to_usd').on('click', function(event){
    if (this.className == 'to_btc') {
      bitcoin_amount = parseFloat(this.firstChild.dataset['value']);
      this.firstChild.innerHTML = bitcoin_amount + ' BTC';
      this.className = 'to_usd';
    } else {
      bitcoin_amount = parseFloat(this.firstChild.dataset['value']);
      bitcoin_in_usd = BTCToUSD(bitcoin_amount);
      this.firstChild.innerHTML = '$' + addCommas(bitcoin_in_usd.toFixed(2)) + ' USD';
      this.className = 'to_btc';
    }
  });
}

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}