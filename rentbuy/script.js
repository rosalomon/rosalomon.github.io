document.getElementById('buyBtn').addEventListener('click', function() {
    toggleActiveButton('buyBtn');
    showInputs('buyInputs');
});

document.getElementById('rentBtn').addEventListener('click', function() {
    toggleActiveButton('rentBtn');
    showInputs('rentInputs');
});

function toggleActiveButton(activeId) {
    const buttons = document.querySelectorAll('.choice-btn');
    buttons.forEach(button => {
        if (button.id === activeId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function showInputs(inputId) {
    document.getElementById('buyInputs').classList.add('hidden');
    document.getElementById('rentInputs').classList.add('hidden');
    document.getElementById(inputId).classList.remove('hidden');
}

document.getElementById('interestRate').addEventListener('input', function() {
    document.getElementById('interestRateValue').textContent = this.value;
});

document.getElementById('loanToValue').addEventListener('input', function() {
    document.getElementById('loanToValueValue').textContent = this.value;
});

document.getElementById('deposit').addEventListener('input', function() {
    document.getElementById('depositValue').textContent = this.value;
});

document.getElementById('calculateBtn').addEventListener('click', function() {
    if (document.getElementById('buyBtn').classList.contains('active')) {
        calculateBuyOption();
    } else if (document.getElementById('rentBtn').classList.contains('active')) {
        calculateRentOption();
    } else {
        alert('Var god välj ett alternativ först.');
    }
});

function calculateBuyOption() {
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    const monthlyFee = parseFloat(document.getElementById('monthlyFee').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
    const loanToValue = parseFloat(document.getElementById('loanToValue').value) / 100;
    const pricePerSquareMeter = parseFloat(document.getElementById('pricePerSquareMeter').value);

    if (isNaN(purchasePrice) || isNaN(monthlyFee) || isNaN(interestRate) || isNaN(loanToValue) || isNaN(pricePerSquareMeter)) {
        alert('Var god fyll i alla fält korrekt.');
        return;
    }

    // Placeholder logic for calculations
    const futureValueBuy = purchasePrice * Math.pow((1 + 0.03), 10); // Assuming 3% annual growth

    document.getElementById('buyResult').textContent = `Framtida värde: ${futureValueBuy.toFixed(2)} kr`;
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

function calculateRentOption() {
    const monthlyRent = parseFloat(document.getElementById('monthlyRent').value);
    const deposit = parseFloat(document.getElementById('deposit').value);

    if (isNaN(monthlyRent) || isNaN(deposit)) {
        alert('Var god fyll i alla fält korrekt.');
        return;
    }

    // Placeholder logic for calculations
    const futureValueRent = (monthlyRent * deposit) * Math.pow((1 + 0.05), 10); // Assuming 5% annual investment return

    document.getElementById('rentResult').textContent = `Framtida värde: ${futureValueRent.toFixed(2)} kr`;
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}
