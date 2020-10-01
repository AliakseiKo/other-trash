var base64 = (() => {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const CHAR_INDEX = {};
  for (let i = 0; i < CHARS.length; ++i) {
    CHAR_INDEX[CHARS[i]] = i;
  }

  function base64Encode(buffer) {
    let buff = [];

    new Uint8Array(buffer).forEach((value) => {
      buff.push(value.toString(2).padStart(8, '0'));
    });

    const extra = buff.length * 8 % 3;

    buff.push('00000000'.repeat(extra));
    buff = buff.join('');

    const string = [];
    const offset = 6;
    const length = buff.length / offset - extra;

    for (let i = 0; i < length; ++i) {
      const index = parseInt(buff.slice(i * offset, i * offset + offset), 2);
      string.push(CHARS[index]);
    }

    string.push('='.repeat(extra));

    return string.join('');
  }

  function base64Decode(str) {
    let extra = 0;
    let strLength = str.length;
    const offset = 8;

    const pos = str.indexOf('=');
    if (pos > 0) {
      extra = str.length - pos;
      strLength -= extra;
    }

    let buff = [];

    for (let i = 0; i < strLength; ++i) {
      buff.push(CHAR_INDEX[str[i]].toString(2).padStart(6, '0'));
    }

    buff.push('000000'.repeat(extra));
    buff = buff.join('');

    const length = str.length * 6 / 8 - extra;
    const buffer = new ArrayBuffer(length);
    const view = new Uint8Array(buffer);

    for (let i = 0; i < length; ++i) {
      view[i] = parseInt(buff.slice(i * offset, i * offset + offset), 2);
    }

    return buffer;
  }

  return { encode: base64Encode, decode: base64Decode };
})();

const inBuff = new TextEncoder().encode('Hello World').buffer;
const string = base64.encode(inBuff);
const outBuff = base64.decode(string);

console.log(string);
console.log(inBuff);
console.log(outBuff);
