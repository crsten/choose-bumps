"use strict";

/*  ChooseBumps
 *  A dropdown so simple it will give you choose-bumps!
 *  Author: car.jacobsen@gmail.com
 *  License: MIT
 */

function ChooseBumps(element,options) {
	if(this instanceof ChooseBumps === false) return new ChooseBumps(element,options);

	let Element = null;
	let ItemContainer = null;
	let Search = false;
	let Selected = null;
	let isOpen = false;
	let SearchFields = null;
	let Placeholder = null;
	let Multiple = false;
	let Categorize = null;
	let Template = '';
	let TagTemplate = null;
	let SelectedTemplate = null;
	let SelectedIndex = null;
	let onSelect = null;
	let onAdd = null;
	let onRemove = null;
	let Items = [];

	let defaults = {
		placeholder: 'Choose',
		items: [],
		search: false,
		searchfields: '',
		multiple: false,
		template: '{{data}}',
		tagtemplate: null,
		selectedtemplate: null,
		categorize: null,
		onselect: null,
		onremove: null,
		onadd: null
	};

	function init() {
		this.element = element;
		Element.classList.add('choosebumps');
		Element.setAttribute('tabindex',0);
		renderHTML();

		setArgs.call(this,options || {});
	}

	function setPlaceholder(x) {
		if(typeof x !== 'string') return console.error('Placeholder must be a string.');
		Placeholder = x;
		Element.querySelector('.cb-main-item').setAttribute('placeholder',Placeholder);
	}

	function setMultiple(state) {
		Multiple = (state) ? true : false;
		if(Multiple) if(typeof Selected === 'object' && Selected) Selected = [Selected];
	}

	/* Interactions */

	function setOpened(state) {
		if(state === true) {
			renderItems();
			Element.classList.add('cb-active');
			ItemContainer.scrollTop = 0;
			document.addEventListener('click',setOpened);
			document.addEventListener('keydown',ArrowNavigation);
			focusSearch();
			isOpen = true;
		}
		else {
			resetSearch();
			Element.classList.remove('cb-active');
			document.removeEventListener('click',setOpened);
			document.removeEventListener('keydown',ArrowNavigation);
			SelectedIndex = null;
			isOpen = false;
		}
	}

	function ArrowNavigation(e) {
		if(new RegExp('38|40|13').test(e.keyCode)) e.preventDefault();
		switch(e.keyCode) {
			case 38:
			e.preventDefault();
			selectPrev();
			break;
			case 40:
			e.preventDefault();
			selectNext();
			break;
			case 13:
			if(typeof onAdd === 'function' && SelectedIndex === -1){
				onAdd(e.target.value);
				return e.target.value = '';
			}
			if(SelectedIndex < 0) return;
			selectItem(Items[parseInt(ItemContainer.children[SelectedIndex].getAttribute('data-id'),10)],true);
			SelectedIndex = null;
			break;
		}
	}

	/* Selecting */

	function removeSelected(item,triggerCallback,event) {
		if(event) event.stopPropagation();
		if(Selected.constructor === Array) {
			Selected.splice(Selected.indexOf(item),1);
			if(!Selected.length) Selected = null;
		}else{
			Selected = null;
		}

		if(!Selected) Element.querySelector('.cb-main-item').classList.add('cb-placeholder');
		if(onRemove && triggerCallback) onRemove(item);
		renderSelection();
		renderItems();
	}

	function selectNext() {
        if(SelectedIndex === null) SelectedIndex = -1;
        let max = ItemContainer.children.length - 1;

        SelectedIndex = (SelectedIndex < max) ? SelectedIndex + 1 : max;
        updateSelection();
    }

    function selectPrev() {
        let max = ItemContainer.children.length - 1;

        SelectedIndex = (!SelectedIndex) ? null : SelectedIndex - 1;
        updateSelection();
    }

    function scrollSelectedIntoView() {
		if(!SelectedIndex || SelectedIndex < 0) return;
		let selectedItem = ItemContainer.children[SelectedIndex];
		let containerTop = ItemContainer.scrollTop;
		let containerBottom = ItemContainer.scrollTop + ItemContainer.clientHeight;
		let selectedItemTop = selectedItem.offsetTop;
		let selectedItemBottom = selectedItem.offsetTop + selectedItem.clientHeight;
		if(selectedItemTop < containerTop) ItemContainer.scrollTop = selectedItem.offsetTop;
		else if(selectedItemBottom > containerBottom) ItemContainer.scrollTop = selectedItemBottom - ItemContainer.clientHeight;
    }

    function updateSelection() {
        var oldSelection = ItemContainer.querySelector('.cb-selected');
        if(oldSelection) oldSelection.classList.remove('cb-selected');
        let el = ItemContainer.children[SelectedIndex];
        if(el) el.classList.add('cb-selected');
        scrollSelectedIntoView();
    }

	function selectItem(item,triggerCallback,event) {
		Element.querySelector('.cb-main-item').classList.remove('cb-placeholder');
		resetSearch();

		if(Multiple) {
			if(Selected && Selected.indexOf(item) < 0) Selected.push(item);
			else Selected = [item];

			renderItems();
			if(event) event.stopPropagation();
			focusSearch();
		}else{
			Selected = item;
			setOpened(false);
		}

		if(onSelect && triggerCallback) onSelect(item);
		renderSelection();
	}

	/* -------------------- */

    /* Searching */

    function setSearch(state) {
		Search = (state) ? true : false;

		if(Search) {
			Element.classList.add('cb-search-enabled');
			let SearchBox = document.createElement('input');
				SearchBox.className = 'cb-search';
				SearchBox.setAttribute('type','text');
				SearchBox.setAttribute('size',1);
				SearchBox.setAttribute('autocomplete','off');

				SearchBox.addEventListener('keyup',function KeyUp(e) {
					if(new RegExp('38|40|13').test(e.keyCode) === false) {
						renderItems(search(this.value));
						SelectedIndex = null;
						selectNext();
					}
				});

				SearchBox.addEventListener('keypress',function KeyPress() {
					this.setAttribute('size',this.value.length + 1);
				});

			Element.querySelector('.cb-main-item').appendChild(SearchBox);
		}else Element.classList.remove('cb-search-enabled');
	}

    function resetSearch() {
		if(!Search) return;
		Element.querySelector('.cb-search').value = '';
	}

	function focusSearch() {
		if(!Search) return;
		Element.querySelector('.cb-search').focus();
	}

	function search(query) {
		if(!query) return Items;
		let regex = new RegExp(query,'i');

		return Items.filter(function Filter(x) {
			if(SearchFields) {
				let state = false;
				SearchFields.split(' ').forEach(function ForEach(field) {
					let keys = field.split('.');
					let value = keys.reduce(function Reduce(val,item) {
						return val[item];
					},x);

					if(regex.test(value)) state = true;
				});

				return state;
			}else
			if(typeof x === 'string') return regex.test(x);
			else
				return searchObject(x);
		});

		function searchObject(obj) {
			return Object.keys(obj).reduce(function Reduce(val,key) {
				let check = false;
				if(typeof obj[key] === 'object') check = searchObject(obj[key]);
				else check = regex.test(obj[key]);

				if(check) val = true;

				return val;
			},false);
		}
	}

	/* -------------------- */

	/* Rendering */

	function renderHTML() { //comment
		let MainItem = document.createElement('div');
			MainItem.className = 'cb-main-item cb-placeholder trigger';


		let Caret = `<svg class="cb-caret trigger" viewBox="0 0 512 512" height="20" width="20">
						<path class="trigger" d="m508 108c-4-4-11-4-15 1l-237 271l-237-271c-4-5-11-5-15-1c-5 4-5 10-1 15l245 280c2 3 5 4 8 4c3 0 6-1 8-4l245-280c4-5 4-11-1-15z"></path>
					</svg>`;

		MainItem.innerHTML += Caret;
		Element.appendChild(MainItem);

		ItemContainer = document.createElement('div');
		ItemContainer.className = 'cb-items';
		Element.appendChild(ItemContainer);

		Element.querySelector('.cb-main-item').addEventListener('click',(e) => {
			e.stopPropagation();
			setOpened(!isOpen);
		});
	}

	function renderSelection() {

		let mainItem = Element.querySelector('.cb-main-item');

		if(Multiple) {
			[].slice.call(Element.querySelectorAll('.cb-main-item .cb-tag')).forEach((t) => {
				mainItem.removeChild(t);
			});

			if(!Selected) return;
			Selected.forEach(item => {
				let tag = document.createElement('div');
					tag.className = 'cb-tag';
					tag.innerHTML = parseTemplate(item,TagTemplate || Template) + `<svg viewBox="0 0 512 512">
						<path d="m271 256l238-238c4-4 4-11 0-15c-4-4-11-4-15 0l-238 238l-238-238c-4-4-11-4-15 0c-4 4-4 11 0 15l238 238l-238 238c-4 4-4 11 0 15c2 2 5 3 8 3c2 0 5-1 7-3l238-238l238 238c2 2 5 3 7 3c3 0 6-1 8-3c4-4 4-11 0-15z"></path>
					</svg>`;

					tag.querySelector('svg').addEventListener('click',removeSelected.bind(null,item,true));

				mainItem.insertBefore(tag,mainItem.children[mainItem.children.length - 1]);
			});
		} else {
			if(!Selected) return [].slice.call(mainItem.querySelectorAll('.cb-selected-item,.cb-tag')).forEach( e => mainItem.removeChild(e));
			let item = document.createElement('div');
				item.className = 'cb-selected-item';
				item.innerHTML = parseTemplate(Selected,SelectedTemplate || Template);


			let previousItem = Element.querySelector('.cb-selected-item');
			if(previousItem) mainItem.removeChild(previousItem);
			mainItem.insertBefore(item,mainItem.children[mainItem.children.length - 1]);
		}
	}

	function renderItems(items) {
		ItemContainer.innerHTML = '';

		if(Categorize)
			Items = Items.sort((a,b) => {
				if(getPropertyByString(Categorize,a) < getPropertyByString(Categorize,b)) return -1;
				if(getPropertyByString(Categorize,a) > getPropertyByString(Categorize,b)) return 1;
				return 0;
			});

		let previousItem = null;
		Items.forEach((item,index) => {
			if(items && items.indexOf(item) < 0) return;
			if(Multiple && Selected && Selected.indexOf(item) > -1 || !Multiple && Selected === item) return;
			let option = document.createElement('div');
				option.setAttribute('data-id', index);
				option.innerHTML = parseTemplate(item,Template);
				option.addEventListener('click',selectItem.bind(null,item,true));

			if(Categorize && (!previousItem || getPropertyByString(Categorize,previousItem) !== getPropertyByString(Categorize,item))) option.setAttribute('category',getPropertyByString(Categorize,item));

			previousItem = item;
			ItemContainer.appendChild(option);
		});
	}

	function parseTemplate(data,template) {
		let re = /{{data\.?(.+?)?}}/;
		let m;
		while(m = re.exec(template)) {
			let selector = '';
			let value = data;
			if(m[1]) {
				selector = '.' + m[1];
				value = getPropertyByString(m[1],data);
			}

			let replace = new RegExp('{{data' + selector + '}}');
			template = template.replace(replace,value);
		}

		return template;
	}

	function getPropertyByString(selector,object) {
		return selector.split('.').reduce((val,item) => {
			return val[item];
		},object);
	}

	/* -------------------- */

	Object.defineProperties(this,{
		'element': {
			get: () => Element,
			set: (x) => {
				if(typeof x === 'string') {
					let el = document.querySelector(x);
					if(el) Element = el;
					else console.error('Element not found.');
				}else if(x instanceof HTMLElement) Element = x;
				else console.error('Invalid argument');
			}
		},
		'items': {
			get: () => Items,
			set: (x) => {
				if(x instanceof Array) Items = x;
				else console.error('Items must be an array.');
			}
		},
		'search': {
			get: () => Search,
			set: setSearch
		},
		'placeholder': {
			get: () => Placeholder,
			set: setPlaceholder
		},
		'multiple': {
			get: () => Multiple,
			set: setMultiple
		},
		'selected': {
			get: () => Selected
		},
		'template': {
			get: () => Template,
			set: (x) => {
				if(typeof x === 'string') {
					Template = x;
					renderItems();
					renderSelection();
				}
				else console.error('Template must be a string.');
			}
		},
		'tagtemplate': {
			get: () => TagTemplate || Template,
			set: (x) => {
				if(typeof x === 'string') {
					TagTemplate = x;
					renderItems();
					renderSelection();
				}
			}
		},
		'selectedtemplate': {
			get: () => SelectedTemplate || Template,
			set: (x) => {
				if(typeof x === 'string') {
					SelectedTemplate = x;
					renderItems();
					renderSelection();
				}
			}
		},
		'searchfields': {
			get: () => SearchFields,
			set: (x) => {
				if(typeof x === 'string') SearchFields = x;
				else console.error('SearchFields must be a string.');
			}
		},
		'onselect': {
			get: () => onSelect,
			set: (x) => {
				if(typeof x === 'function') onSelect = x;
				else if(!x) onSelect = null;
			}
		},
		'onremove': {
			get: () => onRemove,
			set: (x) => {
				if(typeof x === 'function') onRemove = x;
				else if(!x) onRemove = null;
			}
		},
		'onadd': {
			get: () => onAdd,
			set: (x) => {
				if(typeof x === 'function') onAdd = x;
				else if(!x) onAdd = null;
			}
		},
		'categorize': {
			get: () => Categorize,
			set: (x) => {
				if(typeof x === 'string') Categorize = x;
				else Categorize = null;

				renderItems()	;
			}
		}
	});

	this.select = function Select(item) {
		if(!item) return Reset();
		let match = Items.reduce((m,i) => m = isEquivalent(item,i) ? i : m,null);
		if(match) selectItem(match);

		function isEquivalent(a, b) {
			if(typeof a !== 'object' && typeof b !== 'object') return a === b;
			let aProps = Object.getOwnPropertyNames(a);
			let bProps = Object.getOwnPropertyNames(b);

			if (aProps.length !== bProps.length) return false;

			for (let i = 0; i < aProps.length; i++) {
				let propName = aProps[i];

				if(a[propName] !== b[propName]) return false;
			}
			return true;
		}
	};

	function Reset() {
		if(Selected.constructor === Array) {
			var copy = Selected.slice();
			copy.forEach(function(item) {
				removeSelected(item,true);
			});
		}else{
			removeSelected(Selected,true);
		}

		resetSearch();
	}

	this.reset = Reset;


	init.call(this);

	function setArgs(opts) {
        for(let key in defaults) this[key] = (opts[key]) ? opts[key] : defaults[key] ;
    };

	return Object.freeze(this);
 }


/* Spread it to the world! */
 (function Factory (factory) {
    if ( typeof define === 'function' && define.amd ) define('ChooseBumps', factory);
    else if ( typeof exports === 'object' ) module.exports = factory;
    else window.ChooseBumps = factory;
})(ChooseBumps);
