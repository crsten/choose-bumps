(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ChooseBumps"] = factory();
	else
		root["ChooseBumps"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*  ChooseBumps
                                                                                                                                                                                                                                                                               *  A dropdown so simple it will give you choose-bumps!
                                                                                                                                                                                                                                                                               *  Author: car.jacobsen@gmail.com
                                                                                                                                                                                                                                                                               *  License: MIT
                                                                                                                                                                                                                                                                               */

__webpack_require__(1);

function ChooseBumps(element, options) {
  if (this instanceof ChooseBumps === false) return new ChooseBumps(element, options);

  var MainElement = null;
  var ItemContainer = null;
  var LoadingContainer = null;
  var Search = false;
  var Selected = null;
  var isOpen = false;
  var SearchFields = null;
  var Placeholder = null;
  var NoResults = null;
  var Multiple = false;
  var Categorize = null;
  var Template = '';
  var TagTemplate = null;
  var SelectedTemplate = null;
  var SelectedIndex = null;
  var onSelect = null;
  var Processing = null;
  var onAdd = null;
  var onRemove = null;
  var TypeTreshold = null;
  var Fetch = null;
  var FetchUrl = null;
  var ItemFunction = null;
  var MinLength = 0;
  var Items = [];

  var defaults = {
    placeholder: 'Choose',
    items: [],
    search: false,
    searchfields: '',
    noresults: '',
    multiple: false,
    template: '{{data}}',
    tagtemplate: null,
    selectedtemplate: null,
    categorize: null,
    processing: null,
    minlength: null,
    onselect: null,
    onremove: null,
    onadd: null
  };

  function init() {
    this.element = element;
    MainElement.classList.add('choosebumps');
    MainElement.setAttribute('tabindex', 0);
    if (MainElement.getAttribute('placeholder')) defaults.placeholder = MainElement.getAttribute('placeholder');
    renderHTML();

    setArgs.call(this, options || {});
  }

  function setPlaceholder(x) {
    if (typeof x !== 'string') return console.error('Placeholder must be a string.');
    Placeholder = x;
    MainElement.querySelector('.cb-main-item').setAttribute('placeholder', Placeholder);
  }

  function setMultiple(state) {
    Multiple = state ? true : false;
    if (Multiple) if ((typeof Selected === 'undefined' ? 'undefined' : _typeof(Selected)) === 'object' && Selected) Selected = [Selected];
  }

  /* Interactions */

  function setOpened(state) {
    state = typeof state === 'boolean' ? state : !isOpen;
    if (state === true) {
      renderItems();
      MainElement.classList.add('cb-active');
      ItemContainer.scrollTop = 0;
      document.addEventListener('click', setOpened);
      document.addEventListener('keydown', ArrowNavigation);
      document.addEventListener('keyup', onEscape);
      focusSearch();
      isOpen = true;
    } else {
      resetSearch();
      MainElement.classList.remove('cb-active');
      document.removeEventListener('click', setOpened);
      document.removeEventListener('keydown', ArrowNavigation);
      document.removeEventListener('keyup', onEscape);
      SelectedIndex = null;
      isOpen = false;
    }
  }

  function onEscape(e) {
    if (e.keyCode === 27) setOpened(false);
  }

  function ArrowNavigation(e) {
    if (new RegExp('38|40|13').test(e.keyCode)) e.preventDefault();
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
        if (typeof onAdd === 'function' && SelectedIndex === -1) {
          onAdd(e.target.value);
          return e.target.value = '';
        }
        if (SelectedIndex === undefined || SelectedIndex === null || SelectedIndex < 0) {
          return setOpened();
        }
        selectItem(Items[parseInt(ItemContainer.children[SelectedIndex].getAttribute('data-id'), 10)], true);
        SelectedIndex = null;
        break;
    }
  }

  /* Selecting */

  function removeSelected(item, triggerCallback, event) {
    if (event) event.stopPropagation();
    if (Selected && Selected.constructor === Array) {
      Selected.splice(Selected.indexOf(item), 1);
      if (!Selected.length) Selected = null;
    } else {
      Selected = null;
    }

    if (!Selected) MainElement.querySelector('.cb-main-item').classList.add('cb-placeholder');
    if (onRemove && triggerCallback) onRemove(item);
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
    var max = ItemContainer.children.length - 1;

    SelectedIndex = !SelectedIndex ? null : SelectedIndex - 1;
    updateSelection();
  }

  function scrollSelectedIntoView() {
    if (!SelectedIndex || SelectedIndex < 0) return;
    var selectedItem = ItemContainer.children[SelectedIndex];
    var containerTop = ItemContainer.scrollTop;
    var containerBottom = ItemContainer.scrollTop + ItemContainer.clientHeight;
    var selectedItemTop = selectedItem.offsetTop;
    var selectedItemBottom = selectedItem.offsetTop + selectedItem.clientHeight;
    if (selectedItemTop < containerTop) ItemContainer.scrollTop = selectedItem.offsetTop;else if (selectedItemBottom > containerBottom) ItemContainer.scrollTop = selectedItemBottom - ItemContainer.clientHeight;
  }

  function updateSelection() {
    var oldSelection = ItemContainer.querySelector('.cb-selected');
    if (oldSelection) oldSelection.classList.remove('cb-selected');
    var el = ItemContainer.children[SelectedIndex];
    if (el) el.classList.add('cb-selected');
    scrollSelectedIntoView();
  }

  function selectItem(item, triggerCallback, event) {
    MainElement.querySelector('.cb-main-item').classList.remove('cb-placeholder');
    resetSearch();

    if (Multiple) {
      if (!Selected || !Selected.reduce(function (m, i) {
        return m || isEquivalent(item, i);
      }, false)) {
        if (Selected) Selected.push(item);else Selected = [item];
      }

      renderItems();
      if (event) event.stopPropagation();
      focusSearch();
    } else {
      Selected = item;
      setOpened(false);
    }

    if (onSelect && triggerCallback) onSelect(item);
    renderSelection();
  }

  /* -------------------- */

  /* Searching */

  function setSearch(state) {
    Search = state ? true : false;

    if (Search) {
      MainElement.classList.add('cb-search-enabled');
      var SearchBox = document.createElement('input');
      SearchBox.className = 'cb-search';
      SearchBox.setAttribute('type', 'text');
      SearchBox.setAttribute('size', 1);
      SearchBox.setAttribute('autocomplete', 'off');

      SearchBox.addEventListener('keyup', function KeyUp(e) {
        ItemContainer.removeAttribute('no-results-text');
        if (new RegExp('38|40|13').test(e.keyCode) === false && this.value.length >= MinLength) {
          TypeTreshold && clearTimeout(TypeTreshold);
          TypeTreshold = setTimeout(function () {
            search(SearchBox.value, function (result) {
              if (/{{.*}}/gi.test(FetchUrl)) Items = result;
              if (ItemFunction) Items = result;
              if (!Items.length && NoResults) ItemContainer.setAttribute('no-results-text', NoResults.replace('{{query}}', SearchBox.value));

              renderItems(result);
              SelectedIndex = null;
              selectNext();
            });
          }, 200);
        }
      });

      SearchBox.addEventListener('keypress', function KeyPress() {
        this.setAttribute('size', this.value.length + 1);
      });

      MainElement.querySelector('.cb-main-item').appendChild(SearchBox);
    } else MainElement.classList.remove('cb-search-enabled');
  }

  function resetSearch() {
    if (!Search) return;
    MainElement.querySelector('.cb-search').value = '';
  }

  function focusSearch() {
    if (!Search) return;
    MainElement.querySelector('.cb-search').focus();
  }

  function search(query, cb) {
    var regex = new RegExp(query, 'i');

    if (/{{.*}}/gi.test(FetchUrl)) {
      fetchItems(FetchUrl.replace(/{{query}}/, query), cb);
    } else if (ItemFunction) {
      toggleLoader(true);
      ItemFunction(query, function (result) {
        cb(Processing ? Processing(result) : result);
        toggleLoader(false);
      });
    } else {
      cb(Items.filter(function Filter(x) {
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
      }));
    }

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
    //comment
    var MainItem = document.createElement('div');
    MainItem.className = 'cb-main-item cb-placeholder trigger';

    var Caret = '<svg class="cb-caret trigger" viewBox="0 0 512 512" height="20" width="20">\n\t\t\t\t\t\t<path class="trigger" d="m508 108c-4-4-11-4-15 1l-237 271l-237-271c-4-5-11-5-15-1c-5 4-5 10-1 15l245 280c2 3 5 4 8 4c3 0 6-1 8-4l245-280c4-5 4-11-1-15z"></path>\n\t\t\t\t\t</svg>';

    MainItem.innerHTML += Caret;
    MainElement.appendChild(MainItem);

    ItemContainer = document.createElement('div');
    ItemContainer.className = 'cb-items';
    MainElement.appendChild(ItemContainer);

    LoadingContainer = document.createElement('div');
    LoadingContainer.className = 'cb-loader';
    MainElement.appendChild(LoadingContainer);

    MainItem.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpened(!isOpen);
    });

    MainElement.addEventListener('keypress', function (e) {
      if (e.keyCode === 13) setOpened();
    });
  }

  function renderSelection() {
    var mainItem = MainElement.querySelector('.cb-main-item');

    if (Multiple) {
      [].slice.call(MainElement.querySelectorAll('.cb-main-item .cb-tag')).forEach(function (t) {
        mainItem.removeChild(t);
      });

      if (!Selected) return;
      Selected.forEach(function (item) {
        var tag = document.createElement('div');
        tag.className = 'cb-tag';
        tag.innerHTML = parseTemplate(item, TagTemplate || Template) + '<svg viewBox="0 0 512 512">\n\t\t\t\t\t\t<path d="m271 256l238-238c4-4 4-11 0-15c-4-4-11-4-15 0l-238 238l-238-238c-4-4-11-4-15 0c-4 4-4 11 0 15l238 238l-238 238c-4 4-4 11 0 15c2 2 5 3 8 3c2 0 5-1 7-3l238-238l238 238c2 2 5 3 7 3c3 0 6-1 8-3c4-4 4-11 0-15z"></path>\n\t\t\t\t\t</svg>';

        tag.querySelector('svg').addEventListener('click', removeSelected.bind(null, item, true));

        mainItem.insertBefore(tag, mainItem.children[mainItem.children.length - 1]);
      });
    } else {
      if (!Selected) return [].slice.call(mainItem.querySelectorAll('.cb-selected-item,.cb-tag')).forEach(function (e) {
        return mainItem.removeChild(e);
      });
      var item = document.createElement('div');
      item.className = 'cb-selected-item';
      item.innerHTML = parseTemplate(Selected, SelectedTemplate || Template);

      var previousItem = MainElement.querySelector('.cb-selected-item');
      if (previousItem) mainItem.removeChild(previousItem);
      mainItem.insertBefore(item, mainItem.children[mainItem.children.length - 1]);
    }
  }

  function fetchItems(url, cb) {
    if (Fetch) {
      Fetch.abort();
      toggleLoader(false);
    }
    Fetch = new XMLHttpRequest();
    Fetch.open('GET', url);
    Fetch.onreadystatechange = function () {
      if (this.readyState == 4) {
        toggleLoader(false);
        if (this.status >= 200 && this.status < 400) {
          cb(Processing ? Processing(JSON.parse(this.responseText)) : JSON.parse(this.responseText));
          Fetch = null;
        } else {
          cb([]);
          Fetch = null;
        }
      }
    };
    Fetch.send();
    toggleLoader(true);
  }

  function toggleLoader(state) {
    if (state) {
      LoadingContainer.style.display = 'block';
      MainElement.querySelector('.cb-caret').style.display = 'none';
    } else {
      LoadingContainer.style.display = '';
      MainElement.querySelector('.cb-caret').style.display = '';
    }
  }

  function renderItems(items) {
    ItemContainer.innerHTML = '';

    if (Categorize) Items = Items.sort(function (a, b) {
      if (getPropertyByString(Categorize, a) < getPropertyByString(Categorize, b)) return -1;
      if (getPropertyByString(Categorize, a) > getPropertyByString(Categorize, b)) return 1;
      return 0;
    });

    var previousItem = null;
    Items.forEach(function (item, index) {
      if (items && items.indexOf(item) < 0) return;
      if (Multiple && Selected && Selected.reduce(function (m, i) {
        return m || isEquivalent(item, i);
      }, false) || !Multiple && Selected === item) return;
      var option = document.createElement('div');
      option.setAttribute('data-id', index);
      option.innerHTML = parseTemplate(item, Template);
      option.addEventListener('click', selectItem.bind(null, item, true));

      if (Categorize && (!previousItem || getPropertyByString(Categorize, previousItem) !== getPropertyByString(Categorize, item))) option.setAttribute('category', getPropertyByString(Categorize, item));

      previousItem = item;
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
        selector = '.' + m[1];
        value = getPropertyByString(m[1], data);
      }

      var replace = new RegExp('{{data' + selector + '}}');
      template = template.replace(replace, value);
    }

    return template;
  }

  function getPropertyByString(selector, object) {
    return selector.split('.').reduce(function (val, item) {
      return val[item];
    }, object);
  }

  /* -------------------- */

  Object.defineProperties(this, {
    element: {
      get: function get() {
        return MainElement;
      },
      set: function set(x) {
        if (typeof x === 'string') {
          var el = document.querySelector(x);
          if (el) MainElement = el;else console.error('Element not found.');
        } else if (x instanceof HTMLElement) MainElement = x;else console.error('Invalid argument');
      }
    },
    items: {
      get: function get() {
        return FetchUrl || ItemFunction || Items;
      },
      set: function set(x) {
        if (x instanceof Array) Items = x;else if (typeof x == 'string') {
          FetchUrl = x;
          if (!/{{.*}}/gi.test(FetchUrl)) fetchItems(FetchUrl, function (result) {
            Items = result;
          });
        } else if (typeof x == 'function') {
          ItemFunction = x;

          toggleLoader(true);
          ItemFunction(null, function (result) {
            if (result instanceof Array) {
              if (Processing) Items = Processing(result);else Items = result;
            } else {
              Items = [];
            }
            toggleLoader(false);
          });
        } else console.error('Items must be an array or URL.');
      }
    },
    minlength: {
      get: function get() {
        return MinLength;
      },
      set: function set(x) {
        if (isNaN(x)) MinLength = 0;else MinLength = x;
      }
    },
    search: {
      get: function get() {
        return Search;
      },
      set: setSearch
    },
    placeholder: {
      get: function get() {
        return Placeholder;
      },
      set: setPlaceholder
    },
    noresults: {
      get: function get() {
        return NoResults;
      },
      set: function set(value) {
        if (typeof value === 'string') NoResults = value;else NoResults = null;
      }
    },
    multiple: {
      get: function get() {
        return Multiple;
      },
      set: setMultiple
    },
    selected: {
      get: function get() {
        return Selected;
      }
    },
    template: {
      get: function get() {
        return Template;
      },
      set: function set(x) {
        if (typeof x === 'string') {
          Template = x;
          renderItems();
          renderSelection();
        } else console.error('Template must be a string.');
      }
    },
    tagtemplate: {
      get: function get() {
        return TagTemplate || Template;
      },
      set: function set(x) {
        if (typeof x === 'string') {
          TagTemplate = x;
          renderItems();
          renderSelection();
        }
      }
    },
    selectedtemplate: {
      get: function get() {
        return SelectedTemplate || Template;
      },
      set: function set(x) {
        if (typeof x === 'string') {
          SelectedTemplate = x;
          renderItems();
          renderSelection();
        }
      }
    },
    searchfields: {
      get: function get() {
        return SearchFields;
      },
      set: function set(x) {
        if (typeof x === 'string') SearchFields = x;else console.error('SearchFields must be a string.');
      }
    },
    onselect: {
      get: function get() {
        return onSelect;
      },
      set: function set(x) {
        if (typeof x === 'function') onSelect = x;else if (!x) onSelect = null;
      }
    },
    processing: {
      get: function get() {
        return Processing;
      },
      set: function set(x) {
        if (typeof x === 'function') Processing = x;else if (!x) Processing = null;
      }
    },
    onremove: {
      get: function get() {
        return onRemove;
      },
      set: function set(x) {
        if (typeof x === 'function') onRemove = x;else if (!x) onRemove = null;
      }
    },
    onadd: {
      get: function get() {
        return onAdd;
      },
      set: function set(x) {
        if (typeof x === 'function') onAdd = x;else if (!x) onAdd = null;
      }
    },
    categorize: {
      get: function get() {
        return Categorize;
      },
      set: function set(x) {
        if (typeof x === 'string') Categorize = x;else Categorize = null;

        renderItems();
      }
    }
  });

  this.select = function Select(item) {
    if (!item) return Reset();

    if (FetchUrl && /{{.*}}/gi.test(FetchUrl)) {
      Items = [item];
    }

    var match = Items.length ? Items.reduce(function (m, i) {
      return m = isEquivalent(item, i) ? i : m;
    }, null) : item;
    if (match) selectItem(match);
  };

  this.remove = function Remove(item) {
    if (!item) return Reset();
    var match = Items.reduce(function (m, i) {
      return m = isEquivalent(item, i) ? i : m;
    }, null);
    if (match) removeSelected(match, true);
  };

  function isEquivalent(a, b) {
    if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== 'object' && (typeof b === 'undefined' ? 'undefined' : _typeof(b)) !== 'object') return a === b;
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    if (aProps.length !== bProps.length) return false;

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];

      if (a[propName] !== b[propName]) return false;
    }
    return true;
  }

  function Reset() {
    if (Selected && Selected.constructor === Array) {
      var copy = Selected.slice();
      copy.forEach(function (item) {
        removeSelected(item, true);
      });
    } else {
      removeSelected(Selected, true);
    }

    resetSearch();
  }

  this.reset = Reset;

  init.call(this);

  function setArgs(opts) {
    for (var key in defaults) {
      this[key] = opts[key] ? opts[key] : defaults[key];
    }
  }

  return Object.freeze(this);
}

exports.default = ChooseBumps;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ])["default"];
});