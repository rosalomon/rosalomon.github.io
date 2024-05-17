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
                const date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
                return date;
            };

            const closestEvent = sheet.reduce((closest, current) => {
                const currentDate = convertExcelDateToJSDate(current.Datum);
                const closestDate = convertExcelDateToJSDate(closest.Datum);

                return Math.abs(currentDate - userDate) < Math.abs(closestDate - userDate) ? current : closest;
            });

            const eventDate = convertExcelDateToJSDate(closestEvent.Datum).toLocaleDateString();
            resultDiv.innerHTML = `<p>Riksbanken kommer med räntebesked den ${eventDate} och det kan påverka din förhandling om en ny ränta med banken.</p>`;
        })
        .catch(error => {
            resultDiv.innerHTML = `<p>Något gick fel: ${error.message}</p>`;
        });
});
