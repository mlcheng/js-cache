/***********************************************

  "cache_test.js"

  Created by Michael Cheng on 5/25/2020 12:33:27 PM
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

import { test } from './../janus/janus';
import { cache } from './cache';

test('can retrieve value from cache', ({ expect }) => {
	const c = new cache.Cache(1);

	c.add('key', 'value');

	expect(c.get('key')).toBe('value');
});

test('can return an array of keys in the cache', ({ expect }) => {
	const c = new cache.Cache(2);

	c.add('key', 'value');
	c.add('key2', 'value2');

	expect(c.keys()).toEqual(['key', 'key2']);
});

test('can return an array of values in the cache', ({ expect }) => {
	const c = new cache.Cache(2);

	c.add('key', 'value');
	c.add('key2', 'value2');

	expect(c.values()).toEqual(['value', 'value2']);
});

test('can return all entries in the cache', ({ expect }) => {
	const c = new cache.Cache(2);

	c.add('foo', 'bar');
	c.add('baz', 'buzz');

	expect(c.export()).toEqual([
		{ key: 'foo', value: 'bar' },
		{ key: 'baz', value: 'buzz' },
	]);
});

test('can determine if a value exists in the cache', ({ expect }) => {
	const c = new cache.Cache(1);
	expect(c.valueExists('key')).toBe(false);
});

test('drops values that are least recently used', ({ expect }) => {
	const c = new cache.Cache(2);

	c.add('key', 'value');
	c.add('key2', 'value2');

	// Since there are now 2 entries in the cache with a size of 2, the next `add` will drop the least recently used value, which is `key`.
	c.add('key3', 'value3');

	expect(c.valueExists('key')).toBe(false);
});

test('retrieving a value promotes it in the cache', ({ expect }) => {
	const c = new cache.Cache(2);

	c.add('key', 'value');
	c.add('key2', 'value2');

	// Adding a new key should drop `key` since it was LRU. However, getting its value now should promote it ahead of `key2`.
	c.get('key');

	c.add('key3', 'value3');

	expect(c.get('key')).toBe('value');
	expect(c.valueExists('key2')).toBe(false);
	expect(c.get('key3')).toBe('value3');
});

test('cache can be purged', ({ expect }) => {
	const c = new cache.Cache(1);

	c.add('key', 'value');
	c.purge();

	expect(c.keys()).toEqual([]);
});