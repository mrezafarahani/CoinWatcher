// popup.js
var secret = "AFSY2EiLJ3ApiJUX3u1odnHDh2M40zT0uVk5qXqFfEqrFs4Q1XzpxJ5Uq9h4kfSg";
var key = "ZowmnxTHyjzafVtzuRLIGPgwJGnrkPOR2pXcZ0OrYo8FzlIh5hWv4oZZHNpZZ1yA";
var serverTime = 0;
$(document).ready(function(){
    $("button").click(function(){
      if($('#key').val())
      {
        key = $('#key').val();
      }
        secret = $('#secret').val();
        console.log(key);
        $('div.test1').text(key);
        $('div.test2').text(secret);
        var APIURLTIME = "https://api.binance.com/api/v1/time";
        var APIACCURL = "https://api.binance.com/api/v3/account?recvWindow=60000&timestamp={0}&signature={1}";
        serverTime = $.getJSON(APIURLTIME
        ).done(function(data){
          serverTime = data['serverTime'];
        // serverTime = getServerTime();
        var message = "recvWindow=60000&timestamp={0}".replace('{0}',serverTime);
        $('div.test3').text(message);
        var hash = CryptoJS.HmacSHA256(message, secret);
        var signature = CryptoJS.enc.Hex.stringify(hash);
        console.log(message);
        console.log(signature);
        APIACCURL = APIACCURL.replace('{0}', serverTime);
        APIACCURL = APIACCURL.replace('{1}', signature);
        $.ajax({
            url: APIACCURL,
            headers: { 'X-MBX-APIKEY': key },
            success : function (data) {
              $('div.test4').text(data);
            }
        });

        });

    });
});
// secret  = AFSY2EiLJ3ApiJUX3u1odnHDh2M40zT0uVk5qXqFfEqrFs4Q1XzpxJ5Uq9h4kfSg
// key = ZowmnxTHyjzafVtzuRLIGPgwJGnrkPOR2pXcZ0OrYo8FzlIh5hWv4oZZHNpZZ1yA
