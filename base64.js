const base64 = (() => {
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

  function base64Decode(/* string */ string) {
    const paddingPosition = string.indexOf('=');
    const extra = (paddingPosition > 0) ? string.length - paddingPosition : 0;
    const stringLength = string.length - extra;
    const bufferLength = string.length * 6 / 8 - extra;
    const buffer = new Uint8Array(bufferLength);

    let
      bufferIndex = 0,
      stringIndex = 0,
      preparedByte = 0x00,
      charByte,
      shiftResult,
      shiftedBits,
      offset = 0;

    while (stringIndex < stringLength) {
      charByte = CHAR_INDEX[string[stringIndex++]] ?? 0x3f;

      if (offset === 0) {
        offset = 6;
        preparedByte = charByte << 2;
        continue;
      }

      offset -= 2;

      shiftResult = charByte >> offset;
      shiftedBits = shiftResult << offset ^ charByte;

      buffer[bufferIndex++] = preparedByte ^ shiftResult;

      preparedByte = shiftedBits << 8 - offset;
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
