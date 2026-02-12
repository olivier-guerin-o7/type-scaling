/**
 * Generate CSS Custom Properties from a type scale.
 * @param {Array} tokens - Array of { token, fontSize, lineHeight }
 * @returns {string}
 */
export function generateCSS(tokens) {
  const lines = [':root {'];

  for (const { token, fontSize, lineHeight } of tokens) {
    const name = token;
    lines.push(`  --type-${name}-size: ${fontSize}px;`);
    lines.push(`  --type-${name}-line-height: ${lineHeight}px;`);
  }

  lines.push('}');
  return lines.join('\n');
}

/**
 * Generate Tailwind CSS config from a type scale.
 * @param {Array} tokens
 * @returns {string}
 */
export function generateTailwind(tokens) {
  const entries = tokens.map(({ token, fontSize, lineHeight }) => {
    return `      '${token}': ['${fontSize}px', { lineHeight: '${lineHeight}px' }],`;
  });

  return [
    'module.exports = {',
    '  theme: {',
    '    fontSize: {',
    ...entries,
    '    }',
    '  }',
    '}',
  ].join('\n');
}

/**
 * Generate JSON Design Tokens from a type scale.
 * @param {Array} tokens
 * @returns {string}
 */
export function generateJSON(tokens) {
  const obj = { typography: {} };

  for (const { token, fontSize, lineHeight } of tokens) {
    obj.typography[token] = { fontSize, lineHeight };
  }

  return JSON.stringify(obj, null, 2);
}
