jQuery(document).ready(function($) {

	var taille_page = $(window).width();
	var fin_parcours = taille_page+100;
	var zombie = $('#zombie');
	var i=1;
	var play = $("#play");
	var hauteur_slider = $(".rslides").height();
	var marge = (515-hauteur_slider)/2;
	if (taille_page > 550) {
		$(".rslides").css( "margin-top", marge +"px");
		$(".rslides").css( "margin-bottom", marge +"px");
	}

	play.mouseover(function() {
		play.attr('src', 'img/logoplayvert.png');
	})

	play.mouseout(function() {
		play.attr('src', 'img/logoplaynoir.png');
	})

	play.mousedown(function() {
		play.attr('src', 'img/logoplayverthover.png');
	})

	play.mouseup(function() {
		play.attr('src', 'img/logoplayvert.png');
	})

	$(".rslides").responsiveSlides();

	var animation = setInterval(function(){
		if (zombie.position().left<fin_parcours) {
			if (zombie.position().left>taille_page) zombie.hide();
		zombie.animate({
		 	left: "+=10"
		},{
		 	queue: false,
		 	easing: "linear",
		 	duration: 350
		});
		i=(i+1)%4;
		zombie.attr('src', 'img/zombi_anim'+i+'.png');
	}
	else {
		clearInterval(animation);
	}
	},450);


});