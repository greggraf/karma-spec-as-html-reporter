/*
baseReporterDecorator { adapters: [ [Function: bound ] ],
  onRunStart: [Function],
  onBrowserStart: [Function],
  renderBrowser: [Function: bound ],
  write: [Function],
  writeCommonMsg: [Function],
  onBrowserError: [Function],
  onBrowserLog: [Function],
  onSpecComplete: [Function],
  specSkipped: [Function],
  specSuccess: [Function],
  specFailure: [Function],
  onRunComplete: [Function],
  USE_COLORS: false,
  LOG_SINGLE_BROWSER: '%s: %s\n',
  LOG_MULTI_BROWSER: '%s %s: %s\n',
  SPEC_FAILURE: '%s %s FAILED\n',
  SPEC_SLOW: '%s SLOW %s: %s\n',
  ERROR: '%s ERROR\n',
  FINISHED_ERROR: ' ERROR',
  FINISHED_SUCCESS: ' SUCCESS',
  FINISHED_DISCONNECTED: ' DISCONNECTED',
  X_FAILED: ' (%d FAILED)',
  TOTAL_SUCCESS: 'TOTAL: %d SUCCESS\n',
  TOTAL_FAILED: 'TOTAL: %d FAILED, %d SUCCESS\n' }


		reporter.currentSuite.push('suite name');

		reporter.onRunComplete(['testValue'], {
		  disconnected: false,
		  error: false,
		  failed: 0,
		  success: 10
		});

*/

var SpecAsHTMLReporter = require('../index.js')['reporter:spec-as-html'];

describe( "karma-spec-as-html-reporter", function() {

	var reporter;

	var baseReporterDecorator = function( instance ) {

	};


	beforeEach( function() {

		reporter = new SpecAsHTMLReporter[1]( baseReporterDecorator );

	} );


	it( "specSuccess should render a successful test as a list item with class of 'success'", function() {

		expect( reporter.specSuccess({}, { 'description': 'should do the thing'}) )
			.toBe('<li class="success">should do the thing</li>');

	} );


	it( "specFailure should render a failed test as a list item with class of 'failure'", function() {

		expect( reporter.specFailure({}, { 'description': 'should do the thing'}) )
			.toBe('<li class="failure">should do the thing</li>');

	} );


	it( "specSkipped should render a successful test as a list item with class of 'skipped'", function() {

		expect( reporter.specSkipped({}, { 'description': 'should do the thing'}) )
			.toBe('<li class="skipped">should do the thing</li>');

	} );

} );