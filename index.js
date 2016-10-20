var fs = require( "fs" );
var os = require('os')
var path = require('path')



var SpecAsHTMLReporter = function( baseReporterDecorator, formatError, config ) {

	baseReporterDecorator(this);

	var reporterConfig = config.specAsHtmlReporter || {};
	var self = this;

	self.suites = {};

	var Suite = function( description ) {

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

				var output = [
					margin + '<li class="suite">' + description,
					indent + '<ul>'
				];


				items.forEach( function( item ) {

					if ( item.render ) {

						output = output.concat( item.render( indent + "  " ) );

					} else {

						output.push( indent + '  ' + item );

					}
				});

				output = output.concat( [
					indent + '</ul>',
					margin + '</li>'
				] );

				return output;
			}
		};
		return suite;
	};

	var baseSuite = Suite( "base" );

	var checkSuites = function( suiteLabels ) {

		var suites = self.suites;

		if ( suiteLabels.forEach ) {

			var last = suiteLabels.length - 1;
			var parentSuite = baseSuite;

			suiteLabels.forEach( function( label ) {

				var suite = suites[ label ];

				if ( !suite ) {

					suite = Suite( label );
					suites[ label ] = suite;
					parentSuite.add( suite );

				}

				parentSuite = suite;

			});

			return suites[ suiteLabels[ last ] ]

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

		if ( result && result.suite ) {
			var activeSuite = checkSuites( result.suite )
			activeSuite.add( result, status );
		}

	}

	this.getStyles = function () {

		var output = [
			'body {',
			'  font-family: Helvetica, Arial, sans-serif;',
			'  font-size: .9em;',
			'  line-height: 1.5;',
			'}',
			'.suite ul {list-style-type: none; margin-top: .4em }',
			'.suite li { margin-bottom: .8em; }',
			'.suite { margin-top: 1em }',
			'.success {color: green }',
			'.success:before { content: "✓ " }',
			'.failure {color: red }',
			'.failure:before { content: "✗ " }'
		]
		return output.join("\n");
	}

	this.getResultsMarkup = function () {
		return baseSuite.render().join('\n') + '\n'
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
			self.getResultsMarkup(),
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

    this.onRunComplete = function( ) {

		var fullPath = path.resolve(
			reporterConfig.dir || config.basePath || ".",
			reporterConfig.outputFile || "spec.html"
		);

		fs.writeFile(
			fullPath,
			self.render(),
			function( err) {
				console.log(err)
			}
		);

	};


};

SpecAsHTMLReporter.$inject = [ 'baseReporterDecorator', 'formatError', 'config' ]

module.exports = {
  'reporter:spec-as-html': [ 'type', SpecAsHTMLReporter ]
};
