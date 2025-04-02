fetch('http://localhost:3001/games')
    .then(response => response.json())
    .then(games => {
        const gameGrid = document.getElementById('game-grid');
        const gameDetailsTitle = document.getElementById('game-details-title');
        const gameDetailsImage = document.getElementById('game-details-image');
        const gameDetailsDescription = document.getElementById('game-details-description');
        const gameDetailsInstruction = document.getElementById('game-details-instruction');
        const gameDetailsLink = document.getElementById('game-details-link');

        games.forEach(game => {
            const gameItem = document.createElement('div');
            gameItem.className = 'game-item';
            gameItem.innerHTML = `
                <img src="${game.img}" alt="${game.name}">
            `;
            gameGrid.appendChild(gameItem);
        });

        // Display details of the first game
        if (games.length > 0) {
            gameDetailsTitle.textContent = games[0].name;
            gameDetailsImage.src = games[0].img;
            gameDetailsDescription.textContent = games[0].description;
            gameDetailsInstruction.textContent = games[0].instruction;
            gameDetailsLink.href = games[0].link;
        }
});