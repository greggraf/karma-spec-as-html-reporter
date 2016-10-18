
var SpecAsHTMLReporter = function( baseReporterDecorator, formatError, config ) {

	baseReporterDecorator(this);

	this.specSuccess = function(a, b) {
		if ( b && b.description ) {
			return '<li class="success">' + b.description + '</li>';
		}
	};

	this.specFailure = function(a, b) {
		if ( b && b.description ) {
			return '<li class="failure">' + b.description + '</li>';
		}
	};

	this.specSkipped = function(a, b) {
		if ( b && b.description ) {
			return '<li class="skipped">' + b.description + '</li>';
		}
	};
};

SpecAsHTMLReporter.$inject = ['baseReporterDecorator', 'formatError', 'config']

module.exports = {
  'reporter:spec-as-html': ['type', SpecAsHTMLReporter]
};
