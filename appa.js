document.addEventListener('DOMContentLoaded', function() {
    loadFavoritesFromURL();
    document.getElementById('sizeText').style.display = 'none';
    document.getElementById('batchText').style.display = 'none';

    const darkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').checked = true;
    }

    document.getElementById('settingsButton').addEventListener('click', function(event) {
        event.stopPropagation();
        document.getElementById('dropdownContent').classList.toggle('show');
    });

    document.getElementById('darkModeToggle').addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', this.checked);
    });

    document.getElementById('generateLinkButton').addEventListener('click', generateShareableLink);
});

window.onclick = function(event) {
    if (!event.target.matches('#settingsButton') && !event.target.matches('#settingsButton *')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

function displayFavorites(filter = '') {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const filteredFavorites = favorites.filter(favorite =>
        favorite.name.toLowerCase().includes(filter.toLowerCase())
    );
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';

    filteredFavorites.forEach((favorite, index) => {
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

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', () => removeFavorite(index));

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', () => editFavorite(index));

        listItem.appendChild(productLink);
        listItem.appendChild(removeButton);
        listItem.appendChild(editButton);

        favoritesList.appendChild(listItem);
    });
}

function removeFavorite(index) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
}

function editFavorite(index) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favorite = favorites[index];

    document.getElementById('name').value = favorite.name;
    document.getElementById('link').value = favorite.link;
    document.getElementById('image').value = favorite.image;
    document.getElementById('price').value = favorite.price;
    document.getElementById('size').checked = !!favorite.size;
    document.getElementById('batch').checked = !!favorite.batch;
    if (favorite.size) {
        document.getElementById('sizeText').value = favorite.size;
        document.getElementById('sizeText').style.display = 'block';
    }
    if (favorite.batch) {
        document.getElementById('batchText').value = favorite.batch;
        document.getElementById('batchText').style.display = 'block';
    }

    document.getElementById('productForm').setAttribute('data-edit-index', index);
    document.getElementById('toggleForm').textContent = '-';
    document.getElementById('productForm').style.display = 'block';
}

function encodeFavorites(favorites) {
    return btoa(JSON.stringify(favorites));
}

function decodeFavorites(encodedFavorites) {
    return JSON.parse(atob(encodedFavorites));
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
