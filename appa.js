document.addEventListener('DOMContentLoaded', function() {
    displayFavorites();
    const darkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = true;
    }

    document.querySelector('.dropdown-toggle').addEventListener('click', function() {
        const dropdownMenu = document.querySelector('.dropdown-menu');
        dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex'; 
    });

    loadFavoritesFromURL();
    document.getElementById('shareList').addEventListener('click', generateShareableLink);
});

function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

function base64ToUtf8(str) {
    return decodeURIComponent(escape(atob(str)));
}

function encodeFavorites(favorites) {
    return utf8ToBase64(JSON.stringify(favorites));
}

function decodeFavorites(encodedFavorites) {
    return JSON.parse(base64ToUtf8(encodedFavorites));
}

function generateShareableLink() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const encodedFavorites = encodeFavorites(favorites);
    const baseUrl = window.location.origin;
    const shareableLink = `${baseUrl}?view=${encodedFavorites}`;
    prompt('Share this link with others:', shareableLink);
}

function displayFavoritesFromURL(favorites) {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';

    favorites.forEach((favorite) => {
        const listItem = document.createElement('li');
        const productLink = document.createElement('a');
        productLink.classList.add('item-link');
        productLink.href = favorite.link;
        productLink.target = '_blank';

        const productImage = document.createElement('img');
        productImage.src = favorite.image;
        productImage.alt = favorite.name;

        const productDetails = document.createElement('div');
        const productName = document.createElement('h4');
        productName.textContent = favorite.name;
        const productPrice = document.createElement('p');
        productPrice.textContent = `Price: ${favorite.price}`;
        const productSize = favorite.size ? document.createElement('p') : null;
        if (productSize) productSize.textContent = `Size: ${favorite.size}`;
        const productBatch = favorite.batch ? document.createElement('p') : null;
        if (productBatch) productBatch.textContent = `Batch: ${favorite.batch}`;

        productDetails.appendChild(productName);
        productDetails.appendChild(productPrice);
        if (productSize) productDetails.appendChild(productSize);
        if (productBatch) productDetails.appendChild(productBatch);

        productLink.appendChild(productImage);
        productLink.appendChild(productDetails);

        listItem.appendChild(productLink);

        favoritesList.appendChild(listItem);
    });
}

function loadFavoritesFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedFavorites = urlParams.get('view');
    if (encodedFavorites) {
        const decodedFavorites = decodeFavorites(encodedFavorites);
        displayFavoritesFromURL(decodedFavorites);
    } else {
        displayFavorites();
    }
}
