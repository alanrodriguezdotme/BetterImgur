$(document).ready(function() {

	var clientId = '94b213b0b8e3564',
		galleryItems = [],
		gallerySection = [],
		mainGallery = [],
		page = 0,
		pageStart = 0,
		pageEnd = 9,
		pageQty = 10;

	$.ajax({
		url: 'https://api.imgur.com/3/gallery/hot/viral/0.json',
		type: 'GET',
		headers: {
			Authorization: 'Client-ID ' + clientId,
		},
		success: function(result) {
			galleryItems = result.data;
			galleryItems.sort(function(a,b) {
				return parseInt(b.datetime) - parseInt(a.datetime);
			});
			pagination();
			addAlbumsToGallery(gallerySection);
		}
	});

	$('.next').hide();
	$('.spinner').show();

	$('.next').on('click', function() {
		pagination(galleryItems);
		addAlbumsToGallery(gallerySection);
		gallerySection = [];
	});

	Handlebars.registerHelper("debug", function(optionalValue) {
		console.log("Current Context");
		console.log("====================");
		console.log(this);

		if (optionalValue) {
			console.log("Value");
			console.log("====================");
			console.log(optionalValue);
		}
	});

	function pagination(){

		gallerySection = galleryItems.slice(0, 10);
		galleryItems.splice(0, 10);
		addTemplate();

	}

	function infiniteScroll() {
		var ias = jQuery.ias({
			container:  '#gallery-list',
			item:       '.gallery-item',
			pagination: '#pagination',
			next:       '.next'
		});

		ias.extension(new IASTriggerExtension({
			text: 'More please'
		}));
	}

	function init() {

		// Compile Handlebars
		var source = $('#main-template').html();
		var template = Handlebars.compile(source);
		var content = {items: mainGallery};
		var iterate = template(content);
		$('#gallery-list').html(iterate);

		$('.next').css('display', 'block');
		$('.spinner').css('display', 'none');

		// Make albums into slider
		$('.album-list').bxSlider({
			speed: 250,
			adaptiveHeight: false,
			wrapperClass: 'album-wrapper',
			pagerType: 'short',
			keyboardEnabled: 'true'
		});

		// // Infinite scrolling using Waypoints.js
		// var infinite = new Waypoint.Infinite({
		//     element: $('.gallery-list')[0],
		//     items: $('.gallery-item')
		// });
	}

	function centerAlbumImages() {

		$('.album-list').find('.album-item').each(function() {

			var tallest = 0,
				albumImage = $(this).find('.album-image');

				if (albumImage.height() > tallest) {
					tallest = albumImage.height();
				}

		});

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

	function addAlbumsToGallery(gallery) {

		var albums = [],
			tasks = [];
			
		$('.next').hide();
		$('.spinner').show();

		$.each(gallery, function(i, data) {
			if (data.is_album) {
				tasks.push(getAlbum(data.id, albums));
			} else {
				mainGallery.push(data);
			}
		});

		$.when.apply(this, tasks)
		.done(function() {
			$.merge(mainGallery, albums);
		})
		.then(function() {
			init();
			console.log(mainGallery);
		});

	}

	function addTemplate() {
		$('.gallery-item:last-of-type').after('<script id="main-template" type="text/x-handlebars-template"> {{#each items}} <li class="gallery-item"> {{#if this.images}} <h1 class="album-title"> <a href="{{this.link}}" target="_blank">{{this.title}}</a> </h1> <ul class="album-list"> {{#each images}} <li class="album-item"> <div class="album-image-wrapper"> <a href="http://imgur.com/{{id}}" target="_blank"> <img class="album-image image" src="{{link}}" /> </a> </div> <div class="info"> {{#if title}} <h2 class="title">{{title}}</h2> {{/if}} {{#if description}} <div class="description">{{description}}</div> {{/if}} </div> </li> {{/each}} </ul> {{else}} <a href="http://imgur.com/{{id}}" target="_blank"> <img class="image" src="{{link}}" /> </a> <div class="info"> <h2 class="title">{{title}}</h2> <div class="description">{{description}}</div> </div> {{/if}} </li> {{/each}} </script>');
	}

});