((global, factory) => {
  if (typeof module === 'object' && typeof exports === 'object')
    module.exports = factory();
  else if (typeof define === 'function' && define.amd)
    define(factory);
  else
    global['deepClone'] = factory();
})(globalThis || global || window || self || this, () => {
  function deepClone(value) {
    if (value === null || typeof value !== 'object') return value;

    const prototype = Object.getPrototypeOf(value);

    switch (prototype) {
      case Array.prototype: return cloneArray(value, deepClone);
      case Map.prototype: return cloneMap(value, deepClone);
      case Set.prototype: return cloneSet(value, deepClone);
      case Date.prototype: return cloneDate(value);
      default: return cloneObject(value, deepClone);
    }
  }

  function cloneArray(array, deepClone) {
    const newArray = new Array(array.length);

    for (let i = 0; i < arr.length; ++i) {
      newArray[i] = deepClone(array[i]);
    }

    return newArray;
  }

  function cloneMap(map, deepClone) {
    const newMap = new Map();

    for (const [ key, value ] of map) {
      newMap.set(deepClone(key), deepClone(value));
    }

    return newMap;
  }

  function cloneSet(set, deepClone) {
    const newSet = new Set();

    for (const value of set) {
      newSet.add(deepClone(value));
    }

    return newSet;
  }

  function cloneDate(date) {
    return new Date(date);
  }

  function cloneObject(object, deepClone) {
    const descriptors = Object.getOwnPropertyDescriptors(object);

    const stringKeys = Object.getOwnPropertyNames(descriptors);
    const symbolKeys = Object.getOwnPropertySymbols(descriptors);

    const keys = stringKeys.concat(symbolKeys);

    for (const key of keys) {
      const descriptor = descriptors[key];

      if (!('value' in descriptor)) continue;

      descriptor.value = deepClone(descriptor.value);
    }

    const prototype = Object.getPrototypeOf(object);

    return Object.create(prototype, descriptors);
  }

  return deepClone;
});
