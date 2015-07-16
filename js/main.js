$( document ).ready(function() {

	var clientId = '94b213b0b8e3564',
		$galleryItems = [],
		$mainGallery = {},
		count = 0;

	$.ajax({
		url: 'https://api.imgur.com/3/gallery/hot/viral/0.json',
		type: 'GET',
		headers: {
			Authorization: 'Client-ID ' + clientId,
		},
		success: function(result) {
			$galleryItems = result.data;
			count = $galleryItems.length;
			console.log($galleryItems);
			getAlbumImages();
			// init();
		}
	});

	function init() {

		// Compile Handlebars
		var source = $('#main-template').html();
		var template = Handlebars.compile(source);
		var content = {items: $galleryItems};
		var iterate = template(content);

		$('#list').html(iterate);
	}

	function getAlbumImages() {

		for (i=0; i <= count; i++){

			if ($galleryItems[i].is_album == true) {

				$.ajax({
					url: 'https://api.imgur.com/3/album/' + $galleryItems[i].id,
					type: 'GET',
					headers: {
						Authorization: 'Client-ID ' + clientId,
					},
					success: function(result) {
						$.extend($mainGallery, result.data)
					}
				});

			} else {
				// $mainGallery.push($galleryItems[i]);
			}
		}

		console.log($mainGallery);

	}

});