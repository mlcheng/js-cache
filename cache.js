/***********************************************

  "cache.js"

  Created by Michael Cheng on 07/24/2016 09:44
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

import { LinkedList } from './linked_list';

export const cache = (() => {
	function LruCacheNode(value) {
		this.prev = null;
		this.next = null;
		this.value = value;
	}

	function LruCache(size) {
		const exports = {};
		const cache = {};

		function rebuildCache() {
			cache.lru = new LinkedList();
			cache.map = {};
		}

		// First build the cache.
		rebuildCache();

		exports.add = (key, value) => {
			if(cache.map.hasOwnProperty(key)) {
				// Already exists; simply update the value in the lruCacheNode
				const _co = cache.map[key];
				_co.value.value = value;
				cache.lru.promote(_co);
			} else {
				if(Object.keys(cache.map).length + 1 > size) {
					// "Invariance", thanks Carl!
					const removed = cache.lru.dequeue();
					delete cache.map[removed.value.key];
				}
				const lruCacheNode = new LruCacheNode({ key, value });

				// Add the cache node to the linked list
				cache.lru.enqueue(lruCacheNode);

				// Add a reference to the node to the hash map for quick access, but takes O(n) space
				cache.map[key] = lruCacheNode;
			}
		};

		exports.get = (key) => {
			const _co = cache;
			if(!_co.map.hasOwnProperty(key)) return undefined;

			_co.lru.promote(_co.map[key]);
			return _co.map[key].value.value;
		};

		exports.valueExists = (value) => Object.keys(cache.map)
			.some(key => cache.map[key].value.value === value);

		exports.keys = () => Object.keys(cache.map);

		exports.values = () => {
			const map = cache.map;
			return Object.keys(map)
				.map(key => map[key].value.value);
		};

		exports.export = () => cache.lru.export();

		exports.purge = () => {
			rebuildCache();
		};

		return exports;
	}

	return { Cache: LruCache };
})();