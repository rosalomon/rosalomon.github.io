// Funktion för att generera en slumpmässig färg
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Funktion för att importera gpt-3-encoder
async function importEncoder() {
    const encoder = await import('https://cdn.jsdelivr.net/npm/gpt-3-encoder@1.0.2');
    return encoder;
}

// Funktion för att dela upp texten i tokens och färglägga varje del
async function colorizeText(text, tokenSize) {
    const container = document.getElementById('textContainer');
    container.innerHTML = ''; // Rensa befintligt innehåll

    const { encode, decode } = await importEncoder();
    const tokens = encode(text);
    let colorIndex = 1;

    for (let i = 0; i < tokens.length; i += tokenSize) {
        const chunkTokens = tokens.slice(i, i + tokenSize);
        const chunkText = decode(chunkTokens);
        const color = getRandomColor();

        // Skapa och lägg till startmarkör
        const startMarker = document.createElement('div');
        startMarker.textContent = `-------------DEL ${colorIndex}-------------`;
        container.appendChild(startMarker);

        // Skapa och lägg till färglagd text
        const span = document.createElement('span');
        span.style.backgroundColor = color;
        span.textContent = chunkText;
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
        const tokenSize = 2048; // Antalet tokens per "context window"
        colorizeText(data, tokenSize);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
