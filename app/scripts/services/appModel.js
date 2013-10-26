'use strict';

angular.module('billsApp')
	.factory('appModel', function () {
		var self;
		var Model = function() {
			self = this;
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
			info.id = self.personId;
			self.personId++;

			self.people.push(info);
		};

		/**
		 * Deletes a person
		 *
		 * @param {Object} person
		 */
		Model.prototype.deletePerson = function(person) {
			var ind = self.people.indexOf(person);
			if (ind > -1) {
				self.people.splice(ind, 1);
			}
		};

		/**
		 * Delets an item
		 *
		 * @param {Object} item
		 */
		Model.prototype.deleteItem = function(item) {
			var ind = self.items.indexOf(item);
			if (ind > -1) {
				self.items.splice(ind, 1);
			}
		};

		return new Model();
	});
