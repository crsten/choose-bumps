"use strict";

/*  ChooseBumps
 *  A dropdown so simple it will give you choose-bumps!
 *  Author: car.jacobsen@gmail.com
 *  License: MIT
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function ChooseBumps(element, options) {
	if (this instanceof ChooseBumps === false) return new ChooseBumps(element, options);

	var Element = null;
	var ItemContainer = null;
	var Search = false;
	var Selected = null;
	var isOpen = false;
	var SearchFields = null;
	var Placeholder = null;
	var Multiple = false;
	var Template = '';
	var TagTemplate = null;
	var SelectedTemplate = null;
	var SelectedIndex = null;
	var Items = [];

	var defaults = {
		placeholder: 'Choose',
		items: [],
		search: false,
		searchfields: '',
		multiple: false,
		template: '{{data}}',
		tagtemplate: null,
		selectedtemplate: null
	};

	function init() {
		this.element = element;
		Element.classList.add('choosebumps');
		Element.setAttribute('tabindex', 0);
		renderHTML();

		setArgs.call(this, options);
	}

	function setPlaceholder(x) {
		if (typeof x !== 'string') return console.error('Placeholder must be a string.');
		Placeholder = x;
		Element.querySelector('.cb-main-item').setAttribute('placeholder', Placeholder);
	}

	function setMultiple(state) {
		Multiple = state ? true : false;
		if (Multiple) if ((typeof Selected === 'undefined' ? 'undefined' : _typeof(Selected)) === 'object' && Selected) Selected = [Selected];
	}

	/* Interactions */

	function setOpened(state) {
		if (state === true) {
			renderItems();
			Element.classList.add('cb-active');
			document.addEventListener('click', setOpened);
			focusSearch();
			isOpen = true;

			console.log('Opened');
		} else {
			resetSearch();
			Element.classList.remove('cb-active');
			document.removeEventListener('click', setOpened);
			SelectedIndex = null;
			isOpen = false;

			console.log('Close');
		}
	}

	/* Selecting */

	function removeSelected(item, event) {
		event.stopPropagation();
		Selected.splice(Selected.indexOf(item), 1);
		if (!Selected.length) Selected = null;

		if (!Selected) Element.querySelector('.cb-main-item').classList.add('cb-placeholder');

		renderSelection();
		renderItems();
	}

	function selectNext() {
		if (SelectedIndex === null) SelectedIndex = -1;
		var max = ItemContainer.children.length - 1;

		SelectedIndex = SelectedIndex < max ? SelectedIndex + 1 : max;
		updateSelection();
	}

	function selectPrev() {
		if (SelectedIndex === null) SelectedIndex = -1;
		var max = ItemContainer.children.length - 1;

		SelectedIndex = SelectedIndex === 0 ? null : SelectedIndex - 1;
		updateSelection();
	}

	function updateSelection() {
		var oldSelection = ItemContainer.querySelector('.cb-selected');
		if (oldSelection) oldSelection.classList.remove('cb-selected');
		var el = ItemContainer.children[SelectedIndex];
		if (el) el.classList.add('cb-selected');
	}

	function selectItem(item, event) {
		Element.querySelector('.cb-main-item').classList.remove('cb-placeholder');
		resetSearch();

		if (Multiple) {
			if (Selected && Selected.indexOf(item) < 0) Selected.push(item);else Selected = [item];

			renderItems();
			if (event) event.stopPropagation();
			focusSearch();
		} else {
			Selected = item;
			setOpened(false);
		}

		renderSelection();
	}

	/* -------------------- */

	/* Searching */

	function setSearch(state) {
		Search = state ? true : false;

		if (Search) {
			Element.classList.add('cb-search-enabled');
			var SearchBox = document.createElement('input');
			SearchBox.className = 'cb-search';
			SearchBox.setAttribute('type', 'text');
			SearchBox.setAttribute('size', 1);
			SearchBox.setAttribute('autocomplete', 'off');

			SearchBox.addEventListener('keyup', function KeyUp(e) {
				if (new RegExp('38|40|13').test(e.keyCode) === false) {
					renderItems(search(this.value));
					if (!SelectedIndex) selectNext();
				}
			});

			SearchBox.addEventListener('keypress', function KeyPress() {
				this.setAttribute('size', this.value.length + 1);
			});

			SearchBox.addEventListener('keydown', function KeyDown(e) {
				switch (e.keyCode) {
					case 38:
						e.preventDefault();
						selectPrev();
						break;
					case 40:
						e.preventDefault();
						selectNext();
						break;
					case 13:
						selectItem(Items[parseInt(ItemContainer.children[SelectedIndex].getAttribute('data-id'), 10)]);
						SelectedIndex = null;
						break;
				}
			});

			Element.querySelector('.cb-main-item').appendChild(SearchBox);
		} else Element.classList.remove('cb-search-enabled');
	}

	function resetSearch() {
		if (!Search) return;
		Element.querySelector('.cb-search').value = '';
	}

	function focusSearch() {
		if (!Search) return;
		Element.querySelector('.cb-search').focus();
	}

	function search(query) {
		if (!query) return Items;
		var regex = new RegExp(query, 'i');

		return Items.filter(function Filter(x) {
			if (SearchFields) {
				var state = false;
				SearchFields.split(' ').forEach(function ForEach(field) {
					var keys = field.split('.');
					var value = keys.reduce(function Reduce(val, item) {
						return val[item];
					}, x);

					if (regex.test(value)) state = true;
				});

				return state;
			} else if (typeof x === 'string') return regex.test(x);else return searchObject(x);
		});

		function searchObject(obj) {
			return Object.keys(obj).reduce(function Reduce(val, key) {
				var check = false;
				if (_typeof(obj[key]) === 'object') check = searchObject(obj[key]);else check = regex.test(obj[key]);

				if (check) val = true;

				return val;
			}, false);
		}
	}

	/* -------------------- */

	/* Rendering */

	function renderHTML() {
		var MainItem = document.createElement('div');
		MainItem.className = 'cb-main-item cb-placeholder trigger';

		var Caret = '<svg class="cb-caret trigger" viewBox="0 0 512 512">\n\t\t\t\t\t\t<path class="trigger" d="m508 108c-4-4-11-4-15 1l-237 271l-237-271c-4-5-11-5-15-1c-5 4-5 10-1 15l245 280c2 3 5 4 8 4c3 0 6-1 8-4l245-280c4-5 4-11-1-15z"></path>\n\t\t\t\t\t</svg>';

		MainItem.innerHTML += Caret;
		Element.appendChild(MainItem);

		ItemContainer = document.createElement('div');
		ItemContainer.className = 'cb-items';
		Element.appendChild(ItemContainer);

		Element.querySelector('.cb-main-item').addEventListener('click', function (e) {
			console.log('Click: Element');
			e.stopPropagation();
			setOpened(!isOpen);
		});

		/*Element.addEventListener('focus',() => {
  	if(!isOpen) {
  		setOpened(true);
  	}
  });*/
	}

	function renderSelection() {
		var mainItem = Element.querySelector('.cb-main-item');

		if (Multiple) {
			[].slice.call(Element.querySelectorAll('.cb-main-item .cb-tag')).forEach(function (t) {
				mainItem.removeChild(t);
			});
			if (!Selected) return;

			Selected.forEach(function (item) {
				var tag = document.createElement('div');
				tag.className = 'cb-tag';
				tag.innerHTML = parseTemplate(item, TagTemplate) + '<svg viewBox="0 0 512 512">\n\t\t\t\t\t\t<path d="m271 256l238-238c4-4 4-11 0-15c-4-4-11-4-15 0l-238 238l-238-238c-4-4-11-4-15 0c-4 4-4 11 0 15l238 238l-238 238c-4 4-4 11 0 15c2 2 5 3 8 3c2 0 5-1 7-3l238-238l238 238c2 2 5 3 7 3c3 0 6-1 8-3c4-4 4-11 0-15z"></path>\n\t\t\t\t\t</svg>';

				tag.querySelector('svg').addEventListener('click', removeSelected.bind(null, item));

				mainItem.insertBefore(tag, mainItem.children[mainItem.children.length - 1]);
			});
		} else {
			var item = document.createElement('div');
			item.className = 'cb-selected-item';
			item.innerHTML = parseTemplate(Selected, SelectedTemplate);

			var previousItem = Element.querySelector('.cb-selected-item');
			if (previousItem) mainItem.removeChild(previousItem);
			mainItem.insertBefore(item, mainItem.children[mainItem.children.length - 1]);
		}
	}

	function renderItems(items) {
		ItemContainer.innerHTML = '';
		Items.forEach(function (item, index) {
			if (items && items.length && items.indexOf(item) < 0) return;
			if (Multiple && Selected && Selected.indexOf(item) > -1 || !Multiple && Selected === item) return;
			var option = document.createElement('div');
			option.setAttribute('data-id', index);
			option.innerHTML = parseTemplate(item, Template);
			option.addEventListener('click', selectItem.bind(null, item));

			ItemContainer.appendChild(option);
		});
	}

	function parseTemplate(data, template) {
		var re = /{{data\.?(.+?)?}}/;
		var m = void 0;
		while (m = re.exec(template)) {
			var selector = '';
			var value = data;
			if (m[1]) {
				var keys = m[1].split('.');
				selector = '.' + m[1];
				value = keys.reduce(function Reduce(val, item) {
					return val[item];
				}, data);
			}

			var replace = new RegExp('{{data' + selector + '}}');
			template = template.replace(replace, value);
		}

		return template;
	}

	/* -------------------- */

	Object.defineProperties(this, {
		'element': {
			get: function get() {
				return Element;
			},
			set: function set(x) {
				if (typeof x === 'string') {
					var el = document.querySelector(x);
					if (el) Element = el;else console.error('Element not found.');
				} else if (x instanceof HTMLElement) Element = x;else console.error('Invalid argument');
			}
		},
		'items': {
			get: function get() {
				return Items;
			},
			set: function set(x) {
				if (x instanceof Array) Items = x;else console.error('Items must be an array.');
			}
		},
		'search': {
			get: function get() {
				return Search;
			},
			set: setSearch
		},
		'placeholder': {
			get: function get() {
				return Placeholder;
			},
			set: setPlaceholder
		},
		'multiple': {
			get: function get() {
				return Multiple;
			},
			set: setMultiple
		},
		'selected': {
			get: function get() {
				return Selected;
			}
		},
		'template': {
			get: function get() {
				return Template;
			},
			set: function set(x) {
				if (typeof x === 'string') Template = x;else console.error('Template must be a string.');
			}
		},
		'tagtemplate': {
			get: function get() {
				return TagTemplate;
			},
			set: function set(x) {
				if (typeof x === 'string') TagTemplate = x;else TagTemplate = Template;
			}
		},
		'selectedtemplate': {
			get: function get() {
				return SelectedTemplate;
			},
			set: function set(x) {
				if (typeof x === 'string') SelectedTemplate = x;else SelectedTemplate = Template;
			}
		},
		'searchfields': {
			get: function get() {
				return SearchFields;
			},
			set: function set(x) {
				if (typeof x === 'string') SearchFields = x;else console.error('SearchFields must be a string.');
			}
		}
	});

	init.call(this);

	function setArgs(opts) {
		for (var key in defaults) {
			this[key] = opts[key] || defaults[key];
		}
	};

	return Object.freeze(this);
}

/* Spread it to the world! */
(function Factory(factory) {
	if (typeof define === 'function' && define.amd) define('ChooseBumps', factory);else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') module.exports = factory;else window.ChooseBumps = factory;
})(ChooseBumps);