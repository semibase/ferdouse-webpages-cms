(function ($) {
	/**
	   * @param $scope The Widget wrapper element as a jQuery element
	 * @param $ The jQuery alias
	 */
	// Make sure you run this code under Elementor.


	// $( window ).on( 'elementor/frontend/init', function() {
	// 	elementorFrontend.hooks.addAction( 'frontend/element_ready/bplayer.default', function( scope, $){
	// 		let plyerId = $(scope).find('#app');
	// 		let plyer_opt = $(plyerId).data('settings');

	// 		let player = new cplayer({
	// 			element: plyerId[0],
	// 			// element: document.getElementById('app'),
	// 			playlist: [
	// 				{
	// 					src: plyer_opt.track_source.url,
	// 					poster: plyer_opt.track_poster.url,
	// 					name: plyer_opt.track_title,
	// 					artist:plyer_opt.track_artist_name,
	// 					album: plyer_opt.track_album,
	// 					type: 'audio'

	// 				}
	// 			],
	// 			dark: plyer_opt.dark_mode,
	// 			big: plyer_opt.bplayer_size,
	// 			zoomOutKana: true,
	// 			shadowDom: true,
	// 			showPlaylistButton: false,
	// 			showPlaylist: false,
	// 			dropDownMenuMode: 'none',
	// 		})
	//     } );
	// } );

	// // Video Player
	// $( window ).on( 'elementor/frontend/init', function() {
	// 	elementorFrontend.hooks.addAction( 'frontend/element_ready/bplayer-video.default', function( scope, $){
	// 		let plyerId = $(scope).find('#app');
	// 		let plyer_opt = $(plyerId).data('settings');

	// 		console.log(plyer_opt.play_mode);
	// 		let player = new cplayer({
	// 			element: plyerId[0],
	// 			// element: document.getElementById('app'),
	// 			playlist: [
	// 				{
	// 					src: plyer_opt.track_source.url,
	// 					poster: plyer_opt.track_poster.url,
	// 					name: plyer_opt.track_title,
	// 					artist:plyer_opt.track_artist_name,
	// 					album: plyer_opt.track_album,
	// 					type: 'video'

	// 				}
	// 			],
	// 			dark: plyer_opt.dark_mode,
	// 			big: true,
	// 			zoomOutKana: false,
	// 			shadowDom: false,
	// 			showPlaylistButton: false,
	// 			showPlaylist: false,
	// 			dropDownMenuMode: 'none',
	// 		})
	//     } );
	// } );

	function initBPlayer(container) {
		let $container = $(container).find('#bplayer-app');
		if (!$container.length) return; // prevent errors if element not found

		let settings = $container.data('settings');
		if (!settings) return;

		new cplayer({
			element: $container[0],
			playlist: [
				{
					src: settings.track_source?.url || '',
					poster: settings.track_poster?.url || '',
					name: settings.track_title || 'Unknown Title',
					artist: settings.track_artist_name || 'Unknown Artist',
					album: settings.track_album || '',
					type: 'video'
				}
			],
			dark: settings.dark_mode || false,
			big: true,
			zoomOutKana: false,
			shadowDom: false,
			showPlaylistButton: false,
			showPlaylist: false,
			dropDownMenuMode: 'none',
		});
	}

	// Elementor Edit View
	$(window).on('elementor/frontend/init', function () {
		elementorFrontend.hooks.addAction(
			'frontend/element_ready/bplayer-video.default',
			function (scope) {
				initBPlayer(scope);
			}
		);
	});

	// Frontend View (direct init)
	initBPlayer($);

	// Audio Player
	// function initAudioBPlayer(container) {
	// 	let $container = $(container).find('#audio-app');
	// 	let plyer_opt = $container.data('settings');

	// 	let player = new cplayer({
	// 		element: $container[0],
	// 		// element: document.getElementById('app'),
	// 		playlist: [
	// 			{
	// 				src: plyer_opt?.track_source?.url,
	// 				poster: plyer_opt?.track_poster?.url,
	// 				name: plyer_opt?.track_title,
	// 				artist:plyer_opt?.track_artist_name,
	// 				album: plyer_opt?.track_album,
	// 				type: 'audio'

	// 			}
	// 		],
	// 		dark: plyer_opt?.dark_mode,
	// 		big: plyer_opt?.bplayer_size,
	// 		zoomOutKana: true,
	// 		shadowDom: true,
	// 		showPlaylistButton: false,
	// 		showPlaylist: false,
	// 		dropDownMenuMode: 'none',
	// 	})
	// }

	// //Elementor edit view
	// $( window ).on( 'elementor/frontend/init', function() {
	// elementorFrontend.hooks.addAction( 'frontend/element_ready/bplayer.default', 
	// 	function (scope) {
	// 		initAudioBPlayer(scope);
	// 	}
	// 	);
	// } );

	// // Frontend View
	// initAudioBPlayer($);

	function initAudioBPlayer(container) {
		let $container = $(container).find('.advance-audio-app').first();
		if ($container.length === 0) return;

		let plyer_opt = $container.data('settings');

		let player = new cplayer({
			element: $container[0],
			playlist: [
				{
					src: plyer_opt?.track_source?.url || '',
					poster: plyer_opt?.track_poster?.url || '',
					name: plyer_opt?.track_title || 'Untitled',
					artist: plyer_opt?.track_artist_name || '',
					album: plyer_opt?.track_album || '',
					type: 'audio'
				}
			],
			dark: plyer_opt?.dark_mode,
			big: plyer_opt?.bplayer_size,
			zoomOutKana: true,
			shadowDom: true,
			showPlaylistButton: false,
			showPlaylist: false,
			dropDownMenuMode: 'none',
		});

	}

	$(window).on('elementor/frontend/init', function () {
		elementorFrontend.hooks.addAction('frontend/element_ready/bplayer.default', function (scope) {
			initAudioBPlayer(scope);
		});
	});

	// Frontend View
	$(document).ready(function () {
        $('.bplayer-widget-wrapper').each(function () {
            if (this.querySelector('.advance-audio-app')) {
                initAudioBPlayer(this);
            }
        });
    });

})(jQuery);


