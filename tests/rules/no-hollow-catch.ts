
import { RuleTester } from "eslint";
import rule from "../../src/rules/no-hollow-catch";

const tester = new RuleTester({
  parserOptions: {
      ecmaVersion: 6,
      sourceType: 'module'
  }
});

tester.run("no-hollow-catch", rule, {
  valid: [{
    code: "try { } catch (e) { throw e; }"
  }, {
    code: "new Promise((resolve, reject) => { resolve(1) })"
  },{
    code: "of(false).pipe(catchError(() => {return of()}))"
  },{
    code: "of(false).subscribe({ next: undefined, error: err => console.error(err) });"
  }],
  invalid: [{
    code: "new Promise((resolve, reject) => { resolve(1) }).catch();",
    errors: [{
      message: "Promise catch calls should pass a callback handling the error",
    }]
  }, {
    code: "try { } catch (e) { }",
    errors: [{
      message: "Catch clause should use the error parameter in the catch block",
    }]
},{
    code: "of(false).pipe(catchError(err => {return of()}))",
    errors: [{
      message: "Catch clause should use the error parameter in the catch block",
    }]
  },{
    code: "of(false).subscribe({ next: undefined, error: err => console.error('truc') });",
    errors: [{
      message: "Catch clause should use the error parameter in the catch block",
    }]
  }
  ],
});
