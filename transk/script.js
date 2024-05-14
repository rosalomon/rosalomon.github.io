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

    for (let i = 0; i < tokens.length; i += tokenSize) {
        const chunk = tokens.slice(i, i + tokenSize).join('');
        const span = document.createElement('span');
        span.style.backgroundColor = getRandomColor();
        span.textContent = chunk;
        container.appendChild(span);
    }
}

fetch('text/test.txt')
    .then(response => response.text())
    .then(data => {
        const tokenSize = 10; // Ändra denna siffra för att justera antalet tokens per del
        colorizeText(data, tokenSize);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
