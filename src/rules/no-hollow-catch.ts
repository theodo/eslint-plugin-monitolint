import { Rule } from 'eslint';
import { BlockStatement, Expression, SpreadElement } from 'estree';

const rule: Rule.RuleModule = {
  meta: {
    docs: {
      description: 'Catch clauses should use the error to avoid it being lost',
      recommended: true,
    },
    type: 'problem',
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    return {
      // standard try catch block
      CatchClause(catchClause) {
        if (!catchClause.param) {
          context.report({
            node: catchClause,
            message: 'Catch clause should have an error parameter',
          });
          return;
        }

        if (catchClause.param.type === 'Identifier') {
          const errorArgName = catchClause.param.name;
          if (
            isErrorUsedInACallExpression(catchClause.body, errorArgName) ||
            isErrorRethrown(catchClause.body, errorArgName)
          ) {
            return;
          }

          context.report({
            node: catchClause,
            message:
              'Catch clause should use the error parameter in the catch block',
          });
        }
      },

      // Promise catch block
      CallExpression(callExpression) {
        const callee = callExpression.callee;
        if (callee.type !== 'MemberExpression') {
          return;
        }

        if (callee.property.type !== 'Identifier' || callee.property.name !== 'catch') {
          return;
        }

        if (callExpression.arguments.length === 0) {
          context.report({
            node: callExpression,
            message: 'Promise catch calls should pass a callback handling the error',
          });
          return;
        }

        const errorArg = callExpression.arguments[0];

        if (
          errorArg.type !== 'ArrowFunctionExpression' &&
          errorArg.type !== 'FunctionExpression'
        ) {
          return;
        }

        if (errorArg.params.length === 0) {
          context.report({
            node: callExpression,
            message: 'Catch clause should have an error parameter',
          });
          return;
        }

        if (errorArg.params[0].type !== 'Identifier') {
          return;
        }

        const errorArgName = errorArg.params[0].name;

        if (errorArg.body.type !== 'BlockStatement') {
          return;
        }

        if (isErrorUsedInACallExpression(errorArg.body, errorArgName)) {
          return;
        }

        context.report({
          node: callExpression,
          message:
            'Catch clause should use the error parameter in the catch block',
        });
      },
    };
  },
};

function isErrorUsedInACallExpression(node: BlockStatement, errorArgName: string) {
  return node.body.some((expression) => {
    return (
      expression.type === 'ExpressionStatement' &&
      expression.expression.type === 'CallExpression' &&
      expression.expression.arguments.some(
        (argument) => isIdentifierUsedInExpression(argument, errorArgName)
      )
    );
  });
}

function isIdentifierUsedInExpression(argument: SpreadElement | Expression, errorArgName: string): unknown {
  // ex: console.log('error', error);
  if (argument.type === 'Identifier') {
    return argument.name === errorArgName;
  }

  // ex: console.log('error' + error);
  if (argument.type === 'BinaryExpression') {
    return isIdentifierUsedInExpression(argument.left, errorArgName) ||
      isIdentifierUsedInExpression(argument.right, errorArgName);
  }

  // ex: console.log(error.message);
  if (argument.type === 'MemberExpression') {
    return argument.object.type === 'Identifier' && argument.object.name === errorArgName;
  }

  return false;
}

function isErrorRethrown(node: BlockStatement, errorArgName: string) {
  return node.body.some(
    (expression) =>
      expression.type === 'ThrowStatement' &&
      expression.argument.type === 'Identifier' &&
      expression.argument.name === errorArgName
  );
}

export default rule;
