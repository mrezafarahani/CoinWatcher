// popup.js
var serverTime = 0;
var binanceToken = false;
var bittrexToken = false;
var APIURLTIME = "https://api.binance.com/api/v1/time";
var BINAPIACCURL = "https://api.binance.com/api/v3/account?recvWindow=60000&timestamp={0}&signature={1}";
var BINPRICEURL = "https://api.binance.com/api/v1/ticker/allPrices"
// if (Object.keys(localStorage).length==0){
//   console.log(Object.keys(localStorage).length);
//   localStorage.setItem("key", "dfd");
//   console.log(Object.keys(localStorage).length);
// }
myApp.controller("PageController", function ($scope, $http) {

  $scope.callBinance = function(key, secret){
    $scope.message = APIURLTIME;
    var prices = [];
    $http.get(BINPRICEURL).then(function(res){
      for(i=0; i<res.data.length;i++){
        prices[res.data[i].symbol]=res.data[i].price;
      }
      console.log(prices);
    });
    $http.get(APIURLTIME).success(function(response) {
        serverTime = response['serverTime'];
        var message = "recvWindow=60000&timestamp={0}".replace('{0}',serverTime);
        var hash = CryptoJS.HmacSHA256(message, secret);
        var signature = CryptoJS.enc.Hex.stringify(hash);
        var URLCall = BINAPIACCURL.replace('{0}', serverTime);
        URLCall = URLCall.replace('{1}', signature);
        var req = {
           method: 'GET',
           url: URLCall,
           headers: {'X-MBX-APIKEY': key}
           // ,data: { test: 'test' }
         };
         $scope.balances = [];
         var ethTotal= 0;
         var total = 0;
         var assetData = [];

        $http(req)
              .then(function(response) {
                  for(i=0; i<response.data['balances'].length; i++){
                    total = parseFloat(response.data['balances'][i]['free']) + parseFloat(response.data['balances'][i]['locked'])
                    if(total>0){
                      if(response.data['balances'][i]['asset']=='ETH'){
                        ethEquv = total;
                      }
                      else if (response.data['balances'][i]['asset']=='BTC') {
                        ethEquv = total / prices["ETHBTC"];
                      }
                      else if (response.data['balances'][i]['asset']=='GAS') {
                        ethEquv = 0;
                      }
                      else {
                        ethEquv = total * prices[response.data['balances'][i]['asset']+"ETH"];
                      }
                      if(ethEquv<0.001){
                        continue;
                      }
                      var price = 0;
                      ethTotal += ethEquv;
                      ethEquv = ethEquv.toFixed(5);
                      assetData = response.data['balances'][i];
                      assetData['free'] = parseFloat(assetData['free']).toFixed(4);
                      assetData['locked'] = parseFloat(assetData['locked']).toFixed(4);
                      // response.data['balances'][i]['free'] = response.data['balances'][i]['free'].toFixed(5);
                      $scope.balances.push(Object.assign({}, assetData, {"ethval": ethEquv}));
                    }
                  }
                  $scope.ethTotal = ethTotal.toFixed(3);
                  $scope.usdtTotal = (ethTotal * prices["ETHUSDT"]).toFixed(2);
              });
      });
    }
    // End of callBinance
  $scope.callBittrex = function(key, secret){
    
  }


    $scope.showMarket = function(market){
      if(market=='Binance'){
        if("Binance" in localStorage){
          binanceToken = true;
          $scope.apiKey = localStorage["apiKey"];
          var tokens = JSON.parse(localStorage.Binance);
          $scope.callBinance(tokens.key, tokens.secret);
          $scope.showKeyField = false;
          $scope.showSecretField = false;
          $scope.selectedMarket = "Binance";
        }
        else {
          $scope.showKeyField = true;
          $scope.showSecretField = true;
          $scope.balances = [];
        }
      }
      else if (market=="Bittrex") {
        if("BittrexAvailable" in localStorage){
          var tokens = JSON.parse(localStorage.Bittrex);
          $scope.callBittrex(tokens.key, tokens.secret);
        }
        else{
          $scope.showKeyField = true;
          $scope.showSecretField = true;
          $scope.balances = [];
        }

      }
    }
    $scope.showKeyField = false;
    $scope.showSecretField = false;
    // $scope.message = "Hello from AngularJS";
    $scope.exMarkets = ["Binance", "Bittrex"];
    $scope.apiTokens = [];


    $scope.showMarket("Binance");


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
        $scope.showMarket("Binance");
      }
      else if (selectedMarket=="Bittrex") {
        $scope.showMarket("Bittrex");
      }
      else if (selectedMarket=="reset") {
        $scope.showKeyField = false;
        $scope.showSecretField = false;
        $scope.selectedMarket = null;
      }
      else {
        $scope.showKeyField = false;
        $scope.showSecretField = false;
      }
      // console.log(localStorage["key"]);
    };

    $scope.submitFields = function(){
      // localStorage.setItem("apiSecret", $scope.apiSecret);
      localStorage.setItem($scope.selectedMarket + "Available", true);
      var exchangeKeys = {"key":$scope.apiKey, "secret":$scope.apiSecret}
      localStorage.setItem($scope.selectedMarket, JSON.stringify(exchangeKeys));
      $scope.showMarket($scope.selectedMarket);
    }

});
