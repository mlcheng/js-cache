# js-cache

This is a simple and useful implementation of LRU cache, which can be used to store many things in your web application. LRU stands for "Least Recently Used", which will cache things as long as there is enough space. If there isn't enough space, the least recently used object will be removed from the cache.

A demo will be available on my [playground](https://www.michaelcheng.us/lib-js/cache/) soon.

## Usage
First off, a cache needs to be specified with two parameters: an identifier (preferably named after its intended use), and a cache size.

```javascript
let cache = iqwerty.cache.Builder('http', 5);
```

If you're comfortable using `Symbols`, it is recommended to use `Symbol` instead of a string

```javascript
let cache = iqwerty.cache.Builder(Symbol('http'), 5);
```

The API is simple, with only 7 exposed methods.

### `.add(key, value)`
Add a key/value pair to the cache. There are two things to take note of:

1. If the key already exists, the value will be updated. That cache object will then be **promoted as the most recently used** object.
2. If the cache size is greater than the specified `size` (5 in this case), the **least recently used object will be purged** from the cache.

### `.get(key)`
Get a cache value by specifying the key. Returns `undefined` if the key doesn't exist. The cache object will then be promoted as the most recently used.

### `.valueExists(value)`
Specifies whether or not a value exists inside the cache.

### `.keys()`
Returns an array of all keys in the cache. If the cache is empty, `undefined` is returned.

### `.values()`
Returns an array of all values in the cache. If the cache is empty, `undefined` is returned.

### `.export()`
Returns an array containing all key/value pairs in the cache. If the cache is empty, `undefined` is returned.

### `.purge()`
Clears the cache.

## An example
Let's first build a cache.

```javascript
let cache = iqwerty.cache.Builder('test', 2);
```

This cache can only fit 2 objects inside. Let's fill it.

```javascript
cache.add('key1', 'value1');
cache.add('key2', 'value2');
cache.keys(); // ['key1', 'key2']
```

At this point, the cache is full. Let's try to get another object to the cache.

```javascript
cache.add('key3', 'value3');
cache.keys(); // ['key2', 'key3']
```

The `key` cache was removed because it was the least recently used. Let's try to get `key2`

```javascript
cache.get('key2');
cache.keys(); // ['key3', 'key2']
```

`key2` was promoted to the most recently used because, well, it _was_ most recently used. `key3` is next in line to be purged when needed.

## Real-world usage
When performing any expensive task that produces the same result each time, it is a good idea to use a cache to store the results. For example, let's say you have a web application that needs to get points of interest for a certain location using an API. Your web app probably sends API requests similar to

```javascript
let location = 'Taipei, Taiwan';

$http('/api/poi')
	.success(callback)
	.get({ location });
```

Since points of interest probably will not change while the user is using your app, you can probably cache the result using iQwerty cache.

```javascript
let cache = iqwerty.cache.Builder(Symbol('poi'), 10);
let location = 'Taipei, Taiwan';

if(cache.get(location)) {
	callback(cache.get(location));
} else {
	$http('/api/poi')
		.success(response => {
			cache.add(location, response);
			callback(response);
		})
		.get({ location });
}
```
