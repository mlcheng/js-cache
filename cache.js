/***********************************************

  "cache.js"

  Created by Michael Cheng on 07/24/2016 09:44
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

var iqwerty = iqwerty || {};

iqwerty.cache = (function() {

	function LruCacheNode(value) {
		this.prev = null;
		this.next = null;
		this.value = value;
	}

	function LinkedList() {
		this.head = null;
		this.tail = null;
		let list = this;

		return {
			enqueue(lruCacheNode) {
				if(list.head === null) {
					list.head = lruCacheNode;
					list.tail = lruCacheNode;
				} else {
					lruCacheNode.prev = list.tail;
					list.tail.next = lruCacheNode;
					list.tail = lruCacheNode;
				}
			},
			dequeue() {
				if(list.head) {
					let out = list.head;

					list.head.next.prev = null;
					list.head = list.head.next;
					out.next = null;
					return out;
				}
				return null;
			},
			promote(lruCacheNode) {
				if(list.tail === lruCacheNode) return; // Already promoted

				if(list.head === lruCacheNode) {
					list.head.next.prev = null;
					list.head = list.head.next;
				} else {
					lruCacheNode.prev.next = lruCacheNode.next;
					lruCacheNode.next.prev = lruCacheNode.prev;
				}
				lruCacheNode.prev = list.tail;
				lruCacheNode.next = null;
				list.tail.next = lruCacheNode;
				list.tail = lruCacheNode;
			},
			export() {
				let iterator = list.head, out = [];
				while(iterator) {
					out.push(iterator.value);
					iterator = iterator.next;
				}

				return out;
			}
		};
	}

	function Builder(identifier, size) {
		return LruCache(identifier, size);
	}

	Builder.prototype.__cache__ = {};

	function LruCache(identifier, size) {
		let exports = {};
		let cache = Builder.prototype.__cache__;

		exports.add = function(key, value) {			
			// Create the cache if it doesn't exist yet
			if(!cache.hasOwnProperty(identifier)) {
				cache[identifier] = {
					lru: new LinkedList(),
					map: {}
				};
			}

			if(cache[identifier].map.hasOwnProperty(key)) {
				// Already exists; simply update the value in the lruCacheNode
				let _co = cache[identifier].map[key];
				_co.value.value = value;
				cache[identifier].lru.promote(_co);
			} else {
				if(Object.keys(cache[identifier].map).length + 1 > size) {
					// "Invariance", thanks Carl!
					let removed = cache[identifier].lru.dequeue();
					delete cache[identifier].map[removed.value.key];
				}
				let lruCacheNode = new LruCacheNode({ key, value });

				// Add the cache node to the linked list
				cache[identifier].lru.enqueue(lruCacheNode);

				// Add a reference to the node to the hash map for quick access, but takes O(n) space
				cache[identifier].map[key] = lruCacheNode;
			}
		};

		exports.get = function(key) {
			let _co = cache[identifier];
			if(!_co.map.hasOwnProperty(key)) return undefined;

			_co.lru.promote(_co.map[key]);
			return _co.map[key].value.value;
		};

		exports.valueExists = value => Object.keys(cache[identifier].map)
			.some(key => cache[identifier].map[key].value.value === value);

		exports.keys = function() {
			if(cache.hasOwnProperty(identifier)) {
				return Object.keys(cache[identifier].map);
			} else {
				return undefined;
			}
		};

		exports.values = function() {
			if(cache.hasOwnProperty(identifier)) {
				let map = cache[identifier].map;
				return Object.keys(map)
					.map(key => map[key].value.value);
			} else {
				return undefined;
			}
		};

		exports.export = function() {
			if(cache.hasOwnProperty(identifier)) {
				return cache[identifier].lru.export();
			} else {
				return undefined;
			}
		};

		exports.purge = function() {
			delete cache[identifier];
		};

		return exports;
	}

	return {
		Builder
	};
})();

if(typeof module !== 'undefined') {
	/* global module */
	module.exports = iqwerty.cache;
}