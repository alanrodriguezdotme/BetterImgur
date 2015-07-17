$( document ).ready(function() {

	var clientId = '94b213b0b8e3564',
		$galleryItems = [],
		$mainGallery = [];

	$.ajax({
		url: 'https://api.imgur.com/3/gallery/hot/viral/0.json',
		type: 'GET',
		headers: {
			Authorization: 'Client-ID ' + clientId,
		},
		success: function(result) {
			$galleryItems = result.data;
			$mainGallery = addAlbumsToGallery($galleryItems);
			// console.log($mainGallery);
			// init();
		}
	});

	function init() {

		// Compile Handlebars
		var source = $('#main-template').html();
		var template = Handlebars.compile(source);
		var content = {items: $mainGallery};
		var iterate = template(content);

		$('#list').html(iterate);
	}

	function getAlbum(id, callback) {
		var $thisAlbum = {};

		$.ajax({
			url: 'https://api.imgur.com/3/album/' + id,
			type: 'GET',
			headers: {
				Authorization: 'Client-ID ' + clientId
			},
			error: function(error) {
				console.log(error);
			},
			success: function(result) {
				$thisAlbum = result.data;
			}
		})
		.done(function(){
			// console.log($thisAlbum);
			return $thisAlbum;
		});
	}

	function addAlbumsToGallery(fullGallery) {

		var count = fullGallery.length,
			finalGallery = [];

		console.log("fullGallery: " + count);

		for (i=0; i < count; i++){

			if (fullGallery[i].is_album) {
				var $album = getAlbum(fullGallery[i].id)
				finalGallery.push($album);

			} else {
				finalGallery.push(fullGallery[i]);
			}
		}
		console.log("finalGallery: " + finalGallery.length);
		console.log(finalGallery);
		return finalGallery;

	}

});