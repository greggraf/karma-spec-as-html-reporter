/*
baseReporterDecorator { adapters: [ [Function: bound ] ],
  onRunStart: [Function],
  onBrowserStart: [Function],
  renderBrowser: [Function: bound ],
  write: [Function],
  writeCommonMsg: [Function],
  onBrowserError: [Function],
  onBrowserLog: [Function],
  on
  Complete: [Function],
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

var fs = require( "fs" );

var SpecAsHTMLReporter = require('../index.js')['reporter:spec-as-html'];

describe( "karma-spec-as-html-reporter", function() {

	var reporter;

	var baseReporterDecorator = function( instance ) {};

	beforeEach( function() {

		reporter = new SpecAsHTMLReporter[1]( baseReporterDecorator, {}, { basePath: "/project/"} );
		spyOn(fs, "writeFile")

	} );


	it( "should not add a suite more than once", function() {

		var sampleResults = [
			{
				'description': "should do the first thing",
				'suite': [ "suite1" ]
			},
			{
				'description': "should do the second thing",
				'suite': [ "suite1", "suite2" ]
			},
			{
				'description': "should do the third thing",
				'suite': [ "suite1", "suite2" ]
			},
			{
				'description': "should do the fourth thing",
				'suite': [ "suite1", "suite2", "suite3" ]
			},
			{
				'description': "should do the fifth thing",
				'suite': [ "suite1" ]
			}
		];

		sampleResults.forEach( function( suite ) {
			reporter.specSuccess( {}, suite );
		} );

		expect( Object.keys( reporter.suites ).length ).toBe( 3 );

	} );

	it( "should properly render a suite with a single successful result ", function() {

		reporter.specSuccess(
			{},
			{
				'description': "should do the first thing",
				'suite': [ "suite1" ]
			}
		);

		var expectedResult = [
			'<li class="suite">base',
			'  <ul>',
			'    <li class="suite">suite1',
			'      <ul>',
			'        <li class="success">should do the first thing</li>',
			'      </ul>',
			'    </li>',
			'  </ul>',
			'</li>',
			''
		].join( '\n' );

		var result = reporter.getResultsMarkup()
		expect( result ).toBe( expectedResult );
		expect( result ).toMatch( /<li class="success">/ );

	} );


	it( "should not render a suite with a single successful result lacking description ", function() {

		reporter.specSuccess(
			{},
			{
				'suite': [ "suite1" ]
			}
		);

		var expectedResult = [
			'<li class="suite">base',
			'  <ul>',
			'    <li class="suite">suite1',
			'      <ul>',
			'        ',
			'      </ul>',
			'    </li>',
			'  </ul>',
			'</li>',
			''
		].join( '\n' );

		var result = reporter.getResultsMarkup()
		expect( result ).toBe( expectedResult );

	} );

	it( "should properly render a suite with a single failure result ", function() {

		reporter.specFailure( {},
			{
				'description': "should do the first thing",
				'suite': [ "suite1" ]
			}
		);

		var expectedResult = [
			'<li class="suite">base',
			'  <ul>',
			'    <li class="suite">suite1',
			'      <ul>',
			'        <li class="failure">should do the first thing</li>',
			'      </ul>',
			'    </li>',
			'  </ul>',
			'</li>',
			''
		].join( '\n' );

		var result = reporter.getResultsMarkup()
		expect( result ).toBe( expectedResult );
		expect( result ).toMatch( /<li class="failure">/ );

	} );

	it( "should properly render two suites", function() {

		reporter.specSuccess( {},
			{
				'description': "should do the first thing",
				'suite': [ "suite1" ]
			}
		);

		reporter.specSuccess( {},
			{
				'description': "should do the second thing",
				'suite': [ "suite2" ]
			}
		);

		var expectedResult = [
			'<li class="suite">base',
			'  <ul>',
			'    <li class="suite">suite1',
			'      <ul>',
			'        <li class="success">should do the first thing</li>',
			'      </ul>',
			'    </li>',
			'    <li class="suite">suite2',
			'      <ul>',
			'        <li class="success">should do the second thing</li>',
			'      </ul>',
			'    </li>',
			'  </ul>',
			'</li>',
			''
		].join( '\n' );

		var result = reporter.getResultsMarkup()
		expect( result ).toBe( expectedResult );

	} );


	it( "should properly render a suite with nested suites ", function() {

		var sampleResults = [
			{
				'description': "should do the first thing",
				'suite': [ "suite1" ]
			},
			{
				'description': "should do the second thing",
				'suite': [ "suite1", "suite2" ]
			},
			{
				'description': "should do the third thing",
				'suite': [ "suite1", "suite2" ]
			},
			{
				'description': "should do the fourth thing",
				'suite': [ "suite1", "suite2", "suite3" ]
			},
			{
				'description': "should do the fifth thing",
				'suite': [ "suite1" ]
			}
		];

		reporter.specSuccess( {}, sampleResults[0] );
		reporter.specFailure( {}, sampleResults[1] );
		reporter.specSuccess( {}, sampleResults[2] );
		reporter.specSuccess( {}, sampleResults[3] );
		reporter.specSuccess( {}, sampleResults[4] );


		var expectedResult = [
			'<li class="suite">base',
			'  <ul>',
			'    <li class="suite">suite1',
			'      <ul>',
			'        <li class="success">should do the first thing</li>',
			'        <li class="suite">suite2',
			'          <ul>',
			'            <li class="failure">should do the second thing</li>',
			'            <li class="success">should do the third thing</li>',
			'            <li class="suite">suite3',
			'              <ul>',
			'                <li class="success">should do the fourth thing</li>',
			'              </ul>',
			'            </li>',
			'          </ul>',
			'        </li>',
			'        <li class="success">should do the fifth thing</li>',
			'      </ul>',
			'    </li>',
			'  </ul>',
			'</li>',
			''
		].join( '\n' );

		var result = reporter.getResultsMarkup()

		expect( result ).toBe( expectedResult );


	} );

	describe( "render of html page", function() {

		it( "should have proper base markup ", function() {

			spyOn( reporter, "getStyles");
			spyOn( reporter, "getResultsMarkup");

			var expectedResult = [
				'<!DOCTYPE html>',
				'<html lang="en">',
				'<head>',
				'  <meta charset="utf-8">',
				'  <meta name="viewport" content="width=device-width">',
				'  <title>Spec for</title>',
				'  <style>',
				'',
				'  </style>',
				'</head>',
				'<body>',
				'',
				'</body>',
				'</html>',
				''
			].join( '\n' );

			var result = reporter.render()
			expect( result ).toBe( expectedResult );

		} );

	} );

	describe( "saving to file", function() {

		it( "should call writeFile ", function() {

			reporter.onRunComplete();
			expect( fs.writeFile ).toHaveBeenCalledWith(  );

		} );

	} );

} );