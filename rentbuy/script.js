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

        const stockReturnRates = getReturnRates('stock', stockReturnRate, years);
        const overallReturnRates = getReturnRates('overall', overallReturnRate, years);

        const results = calculateComparisonResults(purchasePrice, monthlyFee, monthlyRent, interestRate, loanToValue, strictAmortization, initialInvestment, stockReturnRates, overallReturnRates, years);

        displayResults(results, years);
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

    function calculateComparisonResults(purchasePrice, monthlyFee, monthlyRent, interestRate, loanToValue, strictAmortization, initialInvestment, stockReturnRates, overallReturnRates, years) {
        let loanAmount = purchasePrice * loanToValue;
        let ownedPropertyValue = purchasePrice;
        let rentPortfolioValue = initialInvestment;
        let totalCostOwn = purchasePrice * (1 - loanToValue); // Kontantinsats
        let totalCostRent = 0;
        let monthlyAmortization = getMonthlyAmortization(loanAmount, loanToValue, strictAmortization);

        for (let month = 0; month < years * 12; month++) {
            const year = Math.floor(month / 12);
            
            // Ägandekostnader
            const monthlyInterest = (loanAmount * interestRate) / 12;
            const monthlyCostOwn = monthlyInterest + monthlyAmortization + monthlyFee;
            totalCostOwn += monthlyCostOwn;

            // Hyra och investeringskostnader
            totalCostRent += monthlyRent;
            const monthlyInvestment = monthlyCostOwn - monthlyRent;
            
            // Uppdatera lånebelopp
            loanAmount -= monthlyAmortization;

            // Uppdatera värden
            const monthlyStockReturnRate = Math.pow(1 + stockReturnRates[year], 1/12) - 1;
            const monthlyPropertyReturnRate = Math.pow(1 + overallReturnRates[year], 1/12) - 1;

            ownedPropertyValue *= (1 + monthlyPropertyReturnRate);
            rentPortfolioValue = rentPortfolioValue * (1 + monthlyStockReturnRate) + monthlyInvestment;
        }

        const monthlySavingsRent = (totalCostOwn - totalCostRent) / (years * 12);

        return {
            futureValueOwn: ownedPropertyValue - loanAmount,
            futureValueRent: rentPortfolioValue,
            totalCostOwn: totalCostOwn,
            totalCostRent: totalCostRent,
            monthlySavingsRent: monthlySavingsRent
        };
    }

    function getMonthlyAmortization(loanAmount, loanToValue, strictAmortization) {
        let monthlyAmortization = 0;
        if (loanToValue > 0.5) monthlyAmortization = (loanAmount * 0.01) / 12;
        if (loanToValue > 0.7) monthlyAmortization = (loanAmount * 0.02) / 12;
        if (strictAmortization) monthlyAmortization += (loanAmount * 0.01) / 12;
        return monthlyAmortization;
    }

    function displayResults(results, years) {
        const { futureValueOwn, futureValueRent, totalCostOwn, totalCostRent, monthlySavingsRent } = results;

        const formatCurrency = (value) => value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

        document.getElementById('buyResult').innerHTML = `
            <p>Framtida värde efter ${years} år: ${formatCurrency(futureValueOwn)} kr</p>
            <p>Total boendekostnad: ${formatCurrency(totalCostOwn)} kr</p>
        `;

        document.getElementById('rentResult').innerHTML = `
            <p>Framtida portföljvärde efter ${years} år: ${formatCurrency(futureValueRent)} kr</p>
            <p>Total boendekostnad: ${formatCurrency(totalCostRent)} kr</p>
        `;

        document.getElementById('comparisonResult').innerHTML = `
            <p>Månatlig besparing vid hyra: ${formatCurrency(monthlySavingsRent)} kr</p>
            <p>Total besparing över ${years} år: ${formatCurrency(monthlySavingsRent * years * 12)} kr</p>
        `;

        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
    }
});