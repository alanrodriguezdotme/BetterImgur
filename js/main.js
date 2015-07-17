$( document ).ready(function() {

	var clientId = '94b213b0b8e3564',
		galleryItems = [],
		mainGallery = [];

	$.ajax({
		url: 'https://api.imgur.com/3/gallery/hot/viral/0.json',
		type: 'GET',
		headers: {
			Authorization: 'Client-ID ' + clientId,
		},
		success: function(result) {
			galleryItems = result.data;
			addAlbumsToGallery(galleryItems);
		}
	});

	function init() {

		// Compile Handlebars
		var source = $('#main-template').html();
		var template = Handlebars.compile(source);
		var content = {items: mainGallery};
		var iterate = template(content);

		$('#list').html(iterate);
	}

	function getAlbum(id, gallery) {

		return $.ajax({
			url: 'https://api.imgur.com/3/album/' + id,
			type: 'GET',
			headers: {
				Authorization: 'Client-ID ' + clientId
			},
			error: function(error) {
				console.log(error);
			},
			success: function(result) {
				gallery.push(result.data);
			}
		});
	}

	function addAlbumsToGallery(fullGallery) {

		var count = fullGallery.length,
			finalGallery = [];

		console.log("fullGallery: " + count);

		var tasks = [];

		for (i=0; i < count; i++){

			if (fullGallery[i].is_album) {
				tasks.push(getAlbum(fullGallery[i].id, finalGallery));
			} else {
				finalGallery.push(fullGallery[i]);
			}
		}

		$.when.apply(this, tasks)
		.done(function(){
			console.log("finalGallery: " + finalGallery.length);
			$.merge(mainGallery, finalGallery);
		})
		.done(function(){
			console.log(mainGallery);
			init();
		});

	}
});