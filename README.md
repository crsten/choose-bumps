# choose-bumps
[![Build Status](https://travis-ci.org/crsten/choose-bumps.svg?branch=master&style=flat-square)](https://travis-ci.org/crsten/choose-bumps)
[![npm](https://img.shields.io/npm/dt/choosebumps.svg?style=flat-square)](https://www.npmjs.com/package/choosebumps)
[![Bower](https://img.shields.io/bower/v/choosebumps.svg?style=flat-square)]()
[![npm](https://img.shields.io/npm/v/choosebumps.svg?style=flat-square)](https://www.npmjs.com/package/choosebumps)
[![npm](https://img.shields.io/npm/l/express.svg?style=flat-square)]()

A dropdown so simple it will give you choose-bumps! Written in pure vanillajs

##Inspiration

Have you ever wanted a simple dropdown library that doesn't depend on bloated frameworks? Well i did! Have fun :)

##Demo

You can find a small [demo here](http://crsten.github.io/choose-bumps/).

##Installation

You can get it on npm.

```shell
npm install choosebumps --save
```

Or bower, too.

```shell
bower install choosebumps --save
```

If you're not using either package manager, you can use `choosebumps` by downloading the [files in the `dist` folder](dist).

####Including the JavaScript

Place `choosebumps` in the end of `<body>`.

####Including the CSS

Place [`dist/choosebumps.css`](dist/choosebumps.css) or [`dist/choosebumps.min.css`](dist/choosebumps.min.css) in your document.

#Usage

Choosebumps provides the easiest possible API to make dropdowns breeze in your applications.

##`ChooseBumps(element,options?)`

`element` can either be a string (selector) or an `HTMLElement` (not a jQuery element)

You can provide `options` to customize `choosebumps`. Here's an **overview of the default values**.

```js
ChooseBumps(element,{
  placeholder: 'Choose',
  items: [],
  search: false,
  searchfields: '',
  multiple: false,
  template: '{{data}}',
  tagtemplate: null, //inherits from template if null
  selectedtemplate: null, //inherits from template if null
  onselect: null,
  onremove: null,
  onadd: null,
  categorize: null
});
```

The following functions are supported on the returned instance

```js

cb.select(item);
cb.remove(item);
cb.reset();

```

The options/functions are detailed below. **All the options can be set at initialization or anytime later when you feel for it(even if `choosebumps` is open or whatever)**

####`options.items`

By default `choosebumps` has no items. You can add items either by sending them in to the options at initialization:

```js
var cb = ChooseBumps('#cb',{
  items: [1,2,3,4]
});
```

or anytime later by setting `items` for the returned `choosebumps` instance:

```js
var cb = ChooseBumps('#cb');
//Some lines later...
cb.items = [5,6,7];
```

You can also send in a string(URL) which will be fetched either dynamically when searching or when the property is being set.
If you want search dynamically with `choosebumps` replace the part that should be changed in the URL with `{{query}}`. It will then make a new call everytime the searchphrase changes.

*`options.items` accepts an array or string(url) as input and ignores all other types.*

####`options.processing`

If you need to preprocess the fetched data before passing it to `choosebumps` you can do it with the `options.processing` property. You can set it at initialization:

```js
var cb = ChooseBumps('#cb',{
  processing: function(fetched_data) {
    //Do some stuff with your data here and pass it on...
    return fetched_data.map(function(enrty) {
      return {
        firstname: entry.firstname,
        lastname: entry.lastname
      };
    });
  }
});
```

or anytime later by setting `processing` for the returned `choosebumps` instance:

```js
var cb = ChooseBumps('#cb');
//Some lines later...
cb.processing = function Your_function(){};
```

*`options.processing` accepts a function as input and ignores all other types.*

####`options.placeholder`

By default `choosebumps` has `"Choose"` as the placeholder text. You can change the placeholder text either by sending them in to the options at initialization:

```js
var cb = ChooseBumps('#cb',{
  placeholder: 'Choose your force now!'
});
```

or anytime later by setting `placeholder` for the returned `choosebumps` instance:

```js
var cb = ChooseBumps('#cb');
//Some lines later...
cb.placeholder = 'Have you choosen already?';
```

*`options.placeholder` accepts a string as input and ignores all other types.*

####`options.search`

By default `choosebumps` has disabled `search`. You can activate it either by sending it to the options at initialization:

```js
var cb = ChooseBumps('#cb',{
  search: true
});
```

or anytime later by setting `search` for the returned `choosebumps` instance:

```js
var cb = ChooseBumps('#cb');
//Some lines later...
cb.search = false;
```

When searching, `choosebumps` will look through each property of each item in `items`. (If item is an object)
If you want to define what `choosebumps` should look for remember to set `options.searchfields`.

*`options.search` accepts anything as input and checks the input for its thruthiness.*

####`options.searchfields` (only relevant if `items` are objects)

By default `choosebumps` searches through each property in all `items`. You can define wich fields should be searched by sending a string in to the options at initialization:

```js
var cb = ChooseBumps('#cb',{
  searchfields: 'firstname lastname adress' //Space separated string
});
```

or anytime later by setting `searchfields` for the returned `choosebumps` instance:

```js
var cb = ChooseBumps('#cb');
//Some lines later...
cb.searchfields = 'firstname lastname' //Space separated string
```

*`options.searchfields` accepts a string as input and splits its content by space. All other types are ignored*

####`options.multiple`

With `options.multiple` you can allow selection of multiple items.

By default `choosebumps` has disabled `multiple` selection. You can activate it either by sending it in to the options at initialization:

```js
var cb = ChooseBumps('#cb',{
  multiple: true
});
```

or anytime later by setting `multiple` for the returned `choosebumps` instance:

```js
var cb = ChooseBumps('#cb');
//Some lines later...
cb.multiple = false;
```

*`options.multiple` accepts anything as input and checks the input for its thruthiness.*

####`options.template`

The templating in `choosebumps` is inspired by the moustache library. All variables can be rendered into view by putting the key of the object between `{{` and `}}`. This does also work for nested object. **Be aware that all variables must be prefixed with `data.`**

```js
var obj = {
  name: {
    first: 'Boba',
    last: 'Fett'
  }
};
'{{data.name.first}} {{data.name.last}}' --- renders ---> 'Boba Fett'
```

By default `choosebumps` has `{{data}}` as the template (Works for array of string or numbers). You can change it either by sending it in to the options at initialization:

```js
var cb = ChooseBumps('#cb',{
  template: '{{data.name}}'
});
```

or anytime later by setting `multiple` for the returned `choosebumps` instance:

```js
var cb = ChooseBumps('#cb');
//Some lines later...
cb.template = '{{data.name.last}}';
```

*`options.template` accepts a string as input and ignores all other values.*

####`options.tagtemplate` (only if `options.multiple` is true)

`options.tagtemplate` can be used to set a custom template for the selected item rendering when multiple item selection is enabled.
It works the same way as `options.template` --> see documentation further up.

If `options.tagtemplate` is not set, it will inherit the template from `options.template`.

####`options.selectedtemplate`

`options.selectedtemplate` can be used to set a custom template for the selected item rendering.
It works the same way as `options.template` --> see documentation further up.

If `options.selectedtemplate` is not set, it will inherit the template from `options.template`.

####`options.categorize`

With `options.categorize` you can categorize the items by string.

If i want to categorize by lastname with the following `options.items` set.
```js
  [
    {
      name: {
        last: 'Doe',
        first: 'John'
      }
    }
  ]
```

You would set `options.categorize` = `'name.last'`.

You can activate it either by sending it in to the options at initialization:

```js
var cb = ChooseBumps('#cb',{
  categorize: 'name.last'
});
```

or anytime later by setting `categorize` for the returned `choosebumps` instance:

```js
var cb = ChooseBumps('#cb');
//Some lines later...
cb.categorize = null;
```

*`options.categorize` accepts a string or null as input and ignores all other types.*

####`options.onselect` (Callback)

With `options.onselect` you can attach a callback to the select event.

The callback function will get 1 parameter with the selected item.

You can activate it either by sending it in to the options at initialization:

```js
var cb = ChooseBumps('#cb',{
  onselect: function(item){
    //Woho, item here...
  }
});
```

or anytime later by setting `onselect` for the returned `choosebumps` instance:

```js
var cb = ChooseBumps('#cb');
//Some lines later...
cb.onselect = null;
```

*`options.onselect` accepts a function or null as input and ignores all other types.*

####`options.onremove` (Callback)

With `options.onremove` you can attach a callback to the remove event.

The callback function will get 1 parameter with the selected item.

You can activate it either by sending it in to the options at initialization:

```js
var cb = ChooseBumps('#cb',{
  onremove: function(item){
    //Woho, item here...
  }
});
```

or anytime later by setting `onremove` for the returned `choosebumps` instance:

```js
var cb = ChooseBumps('#cb');
//Some lines later...
cb.onremove = null;
```

*`options.onremove` accepts a function or null as input and ignores all other types.*

####`options.onadd` (Callback)

With `options.onadd` you can attach a callback to the add event (works with search mode only).

Add gets triggered when pressing enter and no other item is selected.

The callback function will get 1 parameter with the typed text.

You can activate it either by sending it in to the options at initialization:

```js
var cb = ChooseBumps('#cb',{
  onadd: function(value){
    //Woho, value here...
  }
});
```

or anytime later by setting `onadd` for the returned `choosebumps` instance:

```js
var cb = ChooseBumps('#cb');
//Some lines later...
cb.onadd = null;
```

*`options.onadd` accepts a function or null as input and ignores all other types.*

####`choosebumps.select` (Function)

With `choosebumps.select` you can programmaticaly set the selected item.

The function will take the item to be selected as parameter. **Only items that are in `options.items` can be selected!**

**If the parameter is null, reset gets called!**

You can call it on the returned `choosebumps` instance:

```js
var cb = ChooseBumps('#cb',{
  items: [1,2,3,4]
});
//Some lines later...
cb.select(4);
```

####`choosebumps.remove` (Function)

With `choosebumps.remove` you can programmaticaly remove a selected item.

The function will take the item to be removed from selection as parameter. **Only items that are selected can be removed!**

**If the parameter is null, reset gets called!**

You can call it on the returned `choosebumps` instance:

```js
var cb = ChooseBumps('#cb',{
  items: [1,2,3,4]
});
//Some lines later...
cb.remove(4);
```

####`choosebumps.reset` (Function)

With `choosebumps.reset` you can programmaticaly remove all selected items.

You can call it on the returned `choosebumps` instance:

```js
var cb = ChooseBumps('#cb',{
  items: [1,2,3,4]
});
//Some lines later...
cb.reset();
```



---

**Great shoutout to [Kent C. Dodds](https://github.com/kentcdodds) for providing great tutorials on [how to write an open source library](https://egghead.io/series/how-to-write-an-open-source-javascript-library)**
