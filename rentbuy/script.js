document.getElementById('calculateBtn').addEventListener('click', function() {
    const income = parseFloat(document.getElementById('income').value);
    const downpayment = parseFloat(document.getElementById('downpayment').value);
    const mortgage = parseFloat(document.getElementById('mortgage').value);

    if (isNaN(income) || isNaN(downpayment) || isNaN(mortgage)) {
        alert('Var god fyll i alla fält korrekt.');
        return;
    }

    // Placeholder logic for calculations
    const futureValueBuy = downpayment * Math.pow((1 + 0.03), 10); // Assuming 3% annual growth
    const futureValueRent = downpayment * Math.pow((1 + 0.05), 10); // Assuming 5% annual investment return

    document.getElementById('buyResult').textContent = `Framtida värde: ${futureValueBuy.toFixed(2)} kr`;
    document.getElementById('rentResult').textContent = `Framtida värde: ${futureValueRent.toFixed(2)} kr`;

    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
});
