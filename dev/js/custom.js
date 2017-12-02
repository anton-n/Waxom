$(document).ready(function(){

	$('.slider').bxSlider({
		mode: 'horizontal',
		// mode: 'vertical',
		// autoDirection: 'prev',
		auto: true,
		autoStart: true,
		pause: 5000,
		speed: 1000,
		startSlide: 0,
		infiniteLoop: true,
		touchEnabled: false,
		adaptiveHeight: true,
		// autoHover: true,
	});

	var mixer = mixitup('.mixitup__items');

	$('.counter').counterUp({
		delay: 50,
		time: 1000,
		offset: 100,
	});


	$('.bx-slider').bxSlider({
		mode: 'horizontal',
		slideWidth: 370,
		minSlides: 3,
		maxSlides: 3,
		moveSlides: 1,
		slideMargin: 30,
		pager: false,
		startSlide: 0,
		infiniteLoop: false,
		hideControlOnEnd: true,
		nextText: '',
		prevText: '',
		touchEnabled: true,
		swipeThreshold: 50,
		adaptiveHeight: true,
	});



})