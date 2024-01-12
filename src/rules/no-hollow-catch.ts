import { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: "Catch clauses should use the error to avoid it being lost",
      recommended: true,
    },
    type: "problem"
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    return {
      TemplateLiteral(node) {
        context.report({
          node,
          message: 'Do not use template literals',

          fix(fixer) {
            return [
              fixer.replaceTextRange(node.range as [number, number], '"'),
            ];
          },
        });
      }
    };
  },
};

export default rule;
