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
     CatchClause(node) {
         if (!node.param) {
             context.report({
                 node,
                 message: 'Catch clause should have an error parameter',
             });
             return;
         }

         if (node.param.type === "Identifier") {
             const errorArgName = node.param.name;
             if (node.body.body.some(expression => {
                 return expression.type === "ExpressionStatement" && expression.expression.type === "CallExpression" &&
                     expression.expression.arguments.some(argument => argument.type === "Identifier" && argument.name === errorArgName)
             })) {
                return;
             }

             context.report({
                 node,
                 message: 'Catch clause should use the error parameter in the catch block',
             });
         }
      }
    };
  },
};

export default rule;
