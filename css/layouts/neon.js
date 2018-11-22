// Neon layout -- For hackers and space junkies
const numNeonImages = 8;
$('body').addClass('neon-image-' + (Date.now() % numNeonImages + 1));
