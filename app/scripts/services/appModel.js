'use strict';

angular.module('billsApp')
	.factory('appModel', function () {
		var Model = function() {
			this.personId           = 1;
			this.people             = [];
			this.items              = [];
			this.subtotalGratuities = [];
			this.subtotal           = 0;
			this.total              = 0;
		};

		/**
		 * Adds a person
		 *
		 * @param {Object} info
		 */
		Model.prototype.addPerson = function(info) {
			info.personId = this.personId;
			this.personId++;

			this.people.push(info);
		};

		/**
		 * Adds a person
		 *
		 * @param {Object} person
		 */
		Model.prototype.deletePerson = function(person) {
			var ind = this.people.indexOf(person);
			if (ind > -1) {
				this.people.splice(ind, 1);
			}
		};

		return new Model();
	});
