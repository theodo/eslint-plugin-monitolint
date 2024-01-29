
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
  }, {
    code: "try { } catch (error) { console.log(error.message) }"
  }, {
    code: "try { } catch (error) { console.log(\"\" + error) }"
  }, /*{
    code: "try { } catch (error) { console.log(`error ${error}`) }"
  }*/],
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
}],
});
