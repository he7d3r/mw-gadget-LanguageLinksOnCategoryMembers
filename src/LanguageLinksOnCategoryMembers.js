/**
 * Adds language links to category member links
 * @author: Helder (https://github.com/he7d3r)
 * @license: CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0/>
 */
( function ( mw, $ ) {
	'use strict';

	var langCode = 'pt',
		init;

	function addLanguageLink( $existing, langCode, title ) {
		$existing
			.before( '[' )
			.before(
				$( '<a></a>' ).attr( {
					title: title,
					href: '//' + langCode + '.wikipedia.org/wiki/' +
						mw.util.rawurlencode( title ),
					lang: langCode,
					hreflang: langCode
				} ).text( langCode )
			)
			.before( '] ' );
	}

	function getArticlesLinksFromPage( data ) {
		var map = {};
		if ( !data.query ) {
			return;
		}
		$.each( data.query.pages, function ( i ) {
			if ( data.query.pages[ i ].langlinks ) {
				map[ data.query.pages[ i ].title ] = data.query.pages[ i ].langlinks[0]['*'];
			}
		} );
		$( '#mw-content-text' ).find( 'li > a' ).each(function () {
			var $this = $(this),
				title = $this.text();
			if ( map[ title ] ) {
				addLanguageLink( $this, langCode, map[ title ] );
			}
		});
	}

	function getCategoryMembers() {
		var api = new mw.Api();
		api.get( {
			prop: 'langlinks',
			lllang: langCode,
			generator: 'categorymembers',
			gcmtitle: mw.config.get( 'wgPageName' ),
			gcmlimit: 500
		} )
		.done( getArticlesLinksFromPage );
	}
	function getWhatLinksHere() {
		var api = new mw.Api();
		api.get( {
			action: 'query',
			format: 'json',
			prop: 'langlinks',
			titles: mw.config.get( 'wgRelevantPageName' ),
			generator: 'linkshere',
			lllang: langCode,
			glhlimit: 500
		} )
		.done( getArticlesLinksFromPage );
	}

	if (
		mw.config.get( 'wgAction' ) === 'view' &&
		mw.config.get( 'wgContentLanguage' ) !== langCode
	) {
		if ( mw.config.get( 'wgNamespaceNumber' ) === 14 ) {
			init = getCategoryMembers;
		} else if ( mw.config.get( 'wgCanonicalSpecialPageName' ) === 'Whatlinkshere' ) {
			init = getWhatLinksHere;
		}
		$.when(
			mw.loader.using( [ 'mediawiki.api', 'mediawiki.util' ] ),
			$.ready
		)
		.then( init );
	}

}( mediaWiki, jQuery ) );
