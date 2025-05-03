// Neon Layout -- For hackers and space junkies
const numNeonImages = 8;
const randomImage =   Date.now() % numNeonImages + 1;
globalThis.document.body.classList.add('neon-image-' + String(randomImage));
