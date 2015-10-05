'use strict';
(function () {
	var app = angular.module('CheckoutCtrl', ['ui.router']);

	app.controller('CheckoutController', function (cart, account, $scope,$ionicLoading, $rootScope, $localStorage, $ionicPopup, $state, $translate, ShopService, CheckoutService, CheckoutProcessService) {
		$scope.cart = cart;
		$scope.account = account.data.account;
		$scope.address = $localStorage.paymentAddress;
		$scope.payment = $localStorage.paymentMethod;
		$scope.shipping = $localStorage.shippingMethod;
		$scope.card = {};


		$scope.checkoutSuccess = function () {
			var promise = CheckoutService.getCheckoutSuccess();
			promise.then(
				function(response) {
					console.log(response);
					$state.go('goodbye');
				},
				function(error) {
					console.log(error);

				});
		}

		$scope.checkout = function() {
			console.log($localStorage);
			//if($localStorage.paymentAddress)
			CheckoutProcessService.checkout('pay');
		}

		$scope.savePayment = function (myform) {
			console.log(myform.number.$card.type);

			if(!$scope.card.cc_number){
				$ionicPopup.alert({
					title: 	"Error",			//translate['popup.info'],
					template: "You entered an invalid credid card number",		//translate['popup.not_in_delivery_zone'],
					buttons: [{
						text: 'OK',
						type: 'button-calm'
					}]
				});
				return false;
			};
			if(!$scope.card.expiry){
				$ionicPopup.alert({
					title: 	"Error",			//translate['popup.info'],
					template: "You entered an invalid date",		//translate['popup.not_in_delivery_zone'],
					buttons: [{
						text: 'OK',
						type: 'button-calm'
					}]
				});
				return false;
			};
			if(!$scope.card.name){
				$ionicPopup.alert({
					title: 	"Error",			//translate['popup.info'],
					template: "Please enter your name",		//translate['popup.not_in_delivery_zone'],
					buttons: [{
						text: 'OK',
						type: 'button-calm'
					}]
				});
				return false;
			};
			if(!$scope.card.cc_cvv2){
				$ionicPopup.alert({
					title: 	"Error",			//translate['popup.info'],
					template: "You entered an invalid CVC/CVV code",		//translate['popup.not_in_delivery_zone'],
					buttons: [{
						text: 'OK',
						type: 'button-calm'
					}]
				});
				return false;
			};

			var str = $scope.card.expiry
			$scope.card.cc_expire_date_month =  str.substring(0,2)
			$scope.card.cc_expire_date_year = str.substring(str.indexOf("/")+1);

			console.log($scope.card);

			$ionicLoading.show({templateUrl: 'templates/loading.html', noBackdrop: false});
			var promise = 	CheckoutService.payNow($localStorage.paymentMethod.code, $scope.card);
			promise.then(
				function (response) {
					$scope.checkoutSuccess();
					$ionicLoading.hide();
				},
				function (error) {
					console.log(error);
					$ionicLoading.hide();
				}
			)


		}

	});
})();
