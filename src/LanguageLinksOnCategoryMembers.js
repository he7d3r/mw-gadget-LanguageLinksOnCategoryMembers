/**
 * Adds language links to category member links
 * @author: [[User:Helder.wiki]]
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/LanguageLinksOnCategoryMembers.js]] ([[File:User:Helder.wiki/Tools/LanguageLinksOnCategoryMembers.js]])
 */
/*jslint browser: true, white: true*/
/*global jQuery, mediaWiki */
( function ( mw, $ ) {
'use strict';

var langCode = 'pt';

function addLanguageLinks ( data ){
	var map = {};
	$.each( data.query.pages, function( i ){
		if ( data.query.pages[ i ].langlinks ){
			map[ data.query.pages[ i ].title ] = data.query.pages[ i ].langlinks[0]['*'];
		}
	} );
	$( '#mw-pages' ).find( 'a' ).each(function(){
		var $this = $(this),
			title = $this.text();
		if( map[ title ] ){
			$this
				.before( '[' )
				.before(
					$( '<a></a>' ).attr( {
						title: map[ title ],
						href: '//' + langCode + '.wikipedia.org/wiki/' +
							mw.util.rawurlencode( map[ title ] ),
						lang: langCode,
						hreflang: langCode
					} ).text( langCode )
				)
				.before( '] ' );
		}
	});
}

function getCategoryMembers (){
	var api = new mw.Api();
	api.get( {
		prop: 'langlinks',
		lllang: langCode,
		generator: 'categorymembers',
		gcmtitle: mw.config.get( 'wgPageName' ),
		gcmlimit: 500
	} )
	.done( addLanguageLinks );
}

if( mw.config.get( 'wgNamespaceNumber' ) === 14 && mw.config.get( 'wgAction' ) === 'view' && mw.config.get( 'wgContentLanguage' ) !== langCode ){
	mw.loader.using( [ 'mediawiki.api', 'mediawiki.util' ], function(){
		$( getCategoryMembers );
	} );
}

}( mediaWiki, jQuery ) );