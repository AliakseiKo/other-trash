((global, factory) => {
  if (typeof module === 'object' && typeof exports === 'object')
    module.exports = factory();
  else if (typeof define === 'function' && define.amd)
    define(factory);
  else
    global['deepClone'] = factory();
})(globalThis || global || window || self || this, () => {
  function deepClone(value) {
    const clonned = new Map();

    return (function _deepClone(value) {
      if (value === null || typeof value !== 'object') return value;

      if (clonned.has(value)) return clonned.get(value);

      const prototype = Object.getPrototypeOf(value);

      switch (prototype) {
        case Array.prototype: return cloneArray(_deepClone, clonned, value);
        case Map.prototype: return cloneMap(_deepClone, clonned, value);
        case Set.prototype: return cloneSet(_deepClone, clonned, value);
        case Date.prototype: return cloneDate(_deepClone, clonned, value);
        default: return cloneObject(_deepClone, clonned, value);
      }
    })(value);
  }

  function cloneArray(deepClone, clonned, array) {
    const newArray = new Array(array.length);

    clonned.set(array, newArray);

    for (let i = 0; i < newArray.length; ++i) {
      newArray[i] = deepClone(array[i]);
    }

    return newArray;
  }

  function cloneMap(deepClone, clonned, map) {
    const newMap = new Map();

    clonned.set(map, newMap);

    for (const [ key, value ] of map) {
      newMap.set(deepClone(key), deepClone(value));
    }

    return newMap;
  }

  function cloneSet(deepClone, clonned, set) {
    const newSet = new Set();

    clonned.set(set, newSet);

    for (const value of set) {
      newSet.add(deepClone(value));
    }

    return newSet;
  }

  function cloneDate(deepClone, clonned, date) {
    const newDate = new Date(date);

    clonned.set(date, newDate);

    return newDate;
  }

  function cloneObject(deepClone, clonned, object) {
    const newObject = Object.create(null);

    clonned.set(object, newObject);

    const descriptors = Object.getOwnPropertyDescriptors(object);

    const stringKeys = Object.getOwnPropertyNames(descriptors);
    const symbolKeys = Object.getOwnPropertySymbols(descriptors);

    const keys = stringKeys.concat(symbolKeys);

    for (const key of keys) {
      const descriptor = descriptors[key];

      if (!('value' in descriptor)) continue;

      descriptor.value = deepClone(descriptor.value);
    }

    Object.defineProperties(newObject, descriptors);

    const prototype = Object.getPrototypeOf(object);

    Object.setPrototypeOf(newObject, prototype);

    return newObject;
  }

  return deepClone;
});
