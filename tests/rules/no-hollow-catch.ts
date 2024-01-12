
import { RuleTester } from "eslint";
import rule from "../../src/rules/no-hollow-catch";

const tester = new RuleTester({
  parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module'
  }
});

tester.run("no-hollow-catch", rule, {
  valid: [],
  invalid: [],
});
