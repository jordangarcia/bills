'use strict';

angular.module('LocalStorageModule').value('prefix', 'bwf');

angular.module('billsApp')
	.factory('appModel', ['localStorageService', function (localStorageService) {
		var self;

		var LOCAL_STORAGE_KEY = 'data';

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
		 * Deletes an entry from a model property array
		 *
		 * @param {String} where
		 * @param {Object} item
		 */
		Model.prototype.delete = function(where, entry) {
			if (!self[where]) {
				throw new Error('Invalid model property '+where);
			}
			var ind = self[where].indexOf(entry);
			if (ind > -1) {
				self[where].splice(ind, 1);
			}
		};

		/**
		 * Saves the model data
		 */
		Model.prototype.save = function() {
			var toSave = {
				personId:            self.personId,
				people:              self.people,
				items:               self.items,
				subtotalGratuities:  self.subtotalGratuities,
			};

			localStorageService.set(LOCAL_STORAGE_KEY, toSave);
		};

		/**
		 * Loads data from localStorage
		 */
		Model.prototype.load = function() {
			var data = localStorageService.get(LOCAL_STORAGE_KEY);
			if (!data) {
				return;
			}

			self.personId           = data.personId;
			self.people             = data.people;
			self.items              = data.items;
			self.subtotalGratuities = data.subtotalGratuities;
		}

		return new Model();
	}]);
