'use strict';

angular.module('LocalStorageModule').value('prefix', 'bwf');

angular.module('billsApp')
	.factory('appModel', ['localStorageService', 'AUTOLOAD', function (localStorageService, AUTOLOAD) {
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
			self.update();
		};

		/**
		 * Replaces an item in Model.items
		 *
		 * @param {Object} oldItem item
		 * @param {Object} newItem item
		 */
		Model.prototype.replaceItem = function(oldItem, newItem) {
			self.items[self.items.indexOf(oldItem)] = newItem;
			self.update();
		};

		/**
		 * Adds an item and updates
		 *
		 * @param {Object} item
		 */
		Model.prototype.addItem = function(item) {
			self.items.push(item);
			self.update();
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
				self.update();
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
		};

		/**
		 * Gets person by id
		 *
		 * @param {Integer} id
		 * @param {Object} person
		 */
		Model.prototype.getPerson = function(id) {
			return self.people.filter(function(person){
				return person.id === id;
			})[0];
		};

		/**
		 * Updates person items mapping and app total/subtotal
		 */
		Model.prototype.update = function() {
			function round(amount) {
				return Math.round(amount*100)/100;
			}

			self.total = 0;
			self.subtotal = 0;

			// reset all meta values on each person
			self.people.map(function(person) {
				person.items = [];
				person.subtotal = 0;
				person.subtotalGratuities = [];
				person.total = 0;
			});

			// calculate subtotals/pretotal for each person
			self.items.map(function(item) {
				item.people.map(function(personId) {
					var personRef = self.getPerson(personId);

					var amount = round(item.price / item.people.length);
					personRef.subtotal += amount;
					personRef.total += amount;
					personRef.items.push({
						name: item.name,
						amount: amount,
					});
				});
			});

			// calculate subtotal gratuities and fill in person.pretotal
			self.people.map(function(person) {
				self.subtotalGratuities.map(function(grat) {
					var amount = round(person.subtotal * (grat.percent / 100));
					person.subtotalGratuities.push({
						name: grat.name,
						percent: grat.percent,
						amount: amount,
					});

					person.total += amount;
				});

				self.subtotal += person.subtotal;
				self.total += person.subtotal;
			});

			// update the subtotal gratuities amounts
			self.subtotalGratuities.map(function(grat) {
				grat.amount = round(self.subtotal * (grat.percent / 100));
				self.total += grat.amount;
			});
		};

		var model = new Model();
		if (AUTOLOAD) {
			model.load();
		}
		return model;
	}]);
