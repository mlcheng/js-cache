/***********************************************

  "index.js"

  Created by Michael Cheng on 07/24/2016 11:15
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

/* globals require, __dirname */
const { Test, namespace } = require('../../test/test.js');
const iqwerty = namespace(`${__dirname}/../`, 'cache');


let cache = iqwerty.cache.Builder('test', 5);
Test('Basic adding to cache works')
	.do(() => {
		cache.add('k1', 'v1');
		cache.add('k2', 'v2');
	})
	.expect(cache.get('k1'))
	.toBe('v1');

Test('Accessing a value promotes it to the end of the queue')
	.do(() => cache.get('k2'))
	.expect(cache.export()[cache.export().length-1].value)
	.toBe('v2');

Test('The value "v2" should exist')
	.assert(cache.valueExists('v2'))
	.is(true);

Test('Can add up to the specified size limit of objects to cache')
	.do(() => {
		cache.add('k3', 'v3');
		cache.add('k4', 'v4');
		cache.add('k5', 'v5');
	})
	.expect(cache.export().length)
	.toBe(5);

Test('Adding another object will cause the least recently used object to be deleted')
	.do(() => {
		cache.add('k6', 'v6');
	})
	.expect(cache.get('k1'))
	.toBe(undefined);

Test('Purging cache will remove all related cache')
	.do(() => {
		cache.purge();
	})
	.expect(cache.export())
	.toBe(undefined);


Test('Promoting head of cache queue works as expected')
	.do(() => {
		cache.add('k1', 'v1');
		cache.add('k2', 'v2');
		cache.add('k3', 'v3');
		cache.add('k4', 'v4');
		cache.add('k5', 'v5');

		cache.get('k1');
	})
	.expect(cache.export()[0].value)
	.toBe('v2');

Test('Promoting followers of head works as expected')
	.do(() => {
		cache.get('k3');
	})
	.expect(cache.export()[cache.export().length-1].value)
	.toBe('v3');


Test('Can get all keys of the cache')
	.do(() => {
		cache.purge();
		cache.add('k1', 'v1');
		cache.add('k2', 'v2');
		cache.add('k3', 'v3');
	})
	.using(Test.ValidationFunction.ARRAY_SHALLOW)
	.expect(cache.keys())
	.toBe(['k1', 'k2', 'k3']);

Test('Can get all values of the cache')
	.using(Test.ValidationFunction.ARRAY_SHALLOW)
	.expect(cache.values())
	.toBe(['v1', 'v2', 'v3']);