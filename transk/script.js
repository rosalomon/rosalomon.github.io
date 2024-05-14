// Funktion för att generera en slumpmässig färg
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Enkel tokenizer-funktion som delar text i ord (tokens)
function tokenize(text) {
    return text.split(/(\s+)/).filter(token => token.trim().length > 0);
}

// Funktion för att dela upp texten i tokens och färglägga varje del
function colorizeText(text, tokenSize) {
    const container = document.getElementById('textContainer');
    container.innerHTML = ''; // Rensa befintligt innehåll

    const tokens = tokenize(text);
    let colorIndex = 1;

    for (let i = 0; i < tokens.length; i += tokenSize) {
        const chunk = tokens.slice(i, i + tokenSize).join('');
        const color = getRandomColor();

        // Skapa och lägg till startmarkör
        const startMarker = document.createElement('div');
        startMarker.textContent = `-------------DEL ${colorIndex}-------------`;
        container.appendChild(startMarker);

        // Skapa och lägg till färglagd text
        const span = document.createElement('span');
        span.style.backgroundColor = color;
        span.textContent = chunk;
        container.appendChild(span);

        // Skapa och lägg till slutmarkör
        const endMarker = document.createElement('div');
        endMarker.textContent = `-------------DEL ${colorIndex}-------------`;
        container.appendChild(endMarker);

        colorIndex++;
    }
}

fetch('text/test.txt')
    .then(response => response.text())
    .then(data => {
        const tokenSize = 2048; // Ändra denna siffra för att justera antalet tokens per context window
        colorizeText(data, tokenSize);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
