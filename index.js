var fs = require( "fs" );
var path = require('path');
var mkdirp = require('mkdirp');


var SpecAsHTMLReporter = function( baseReporterDecorator, formatError, config ) {

	baseReporterDecorator( this );

	var reporterConfig = config.specAsHtmlReporter || {};
	var self = this;
	var summaryOfTestRun = '';

	self.suites = {};

	var Suite = function( description, preMarkup, postMarkup ) {

		var items = [];

		var suite = {

			add: function( result, success ) {

				if ( result.render ) {
					items.push( result )
				} else {
					items.push( makeItem ( result, success ) )
				}
			},

			render: function( margin ) {

				margin = margin || "";
				var indent = margin + "  ";

				preMarkup = preMarkup || [
					margin + '<li class="suite">' + description,
					indent + '<ul>'
				];

				postMarkup = postMarkup || [
					indent + '</ul>',
					margin + '</li>'
				];

				var output = preMarkup;


				items.forEach( function( item ) {

					if ( item.render ) {

						output = output.concat( item.render( indent + "  " ) );

					} else {

						output.push( indent + '  ' + item );

					}
				});

				output = output.concat( postMarkup );

				return output;
			}
		};

		return suite;
	};

	var baseSuite = Suite( 'base', [ '<h1>Spec</h1><div class="suite">', '<ul>' ], [ '</ul>', '</div>' ] );

	var checkSuites = function( suiteLabels ) {

		var suites = self.suites;

		if ( suiteLabels.forEach ) {

			var parentSuite = baseSuite;
			var labelHierarchy = "";

			suiteLabels.forEach( function( label ) {

				labelHierarchy += ":" + label;

				var suite;

				if( suites.hasOwnProperty( labelHierarchy ) ) {

					suite = suites[ labelHierarchy ];

				} else {

					suite = Suite( label );
					suites[ labelHierarchy ] = suite;
					parentSuite.add( suite );

				}

				parentSuite = suite;

			});

			return suites[ labelHierarchy ]

		}

	};

	var makeItem = function( results, success ) {

		var passed = success? "success": "failure";

		var description = results && results.description;

		if ( description ) {
			return '<li class="' + passed + '">' + description + '</li>';
		} else {
			return '';
		}

	};

	var add = function( result, status) {
	//console.log(result)
		if ( result && result.suite ) {
			var activeSuite = checkSuites( result.suite )
			activeSuite.add( result, status );
		}

	}

	this.getStyles = function () {

		var output = [
			'.karma-spec-as-html {',
			'  font-family: Helvetica, Arial, sans-serif;',
			'  font-size: .9em;',
			'  line-height: 1.5;',
			'}',
			'.karma-spec-as-html .suite ul {list-style-type: none; margin-top: .4em }',
			'.karma-spec-as-html .suite li { margin-bottom: .8em; }',
			'.karma-spec-as-html .suite { margin-top: 1em }',
			'.karma-spec-as-html .success {color: green }',
			'.karma-spec-as-html .success:before { content: "✓ " }',
			'.karma-spec-as-html .failure {color: red }',
			'.karma-spec-as-html .failure:before { content: "✗ " }'
		]
		return output.join("\n");
	}

	this.getResultsMarkup = function () {
		return baseSuite.render().join('\n') + '\n'
	}

	this.getSummaryOfTestRun = function () {
		return summaryOfTestRun;
	}

	this.render = function () {

		var markup = [
			'<!DOCTYPE html>',
			'<html lang="en">',
			'<head>',
			'  <meta charset="utf-8">',
			'  <meta name="viewport" content="width=device-width">',
			'  <title>Spec for</title>',
			'  <style>',
			self.getStyles(),
			'  </style>',
			'</head>',
			'<body>',
			'  <div class="karma-spec-as-html">',
			self.getResultsMarkup(),
			self.getSummaryOfTestRun(),
			'  </div>',
			'</body>',
			'</html>'
		]

		return markup.join('\n') + '\n';
	}

	this.specSuccess = function( browser, results ) {
		add( results, true );
	};

	this.specFailure = function( browser, results ) {
		add( results );
	};

	this.onBrowserComplete = function (browser) {
		summaryOfTestRun = '<p class="summaryOfTestRun">' + this.renderBrowser(browser) + '</p>\n'
	}

    this.onRunComplete = function( ) {

		var fullPath = path.resolve(
			reporterConfig.dir || config.basePath || ".",
			reporterConfig.outputFile || "spec.html"
		);

		mkdirp.sync( path.dirname( fullPath ) );

		fs.writeFile(
			fullPath,
			self.render(),
			function( err ) {
				if (err) {
					console.log(err);
				}
			}
		);

	};


};

SpecAsHTMLReporter.$inject = [ 'baseReporterDecorator', 'formatError', 'config' ]

module.exports = {
  'reporter:spec-as-html': [ 'type', SpecAsHTMLReporter ]
};
