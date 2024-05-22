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
        showOverallReturnRateSlider(years);
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

function showOverallReturnRateSlider(years) {
    const returnRatesDiv = document.getElementById('returnRates');
    returnRatesDiv.innerHTML = '';

    const label = document.createElement('label');
    label.textContent = `Avkastning för ${years} år:`;

    const overallSlider = document.createElement('input');
    overallSlider.type = 'range';
    overallSlider.min = '0';
    overallSlider.max = '20';
    overallSlider.step = '0.1';
    overallSlider.id = `overallReturnRate`;
    overallSlider.name = `overallReturnRate`;

    const span = document.createElement('span');
    span.id = `overallReturnRateValue`;
    span.textContent = '0';

    overallSlider.addEventListener('input', function() {
        span.textContent = this.value;
    });

    const arrowBtn = document.createElement('button');
    arrowBtn.textContent = '▼';
    arrowBtn.classList.add('arrow-btn');

    arrowBtn.addEventListener('click', function() {
        if (overallSlider.disabled) {
            overallSlider.disabled = false;
            overallSlider.style.backgroundColor = '';
            this.textContent = '▼';
            document.querySelectorAll('.individual-return-rate').forEach(el => el.remove());
        } else {
            overallSlider.disabled = true;
            overallSlider.style.backgroundColor = '#ccc';
            this.textContent = '▲';
            showIndividualReturnRateSliders(years, parseFloat(overallSlider.value));
        }
    });

    returnRatesDiv.appendChild(label);
    returnRatesDiv.appendChild(overallSlider);
    returnRatesDiv.appendChild(span);
    returnRatesDiv.appendChild(arrowBtn);
    returnRatesDiv.appendChild(document.createElement('br'));

    returnRatesDiv.classList.remove('hidden');
}

function showIndividualReturnRateSliders(years, overallRate) {
    const returnRatesDiv = document.getElementById('returnRates');

    for (let i = 1; i <= years; i++) {
        const label = document.createElement('label');
        label.textContent = `Avkastning år ${i}:`;
        label.classList.add('individual-return-rate');

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '0';
        slider.max = '20';
        slider.step = '0.1';
        slider.id = `returnRate${i}`;
        slider.name = `returnRate${i}`;
        slider.value = overallRate;
        slider.classList.add('individual-return-rate');

        const span = document.createElement('span');
        span.id = `returnRateValue${i}`;
        span.textContent = overallRate;
        span.classList.add('individual-return-rate');

        slider.addEventListener('input', function() {
            span.textContent = this.value;
        });

        returnRatesDiv.appendChild(label);
        returnRatesDiv.appendChild(slider);
        returnRatesDiv.appendChild(span);
        returnRatesDiv.appendChild(document.createElement('br')).classList.add('individual-return-rate');
    }
}

function calculateBuyOption() {
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    const monthlyFee = parseFloat(document.getElementById('monthlyFee').value);
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
    const loanToValue = parseFloat(document.getElementById('loanToValue').value) / 100;
    const size = parseFloat(document.getElementById('size').value);
    const yearsButton = document.querySelector('.year-btn.active');
    const years = yearsButton ? parseInt(yearsButton.getAttribute('data-years')) : 0;

    if (isNaN(purchasePrice) || isNaN(monthlyFee) || isNaN(interestRate) || isNaN(loanToValue) || isNaN(size) || years === 0) {
        alert('Var god fyll i alla fält korrekt.');
        return;
    }

    let futureValueBuy = purchasePrice;
    let returnRate;
    const overallSlider = document.getElementById('overallReturnRate');

    if (overallSlider && overallSlider.disabled) {
        // If individual sliders are used
        for (let i = 1; i <= years; i++) {
            const individualSlider = document.getElementById(`returnRate${i}`);
            if (individualSlider) {
                returnRate = parseFloat(individualSlider.value) / 100;
                futureValueBuy *= (1 + returnRate);
            } else {
                alert(`Var god fyll i avkastning för år ${i}.`);
                return;
            }
        }
    } else if (overallSlider) {
        // If overall slider is used
        returnRate = parseFloat(overallSlider.value) / 100;
        if (isNaN(returnRate)) {
            alert('Var god fyll i avkastningsslidern först.');
            return;
        }
        futureValueBuy *= Math.pow((1 + returnRate), years);
    } else {
        alert('Var god välj avkastningsslidern först.');
        return;
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
