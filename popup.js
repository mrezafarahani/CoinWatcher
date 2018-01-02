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
        APIURL = "https://api.binance.com/api/v1/time";
        $.getJSON(APIURL
        ).done(function(data){
          $('div.test3').text(data['serverTime']);
          serverTime = data['serverTime']
        });
        var message = "recvWindow=60000&timestamp={0}".format(serverTime);
        var hash = CryptoJS.HmacSHA256("Message", secret).toString(CryptoJS.enc.Hex);
        $('div.test4').text(message);

    });
});
// secret  = AFSY2EiLJ3ApiJUX3u1odnHDh2M40zT0uVk5qXqFfEqrFs4Q1XzpxJ5Uq9h4kfSg
// key = ZowmnxTHyjzafVtzuRLIGPgwJGnrkPOR2pXcZ0OrYo8FzlIh5hWv4oZZHNpZZ1yA
