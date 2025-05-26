/**
 * Joins an array of pinyin strings with proper spacing, keeping punctuation close to words
 * @param pinyinArray Array of pinyin strings
 * @returns Formatted string with natural spacing
 */
export function formatPinyinText(pinyinArray: string[]): string {
    if (!pinyinArray || pinyinArray.length === 0) return '';
  
    const PUNCT = new Set([
      ',', '.', '!', '?', ':', ';',
      '，', '。', '！', '？', '：', '；',
    ]);
  
    return pinyinArray.reduce((acc, token, idx) => {
      if (idx === 0) return token;
      if (PUNCT.has(token)) { return acc + token }
  
      return acc + ' ' + token;
    }, '');
  }