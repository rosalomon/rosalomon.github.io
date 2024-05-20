document.getElementById('dateForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userDate = new Date(document.getElementById('dateInput').value);
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous result

    fetch('data/data.xlsx') // Path to your Excel file
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, {type: 'array'});
            const sheetName = workbook.SheetNames[0];
            const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // Function to convert Excel date to JavaScript date
            const convertExcelDateToJSDate = (excelDate) => {
                // Assuming date is in the format "YYYY-MM-DD"
                return new Date(excelDate);
            };

            const filteredEvents = sheet.filter(event => 
                event.Titel && event.Datum && 
                event.Titel.includes('Publicering av penningpolitiskt beslut')
            );

            if (filteredEvents.length === 0) {
                resultDiv.innerHTML = `<p>Inga relevanta händelser hittades.</p>`;
                return;
            }

            const closestEvent = filteredEvents.reduce((closest, current) => {
                const currentDate = convertExcelDateToJSDate(current.Datum);
                const closestDate = convertExcelDateToJSDate(closest.Datum);

                return Math.abs(currentDate - userDate) < Math.abs(closestDate - userDate) ? current : closest;
            }, filteredEvents[0]); // Initialize with the first event

            const eventDate = convertExcelDateToJSDate(closestEvent.Datum).toLocaleDateString();
            resultDiv.innerHTML = `<p>Riksbanken kommer med räntebesked den ${eventDate} och det kan påverka din förhandling om en ny ränta med banken.</p>`;
        })
        .catch(error => {
            resultDiv.innerHTML = `<p>Något gick fel: ${error.message}</p>`;
            console.error(error); // Log the error to the console for debugging
        });
});
