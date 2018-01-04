var ANIMATION_SPEED = 300
var SCROLL_SPEED = 200

// Adjust card-details position relative to grid based on changing number of
// columns per row.
var updateCardDetailsPos = function () {
  var w = jQuery(window).width
  var cardDetails = jQuery('.card-details')
  var cardDetailsSize = cardDetails.length

  cardDetails.each(function (i) {
    var cardsPerRow = jQuery(this).css('grid-column-end') - 1
    var row = Math.floor(i / cardsPerRow)
    var gridRowStyle = (row + 2) + ' / ' + (row + 3)

    jQuery(this).css('grid-row', gridRowStyle)
  })
}

var handleResize = function () {
  updateCardDetailsPos()
}

var scrollToButton = function (button) {
  jQuery('html, body').animate({
    scrollTop: button.offset().top
  }, SCROLL_SPEED)
}

// Clicking a card should toggle its corresponding details block open (and
// close other details blocks that might already be open).
var handleCardClick = function () {
  var clickedCard = jQuery(this)
  var clickedCardIcon = clickedCard.find('.card-icon').first()
  var cards = jQuery('.card')
  var cardsSize = cards.length
  var i = cards.index(this)
  var clickedDetails = jQuery('.card-details:eq(' + i + ')')
  var openCard = jQuery('.card.open').first()
  var openDetails = jQuery('.card-details.open').first()
  var sameRowDetails = clickedDetails.css('grid-row') === openDetails.css('grid-row')
  var clickClose = clickedCard.hasClass('open')

  // set all cards to "closed"
  jQuery('.card').removeClass('open')
  jQuery('.card .card-icon').removeClass('card-close')
  jQuery('.card-details').removeClass('open')

  if (!clickClose) {
    clickedCardIcon.addClass('card-close')
    clickedCard.addClass('open')
    clickedDetails.addClass('open')
  }

  // close/open details (use "fade" if on same row as existing open details,
  // otherwise, use "slide").
  if (clickClose) {
    clickedDetails.slideToggle(ANIMATION_SPEED)
    scrollToButton(clickedCard)
  } else if (!clickClose && sameRowDetails) {
    clickedDetails.fadeIn(ANIMATION_SPEED)
    openDetails.fadeOut(ANIMATION_SPEED)
  } else {
    openDetails.slideUp(ANIMATION_SPEED).promise().done(function () {
      clickedDetails.slideToggle(ANIMATION_SPEED)
      scrollToButton(clickedCard)
    })
  }
}

// Wait until markup and styles have finished rendering before intializing
// JS resizing (setTimeout(0) forces wait until next available draw cycle).
jQuery(document).ready(function () {
  setTimeout(function () {
    jQuery('.card').click(handleCardClick)
    jQuery(window).resize(handleResize)
    handleResize()
  }, 0)
})
