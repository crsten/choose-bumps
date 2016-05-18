/*eslint-disable */
"use strict";

const expect = require('chai').expect;
require('jsdom-global')();
const chooseBumps = require('./choosebumps');

describe('choose-bumps',function() {
	let sourceElement = document.createElement('div');
	let cb = chooseBumps(sourceElement);
	let cbSearch = chooseBumps(sourceElement,{
		search: true
	});
	let cbTag = chooseBumps(sourceElement,{
		multiple: true,
		items: ['1','2','3']
	});
	let cbTagSearch = chooseBumps(sourceElement,{
		search: true,
		multiple: true
	});

	it('Initialization: should return an object (instanceof ChooseBumps)',function() {
		expect(cb).to.be.an.instanceOf(chooseBumps);
	});

	describe('Element',function() {
		it('should return same as passed in element',function() {
			expect(cb.element).to.be.equal(sourceElement);
		});
	});

	describe('Items',function() {
		cb.items = ['1','2','3','4'];
		it('should return an array',function() {
			expect(cb.items).to.be.a('array').with.length(4);
		});
	});

	describe('Search',function() {
		it('(non-searchable) should return false',function() {
			expect(cb.search).to.be.false;
		});
		it('(searchable) should return true',function() {
			expect(cbSearch.search).to.be.true;
		});
	});

	describe('Placeholder',function() {
		it('should return a string',function() {
			expect(cb.placeholder).to.be.a('string');
		});
	});

	describe('Multiple',function() {
		it('(non-multiple) should return false',function() {
			expect(cb.multiple).to.be.false;
		});
		it('(multiple) should return true',function() {
			expect(cbTag.multiple).to.be.true;
		});
	});

	describe('Selected',function(){
		it('(non-multiple) should return an object or string',function() {
			cb.select('1');
			expect(cb.selected).to.be.a('string');

			let a = {id: 1};
			let b = {id: 2}
			cb.items = [a,b];
			cb.select({id: 2});
			expect(cb.selected).to.equal(b);
		});
		it('(multiple) should return an array',function() {
			cbTag.select('1');
			expect(cbTag.selected).to.be.a('array').with.length(1);
		});
	});

	describe('All templates',function() {
		it('should return a string',function() {
			expect(cb.template).to.be.a('string');
			expect(cb.tagtemplate).to.be.a('string');
			expect(cb.selectedtemplate).to.be.a('string');
		})
	});

	describe('Searchfields',function() {
		it('should return a string',function() {
			expect(cb.searchfields).to.be.a('string');
		})
	});
});