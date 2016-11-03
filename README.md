# Karma Spec As HTML Reporter

A Karma reporter that generates an HTML file displaying the test results in a format similar to the Karma Spec Reporter.


## Installation

    npm install karma-spec-as-html-reporter --save-dev

Or, manually add it to your `package.json` file.

     "devDependencies": {
         "karma": "^0.13.1",
         "karma-jasmine": "^0.3.5",
         "karma-spec-as-html-reporter": "^0.0.1"
     }

Then add ``'spec-as-html'`` to reporters in `karma.conf.js`, e.g.

    reporters: ['spec-as-html']


## Configuration

Use the `specAsHtmlReporter` configuration in your `karma.conf.js` file

    specAsHtmlReporter : {
        dir : "dist",              // path to write the file, defaults to `./`
        outputFile: "spec.html"    // name of the file, defaults to `spec.html`
    }

## Example

<div style="border: 1px solid #eee; padding: .5em;">
<style>
.karma-spec-as-html {
  font-family: Helvetica, Arial, sans-serif;
  font-size: .9em;
  line-height: 1.5;
}
.karma-spec-as-html .suite ul {list-style-type: none; margin-top: .4em }
.karma-spec-as-html .suite li { margin-bottom: .8em; }
.karma-spec-as-html .suite { margin-top: 1em }
.karma-spec-as-html .success {color: green }
.karma-spec-as-html .success:before { content: "✓ " }
.karma-spec-as-html .failure {color: red }
.karma-spec-as-html .failure:before { content: "✗ " }
</style>

 <div class="karma-spec-as-html">
<h1>Spec</h1><div class="suite">
<ul>
    <li class="suite">First Level Describe
      <ul>
        <li class="success">should be a successful assertion one</li>
        <li class="failure">should be a failed assertion one</li>
        <li class="success">should be a successful assertion two</li>
        <li class="suite">Second Level Describe
          <ul>
            <li class="success">should be a successful assertion one</li>
            <li class="success">should be a successful assertion two</li>
          </ul>
        </li>
      </ul>
    </li>
</ul>
</div>

</div>
</div>

## To Do

- expose ways to inject CSS to change format of the results
- see if it can be rewritten as an adapter like they do for real
  - take advantage of util.format() ?
  - express markup using the constants (ie: `this.SPEC_FAILURE = '%s %s FAILED' + '\n'` )
- loop through all browsers instead of assuming there is just one





