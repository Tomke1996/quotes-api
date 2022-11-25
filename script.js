// Particles JS:
window.onload = function() {
  Particles.init({
    selector: '.background',
    maxParticles: 120,
    color: '#A4D2D7',
    connectParticles: true,
    responsive: [
        {
            breakpoint: 768,
            options: {
                maxParticles: 80,
                color: '#48F2E3',
                connectParticles: true 
            }
        }, {
            breakpoint: 425,
            options: {
                maxParticles: 50,
                connectParticles: true
            }
        }, {
            breakpoint: 320,
            options: {
                maxParticles: 25,
                connectParticles: true
            }
        }
    ],
  });
};

// Main JS:
const quoteContainer = document.querySelector('.container');
const quoteText = document.getElementById('quote');
const author = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const favoriteBtn = document.getElementById('favorite');
const newQuoteBtn = document.getElementById('new-quote');
const favPageBtn = document.getElementById('favPageBtn');
const mainPage = document.getElementById('main-page');
const favPage = document.getElementById('fav-page');
const backBtn = document.querySelector('.backBtn');
const favoriteContainer = document.querySelector('.favorite-container');

let apiQuotes = [];
let favorites = [];
let favItems = {};

async function getQuotes() {
    const apiUrl = 'https://type.fit/api/quotes';
    try {
        const response = await fetch(apiUrl);
        apiQuotes = await response.json();
        newQuotes();
    } catch(error) {
        // Catch Error
    }
    updateDOM();
    console.log(favorites);
}

function newQuotes() {
    const quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
    // Set author name
    !quote.author ? author.textContent = '~Unknown' : author.textContent = `~${quote.author}`;
    // Set author text size
    quote.text.length > 120 ? quoteText.classList.add('long-quote') : quoteText.classList.remove('long-quote');
    quoteText.textContent = quote.text;
    // console.log(quote);
    favoriteBtn.classList.remove('active');
}

function tweetQuote() {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${author.textContent}`;
    window.open(twitterUrl, '_blank');
}

function storeQuote() {
    const savedQuote = {
        authorQuote: author.textContent,
        textQuote: quoteText.textContent
    };
    if (favoriteBtn.classList.contains('active')) {
        favorites.push(savedQuote);
    } else {
        favorites.pop(savedQuote);
    } 
    console.log(favorites);
    localStorage.setItem('savedQuotes', JSON.stringify(favorites));
    updateDOM();
}

function createDOMNode() {
    const favArray = Object.values(favItems);
    favArray.forEach((favorite) => {
        // Create div wrapper
        const quoteWrapper = document.createElement('div');
        quoteWrapper.classList.add('quote-wrapper');
        // Author name
        const savedAuthor = document.createElement('span');
        savedAuthor.classList.add('savedAuthor');
        savedAuthor.textContent = favorite.authorQuote;
        // Author quote
        const savedText = document.createElement('span');
        savedText.classList.add('savedText');
        savedText.textContent = `-${favorite.textQuote}`;
        // Remove from favorite button -- add later!
        // const removeBtn = document.createElement('button');
        // removeBtn.classList.add('removeBtn');
        // removeBtn.textContent = 'X';
        // removeBtn.setAttribute('onclick', `removeFromFavorites(${savedText.textContent})`)
        // Append 
        quoteWrapper.append(savedAuthor, savedText);
        favoriteContainer.appendChild(quoteWrapper);
    });
}

function updateDOM() {
    if (localStorage.getItem('savedQuotes')) {
        favItems = JSON.parse(localStorage.getItem('savedQuotes'));
    }
    // favorites = JSON.parse(localStorage.getItem('savedQuotes')); 
    // console.log(favorites);
    favoriteContainer.textContent = '';
    createDOMNode();
}

// function removeFromFavorites(element) {
//     console.log(element);
// }

// Add Event Listeners
newQuoteBtn.addEventListener('click', newQuotes);
twitterBtn.addEventListener('click', tweetQuote);
favoriteBtn.addEventListener('click', () => {
    favoriteBtn.classList.toggle('active');
});
favoriteBtn.addEventListener('click', storeQuote);
favPageBtn.addEventListener('click', () => {
    mainPage.hidden = true;
    favPage.hidden = false;
});
backBtn.addEventListener('click', () => {
    mainPage.hidden = false;
    favPage.hidden = true;
});

getQuotes();
