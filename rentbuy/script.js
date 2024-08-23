document.addEventListener('DOMContentLoaded', function() {
    // Hantera knapptryckningar för att välja antal år
    document.querySelectorAll('.year-btn').forEach(button => {
        button.addEventListener('click', function() {
            toggleActiveYearButton(this);
        });
    });

    // Synka input-värden med sliders för ränta och belåningsgrad
    ['interestRate', 'loanToValue', 'overallReturnRate', 'stockReturnRate'].forEach(id => {
        document.getElementById(id).addEventListener('input', function() {
            document.getElementById(`${id}Value`).textContent = this.value;
        });
    });

    document.getElementById('calculateBtn').addEventListener('click', calculateValues);

    // Hantera klick på pilarna för att visa eller dölja individuella sliders
    ['overallReturnRateArrow', 'stockReturnRateArrow'].forEach(id => {
        document.getElementById(id).addEventListener('click', function() {
            toggleIndividualSliders(id === 'overallReturnRateArrow' ? 'overall' : 'stock');
        });
    });

    function toggleActiveYearButton(activeButton) {
        document.querySelectorAll('.year-btn').forEach(button => {
            button.classList.toggle('active', button === activeButton);
        });
    }

    function toggleIndividualSliders(type) {
        const years = getSelectedYears();
        if (!years) {
            alert('Välj antal år först.');
            return;
        }

        const container = document.getElementById(type === 'overall' ? 'individualOverallReturnRates' : 'individualStockReturnRates');
        const arrowButton = document.getElementById(type === 'overall' ? 'overallReturnRateArrow' : 'stockReturnRateArrow');
        const mainSlider = document.getElementById(type === 'overall' ? 'overallReturnRate' : 'stockReturnRate');

        if (container.classList.toggle('hidden')) {
            container.innerHTML = '';
            arrowButton.textContent = '▼';
            mainSlider.disabled = false;
        } else {
            container.innerHTML = '';
            for (let i = 1; i <= years; i++) {
                container.appendChild(createSliderElement(type, mainSlider.value, i));
            }
            arrowButton.textContent = '▲';
            mainSlider.disabled = true;
        }
    }

    function createSliderElement(type, value, year) {
        const label = document.createElement('label');
        label.textContent = `${type === 'overall' ? 'Värdeökningen' : 'Avkastningen'} år ${year}:`;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = '-100';
        slider.max = '100';
        slider.step = '0.1';
        slider.value = value;
        slider.classList.add(`${type}-individual-return-rate`);

        const span = document.createElement('span');
        span.textContent = value;

        slider.addEventListener('input', function() {
            span.textContent = this.value;
        });

        const wrapper = document.createElement('div');
        wrapper.classList.add('slider-container');
        wrapper.appendChild(label);
        wrapper.appendChild(slider);
        wrapper.appendChild(span);
        return wrapper;
    }

    function getSelectedYears() {
        const yearsButton = document.querySelector('.year-btn.active');
        return yearsButton ? parseInt(yearsButton.getAttribute('data-years')) : 0;
    }

    function calculateValues() {
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value.replace(/\s+/g, ''));
        const monthlyFee = parseFloat(document.getElementById('monthlyFee').value.replace(/\s+/g, ''));
        const monthlyRent = parseFloat(document.getElementById('monthlyRent').value.replace(/\s+/g, ''));
        const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
        const loanToValue = parseFloat(document.getElementById('loanToValue').value) / 100;
        const overallReturnRate = parseFloat(document.getElementById('overallReturnRate').value) / 100;
        const stockReturnRate = parseFloat(document.getElementById('stockReturnRate').value) / 100;
        const strictAmortization = document.getElementById('strictAmortization').checked;
        const initialInvestment = parseFloat(document.getElementById('initialInvestment').value.replace(/\s+/g, ''));
        const years = getSelectedYears();

        if (isNaN(purchasePrice) || isNaN(monthlyFee) || isNaN(monthlyRent) || isNaN(interestRate) || isNaN(loanToValue) || isNaN(overallReturnRate) || isNaN(stockReturnRate) || isNaN(initialInvestment) || years === 0) {
            alert('Var god fyll i alla fält korrekt.');
            return;
        }

        // Hantera avkastningar för börsen och värdeökningar för bostaden
        const stockReturnRates = getReturnRates('stock', stockReturnRate, years);
        const overallReturnRates = getReturnRates('overall', overallReturnRate, years);

        // Beräkna bostadsrättens framtida värde
        let futureValueBuy = calculateFutureValue(purchasePrice, overallReturnRates);

        // Beräkna hyresgästens investeringsportfölj
        let futureValueRent = calculatePortfolioValue(initialInvestment, monthlyRent, monthlyFee, loanToValue, interestRate, strictAmortization, stockReturnRates, years);

        // Visa resultat
        displayResults(futureValueBuy, futureValueRent, years);
    }

    function getReturnRates(type, defaultRate, years) {
        const rates = [];
        const container = document.getElementById(type === 'overall' ? 'individualOverallReturnRates' : 'individualStockReturnRates');
        if (!container.classList.contains('hidden')) {
            document.querySelectorAll(`.${type}-individual-return-rate`).forEach(slider => {
                rates.push(parseFloat(slider.value) / 100);
            });
        } else {
            for (let i = 0; i < years; i++) {
                rates.push(defaultRate);
            }
        }
        return rates;
    }

    function calculateFutureValue(initialValue, rates) {
        return rates.reduce((value, rate) => value * (1 + rate), initialValue);
    }

    function calculatePortfolioValue(initialInvestment, monthlyRent, monthlyFee, loanToValue, interestRate, strictAmortization, stockReturnRates, years) {
        let loanAmount = 2_000_000 * loanToValue;  // Lånebeloppet baserat på köpeskillingen
        let monthlyAmortization = getMonthlyAmortization(loanAmount, loanToValue, strictAmortization);

        // Beräkna månadskostnaden för bostadsägaren
        let monthlyInterestPayment = loanAmount * (interestRate / 12);
        let monthlyHousingCost = monthlyInterestPayment + monthlyAmortization + monthlyFee;

        // Beräkna skillnaden i boendekostnader
        let monthlyInvestment = Math.max(0, monthlyHousingCost - monthlyRent); // Skillnaden investeras på börsen om den är positiv

        let futureValueRent = initialInvestment;

        // Månatlig avkastning
        for (let i = 0; i < years * 12; i++) {
            const currentYear = Math.floor(i / 12);
            const monthlyStockReturnRate = (1 + stockReturnRates[currentYear]) ** (1 / 12) - 1;

            // Lägg till den månatliga investeringen och beräkna framtida värde
            futureValueRent = futureValueRent * (1 + monthlyStockReturnRate) + monthlyInvestment;
        }

        return futureValueRent;
    }

    function getMonthlyAmortization(loanAmount, loanToValue, strictAmortization) {
        let monthlyAmortization = 0;
        if (loanToValue > 0.5) monthlyAmortization = (loanAmount * 0.01) / 12;
        if (loanToValue > 0.7) monthlyAmortization = (loanAmount * 0.02) / 12;
        if (strictAmortization) monthlyAmortization += (loanAmount * 0.01) / 12;
        return monthlyAmortization;
    }

    function displayResults(futureValueBuy, futureValueRent, years) {
        document.getElementById('buyResult').innerHTML = `<p>Framtida värdet ${years} år: ${futureValueBuy.toFixed(2).toLocaleString()} kr</p>`;
        document.getElementById('rentResult').innerHTML = `<p>Framtida värdet ${years} år: ${futureValueRent.toFixed(2).toLocaleString()} kr</p>`;
        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
    }
});
