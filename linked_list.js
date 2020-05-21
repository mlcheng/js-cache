/***********************************************

  "linked_list.js"

  Created by Michael Cheng on 07/24/2016 09:44
            http://michaelcheng.us/
            michael@michaelcheng.us
            --All Rights Reserved--

***********************************************/

'use strict';

export function LinkedList() {
	this.head = null;
	this.tail = null;
	const list = this;

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
				const out = list.head;

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
		},
	};
}