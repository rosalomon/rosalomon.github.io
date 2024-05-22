document.getElementById('buyBtn').addEventListener('click', function() {
    toggleActiveButton('buyBtn');
    showInputs('buyInputs');
    document.getElementById('yearsSection').classList.remove('hidden');
    document.getElementById('returnRates').classList.add('hidden');
});

document.getElementById('rentBtn').addEventListener('click', function() {
    toggleActiveButton('rentBtn');
    showInputs('rentInputs');
    document.getElementById('yearsSection').classList.add('hidden');
    document.getElementById('returnRates').classList.add('hidden');
});

document.querySelectorAll('.year-btn').forEach(button => {
    button.addEventListener('click', function() {
        toggleActiveYearButton(this);
        const years = parseInt(this.getAttribute('data-years'));
        if (years === 25) {
            showAverageReturnRateSliders(5, 25);
        } else {
            showReturnRateSliders(years);
        }
    });
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

function toggleActiveYearButton(activeButton) {
    const buttons = document.querySelectorAll('.year-btn');
    buttons.forEach(button => {
        if (button === activeButton) {
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

function showReturnRateSliders(years) {
    const returnRatesDiv = document.getElementById('returnRates');
    returnRatesDiv.innerHTML = '';
    for (let i = 1; i <= years; i++) {
        const label = document.createElement('label');
        label.textContent = `Avkastning år ${i}:`;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '20';
        slider.step = '0.1';
        slider.id = `returnRate${i}`;
        slider.name = `returnRate${i}`;

        const span = document.createElement('span');
        span.id = `returnRateValue${i}`;
        span.textContent = '0';

        slider.addEventListener('input', function() {
            span.textContent = this.value;
        });

        returnRatesDiv.appendChild(label);
        returnRatesDiv.appendChild(slider);
        returnRatesDiv.appendChild(span);
        returnRatesDiv.appendChild(document.createElement('br'));
    }
    returnRatesDiv.classList.remove('hidden');
}

function showAverageReturnRateSliders(interval, totalYears) {
    const returnRatesDiv = document.getElementById('returnRates');
    returnRatesDiv.innerHTML = '';
    for (let i = 0; i < totalYears; i += interval) {
        const label = document.createElement('label');
        label.textContent = `Snittavkastning år ${i}-${i + interval}:`;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '20';
        slider.step = '0.1';
        slider.id = `averageReturnRate${i}`;
        slider.name = `averageReturnRate${i}`;

        const span = document.createElement('span');
        span.id = `averageReturnRateValue${i}`;
        span.textContent = '0';

        slider.addEventListener('input', function() {
            span.textContent = this.value;
        });

        returnRatesDiv.appendChild(label);
        returnRatesDiv.appendChild(slider);
        returnRatesDiv.appendChild(span);
        returnRatesDiv.appendChild(document.createElement('br'));
    }
    returnRatesDiv.classList.remove('hidden');
}

function calculateBuyOption() {
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    const monthlyFee = parseFloat(document.getElementById('monthlyFee').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
    const loanToValue = parseFloat(document.getElementById('loanToValue').value) / 100;
    const pricePerSquareMeter = parseFloat(document.getElementById('pricePerSquareMeter').value);
    const yearsButton = document.querySelector('.year-btn.active');
    const years = yearsButton ? parseInt(yearsButton.getAttribute('data-years')) : 0;

    if (isNaN(purchasePrice) || isNaN(monthlyFee) || isNaN(interestRate) || isNaN(loanToValue) || isNaN(pricePerSquareMeter) || years === 0) {
        alert('Var god fyll i alla fält korrekt.');
        return;
    }

    let futureValueBuy = purchasePrice;
    if (years === 25) {
        for (let i = 0; i < years; i += 5) {
            const averageReturnRate = parseFloat(document.getElementById(`averageReturnRate${i}`).value) / 100;
            futureValueBuy *= Math.pow((1 + averageReturnRate), 5);
        }
    } else {
        for (let i = 1; i <= years; i++) {
            const returnRate = parseFloat(document.getElementById(`returnRate${i}`).value) / 100;
            futureValueBuy *= (1 + returnRate);
        }
    }

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
