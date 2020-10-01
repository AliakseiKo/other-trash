function f({ chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', from = '' } = {}) {
  const charLength = chars.length;

  const s = [];
  const p = [];
  let charIndex = 0;
  let rank = 0;
  let prevRank;
  let prevRankCharIndex;

  for (let i = 0; i < from.length; ++i) {
    s.push(from[i]);
    p.push(chars.indexOf(from[i]));
  }

  rank = p.length - 1;
  charIndex = p[rank] + 1;

  while (true) {
    if (charIndex < charLength) {
      p[rank] = charIndex;
      s[rank] = chars[charIndex++];
    } else {
      p[rank] = charIndex = 0;
      s[rank] = chars[charIndex++];

      prevRank = rank - 1;
      while (true) {
        if (prevRank < 0) {
          ++s.length;
          ++p.length;
          ++rank;
          p[rank] = charIndex = 0;
          s[rank] = chars[charIndex++];
          break;
        }

        prevRankCharIndex = ++p[prevRank];

        if (prevRankCharIndex < charLength) {
          s[prevRank] = chars[prevRankCharIndex];
          break;
        } else {
          p[prevRank] = 0;
          s[prevRank--] = chars[0];
        }
      }
    }

    process.stdout.write(s.join('') + '\n');
  }
}

f();