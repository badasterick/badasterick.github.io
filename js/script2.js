// Mixins

.transition-all() {
    -webkit-transition: all 0.35s;
    -moz-transition: all 0.35s;
    transition: all 0.35s;
}

.background-cover() {
    -webkit-background-size: cover;
    -moz-background-size: cover;
    background-size: cover;
    -o-background-size: cover;
}

.button-variant(@color; @background; @border) {
	color: @color;
	background-color: @background;
	border-color: @border;
	.transition-all;

	&:hover,
	&:focus,
	&.focus,
	&:active,
	&.active,
	.open > .dropdown-toggle& {
		color: @color;
		background-color: darken(@background, 5%);
	    border-color: darken(@border, 7%);
	}
	&:active,
	&.active,
	.open > .dropdown-toggle& {
		background-image: none;
	}
	&.disabled,
	&[disabled],
	fieldset[disabled] & {
		&,
		&:hover,
		&:focus,
		&.focus,
		&:active,
		&.active {
			background-color: @background;
			border-color: @border;
		}
	}

	.badge {
		color: @background;
		background-color: @color;
	}
}

.sans-serif-font() {
	font-family: 'Open Sans', 'Helvetica Neue', Arial, sans-serif;
}

.serif-font() {
	font-family: 'Merriweather', 'Helvetica Neue', Arial, sans-serif;
}                                                                                                                                                                                                                                                                                                                                                                                                                                              ine__list').find('.timeline__item--active').removeClass('timeline__item--active');
    $('.timeline__list').find(`.timeline__item:nth-child(${currentSlide + 1})`).addClass('timeline__item--active');
  });

  $('.timeline__link').on('click', evt => {
	//alert("CODE RAN");
    evt.preventDefault();
    $('.timeline__item--active').removeClass('timeline__item--active');
    $(evt.currentTarget).parent().addClass('timeline__item--active');

    $('.views').slick('slickGoTo', $(evt.currentTarget).parent().prevAll('li').length);

  });

  let timelineOffset = $('.timeline').offset().left;
  let triangleWidth = $('.timeline__path__triangle--moving').outerWidth();

  $('.timeline').on('mousemove', evt => {
    let value = evt.pageX - timelineOffset - triangleWidth / 2;
    $('.timeline__path__triangle--moving').css({
      transform: `translateX(${value}px)` });

  });

  if (!areClipPathShapesSupported()) {
    $('body').addClass('no-clippath');
  } else {
    $('body').addClass('clippath');
  }

});