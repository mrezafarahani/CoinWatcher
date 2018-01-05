// popup.js
var secret = "AFSY2EiLJ3ApiJUX3u1odnHDh2M40zT0uVk5qXqFfEqrFs4Q1XzpxJ5Uq9h4kfSg";
var key = "ZowmnxTHyjzafVtzuRLIGPgwJGnrkPOR2pXcZ0OrYo8FzlIh5hWv4oZZHNpZZ1yA";
var serverTime = 0;
var APIURLTIME = "https://api.binance.com/api/v1/time";
var APIACCURL = "https://api.binance.com/api/v3/account?recvWindow=60000&timestamp={0}&signature={1}";
// if (Object.keys(localStorage).length==0){
//   console.log(Object.keys(localStorage).length);
//   localStorage.setItem("key", "dfd");
//   console.log(Object.keys(localStorage).length);
// }
myApp.controller("PageController", function ($scope, $http) {
  $scope.callBinance = function(){
    $scope.message = APIURLTIME;
    $http.get(APIURLTIME).success(function(response) {
        serverTime = response['serverTime'];
        var message = "recvWindow=60000&timestamp={0}".replace('{0}',serverTime);
        var hash = CryptoJS.HmacSHA256(message, $scope.apiSecret);
        var signature = CryptoJS.enc.Hex.stringify(hash);
        var URLCall = APIACCURL.replace('{0}', serverTime);
        URLCall = URLCall.replace('{1}', signature);
        var req = {
           method: 'GET',
           url: URLCall,
           headers: {'X-MBX-APIKEY': 'ZowmnxTHyjzafVtzuRLIGPgwJGnrkPOR2pXcZ0OrYo8FzlIh5hWv4oZZHNpZZ1yA'}
           // ,data: { test: 'test' }
         };
         $scope.balances = [];
         var total = 0;

        $http(req)
              .then(function(response) {
                  for(i=0; i<response.data['balances'].length; i++){
                    total = parseFloat(response.data['balances'][i]['asset']) + parseFloat(response.data['balances'][i]['locked'])
                    if(total>0){
                      $scope.balances.push(response.data['balances'][i]);
                    }
                  }
                  // $scope.message = response.data['balances'];
                  // {asset: "BTC", free: "0.09878964", locked: "0.00000000"}
              });
      });
    };

    $scope.showKeyField = false;
    $scope.showSecretField = false;
    // $scope.message = "Hello from AngularJS";
    $scope.exMarkets = ["Binance", "Bitrex"];
    $scope.apiTokens = [];
    if ("apiKey" in localStorage){
      $scope.apiKey = localStorage["apiKey"];
    }
    else {
      $scope.apiKey = "Enter Api Key";
    }
    $scope.saveKey = function(apiKey){
      localStorage.setItem("apiKey", apiKey);
      // console.log(localStorage["key"]);
    };
    $scope.showFields = function(selectedMarket){
      if (selectedMarket=="Binance"){
        $scope.showKeyField = true;
        $scope.showSecretField = true;
      }
      else if (selectedMarket=="reset") {
        $scope.showKeyField = false;
        $scope.showSecretField = false;
        $scope.selectedMarket = null;
      }
      // console.log(localStorage["key"]);
    };

    $scope.submitFields = function(){
      localStorage.setItem("apiSecret", $scope.apiSecret);
      localStorage.setItem("Binance", [$scope.apiKey, $scope.apiSecret]);
      $scope.callBinance();
      $scope.showFields('reset')
    }

});
