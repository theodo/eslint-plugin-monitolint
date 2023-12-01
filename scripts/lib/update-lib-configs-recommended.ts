import fs from 'fs';
import path from 'path';
import { ESLint } from 'eslint';
import { rules } from './rules';

const filePath = path.resolve(__dirname, '../../src/configs/recommended.ts');
const rawContent = `/* DON'T EDIT THIS FILE. This is generated by 'scripts/lib/update-lib-configs-recommended.ts' */

export const recommended = {
  rules: {
    ${rules
      .filter((rule) => rule.recommended)
      .map((rule) => `"${rule.id}": "error"`)
      .join(',\n    ')}
  }
}
`;

(async () => {
  const lint = new ESLint({ fix: true });
  const lintResults = await lint.lintText(rawContent);
  const content = lintResults[0].output || rawContent;
  
  fs.writeFileSync(filePath, content);    
})();
