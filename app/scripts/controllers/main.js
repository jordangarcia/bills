'use strict';

angular.module('billsApp')
.controller('MainCtrl', ['$scope', 'appModel', function ($scope, appModel) {
	$scope.model          = appModel;
	$scope.overlayShowing = false;
	$scope.modalShowing   = false;

	$scope.showResetModal = function() {
		this.modalShowing = true;
		this.overlayShowing = true;
	};

	$scope.hideResetModal = function() {
		this.modalShowing = false;
		this.overlayShowing = false;
	};

	/**
	 * Resets the app and hides the modal
	 */
	$scope.resetApp = function() {
		this.model.reset();
		this.hideResetModal();
	};
}]);
