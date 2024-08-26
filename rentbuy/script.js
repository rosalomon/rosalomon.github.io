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
        // Hämta användarens inmatning
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
        const monthlyFee = parseFloat(document.getElementById('monthlyFee').value);
        const monthlyRent = parseFloat(document.getElementById('monthlyRent').value);
        const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
        const loanToValue = parseFloat(document.getElementById('loanToValue').value) / 100;
        const overallReturnRate = parseFloat(document.getElementById('overallReturnRate').value) / 100;
        const stockReturnRate = parseFloat(document.getElementById('stockReturnRate').value) / 100;
        const strictAmortization = document.getElementById('strictAmortization').checked;
        const initialInvestment = parseFloat(document.getElementById('initialInvestment').value);
        const years = getSelectedYears();

        // Validera inmatning
        if (isNaN(purchasePrice) || isNaN(monthlyFee) || isNaN(monthlyRent) || isNaN(interestRate) ||
            isNaN(loanToValue) || isNaN(overallReturnRate) || isNaN(stockReturnRate) || isNaN(initialInvestment) || years === 0) {
            alert('Var god fyll i alla fält korrekt.');
            return;
        }

        // Beräkna lånebelopp och månatlig amortering
        const loanAmount = purchasePrice * loanToValue;
        console.log("Lånebelopp:", loanAmount);

        const monthlyAmortization = calculateAmortization(loanAmount, loanToValue, strictAmortization);
        console.log("Månatlig amortering:", monthlyAmortization);

        // Beräkna månatlig räntekostnad och boendekostnad
        const monthlyInterestPayment = loanAmount * (interestRate / 12);
        const monthlyHousingCost = monthlyInterestPayment + monthlyAmortization + monthlyFee;
        console.log("Månadskostnad för bostadsägare:", monthlyHousingCost);

        // Beräkna skillnad i boendekostnad och investeringsbelopp för hyresgäst
        const monthlyInvestment = Math.max(0, monthlyHousingCost - monthlyRent);
        console.log("Månatlig investering från skillnad i boendekostnader:", monthlyInvestment);

        // Beräkna framtida värde av bostadsrätten
        const futureValueBuy = calculateFutureValue(purchasePrice, overallReturnRate, years);
        console.log("Framtida värde på bostadsrätten:", futureValueBuy);

        // Beräkna framtida värde av hyresgästens portfölj
        const futureValueRent = calculateInvestmentPortfolio(initialInvestment, monthlyInvestment, stockReturnRate, years);
        console.log("Framtida värde på hyresgästens portfölj:", futureValueRent);

        // Visa resultat
        displayResults(futureValueBuy, futureValueRent, years);
    }

    function calculateAmortization(loanAmount, loanToValue, strictAmortization) {
        let annualAmortizationRate = 0;
        
        if (loanToValue > 0.7) {
            annualAmortizationRate = 0.02; // 2% amortering per år
        } else if (loanToValue > 0.5) {
            annualAmortizationRate = 0.01; // 1% amortering per år
        }

        if (strictAmortization) {
            annualAmortizationRate += 0.01; // Lägg till 1% för skärpt amortering
        }

        const annualAmortization = loanAmount * annualAmortizationRate;
        return annualAmortization / 12; // Månatlig amortering
    }

    function calculateFutureValue(initialValue, annualRate, years) {
        return initialValue * Math.pow(1 + annualRate, years);
    }

    function calculateInvestmentPortfolio(initialInvestment, monthlyInvestment, annualRate, years) {
        let futureValue = initialInvestment;
        const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;

        for (let i = 0; i < years * 12; i++) {
            futureValue = futureValue * (1 + monthlyRate) + monthlyInvestment;
        }

        return futureValue;
    }

    function displayResults(futureValueBuy, futureValueRent, years) {
        document.getElementById('buyResult').innerHTML = `<p>Framtida värdet efter ${years} år: ${futureValueBuy.toFixed(2)} kr</p>`;
        document.getElementById('rentResult').innerHTML = `<p>Framtida värdet efter ${years} år: ${futureValueRent.toFixed(2)} kr</p>`;
    }
});
