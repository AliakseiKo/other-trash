var base64 = (() => {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const PADDING = '=';

  const CHAR_INDEX = {};
  for (let i = 0; i < CHARS.length; ++i) {
    CHAR_INDEX[CHARS[i]] = i;
  }

  function base64Encode(/* Uint8Array */ buffer) {
    const bufferLength = buffer.byteLength;
    if (bufferLength === 0) return '';
    const extra = bufferLength * 2 % 3;
    const stringLength = (bufferLength + extra) * 8 / 6;
    const string = new Array(stringLength);

    let
      bufferIndex = 0,
      stringIndex = 0,
      preparedByte = 0x00,
      bufferByte,
      shiftResult,
      shiftedBits,
      offset = 0;

    while (bufferIndex < bufferLength) {
      if (offset === 6) {
        string[stringIndex++] = CHARS[preparedByte];
        offset = 0;
        preparedByte = 0x00;
      }

      offset += 2;
      bufferByte = buffer[bufferIndex++];

      shiftResult = bufferByte >> offset;
      shiftedBits = shiftResult << offset ^ bufferByte;

      string[stringIndex++] = CHARS[preparedByte ^ shiftResult];

      preparedByte = shiftedBits << 6 - offset;
    }

    string[stringIndex++] = CHARS[preparedByte];

    while (stringIndex < stringLength) {
      string[stringIndex++] = PADDING;
    }

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

const command = process.argv[2];
const string = process.argv.slice(3).join(' ');

switch (command) {
  case 'encode':
    console.log('my  ', base64.encode(new TextEncoder().encode(string)));
    console.log('node', Buffer.from(string).toString('base64'));
    break;
  case 'decode':
    console.log('my  ', new TextDecoder().decode(base64.decode(string)));
    console.log('node', Buffer.from(string, 'base64').toString('utf-8'));
    break;
  default:
    console.error('Unknown command. Available commands: encode, decode');
    break;
}

// const inBuff = new TextEncoder().encode('Hello World').buffer;
// const string = base64.encode(inBuff);
// const outBuff = base64.decode(string);

// console.log(string);
// console.log(inBuff);
// console.log(outBuff);
