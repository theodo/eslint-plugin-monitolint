
import { RuleTester } from "eslint";
import rule from "../../src/rules/no-hollow-catch";

const tester = new RuleTester({
  parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module'
  }
});

tester.run("no-hollow-catch", rule, {
  // catch de promise
  // rethrow
  valid: [{
    code: "try { } catch (e) { throw e; }"
  }, {
    code: "new Promise((resolve, reject) => { resolve(1) })"
  },],
  invalid: [{
    code: "new Promise((resolve, reject) => { resolve(1) }).catch();",
    errors: [{
      message: "Catch clause should have an error parameter",
    }]
  }, {
    code: "try { } catch (e) { }",
    errors: [{
      message: "Catch clause should use the error parameter in the catch block",
    }]
}],
});
