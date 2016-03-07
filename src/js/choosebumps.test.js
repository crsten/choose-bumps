"use strict";

const expect = require('chai').expect;
require('jsdom-global')();
const ChooseBumps = require('./choosebumps');

describe('choose-bumps',function(){
	let cb = ChooseBumps(document.createElement('div'));

	console.log(cb.element);

	it('should return an object (instanceof ChooseBumps)',function(){
		expect(cb).to.satisfy(obj => obj instanceof ChooseBumps);
	});

	describe('element',function(){
		it('should return an HTMLElement',function(){
			expect(cb.element).to.satisfy(obj => obj instanceof HTMLElement);
		});
	})
})