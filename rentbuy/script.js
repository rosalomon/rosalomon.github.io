document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.year-btn').forEach(button => {
        button.addEventListener('click', function() {
            toggleActiveYearButton(this);
        });
    });

    document.getElementById('interestRate').addEventListener('input', function() {
        document.getElementById('interestRateValue').textContent = this.value;
    });

    document.getElementById('loanToValue').addEventListener('input', function() {
        document.getElementById('loanToValueValue').textContent = this.value;
    });

    document.getElementById('overallReturnRate').addEventListener('input', function() {
        document.getElementById('overallReturnRateValue').textContent = this.value;
    });

    document.getElementById('stockReturnRate').addEventListener('input', function() {
        document.getElementById('stockReturnRateValue').textContent = this.value;
    });

    document.getElementById('calculateBtn').addEventListener('click', function() {
        calculateValues();
    });

    document.getElementById('overallReturnRateArrow').addEventListener('click', function() {
        toggleIndividualSliders('overall');
    });

    document.getElementById('stockReturnRateArrow').addEventListener('click', function() {
        toggleIndividualSliders('stock');
    });

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

    function toggleIndividualSliders(type) {
        const yearsButton = document.querySelector('.year-btn.active');
        const years = yearsButton ? parseInt(yearsButton.getAttribute('data-years')) : 0;
        const container = type === 'overall' ? document.getElementById('individualOverallReturnRates') : document.getElementById('individualStockReturnRates');
        const arrowButton = type === 'overall' ? document.getElementById('overallReturnRateArrow') : document.getElementById('stockReturnRateArrow');
        const mainSlider = type === 'overall' ? document.getElementById('overallReturnRate') : document.getElementById('stockReturnRate');
        const mainSliderValue = type === 'overall' ? parseFloat(document.getElementById('overallReturnRate').value) : parseFloat(document.getElementById('stockReturnRate').value);

        if (years === 0) {
            alert('Välj antal år först.');
            return;
        }

        if (container.classList.contains('hidden')) {
            container.classList.remove('hidden');
            container.innerHTML = '';

            for (let i = 1; i <= years; i++) {
                const label = document.createElement('label');
                label.textContent = `${type === 'overall' ? 'Värdeökningen' : 'Avkastningen'} år ${i}:`;

                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = '-100';
                slider.max = '100';
                slider.step = '0.1';
                slider.value = mainSliderValue;
                slider.classList.add(`${type}-individual-return-rate`);

                const span = document.createElement('span');
                span.textContent = mainSliderValue;

                slider.addEventListener('input', function() {
                    span.textContent = this.value;
                });

                container.appendChild(label);
                container.appendChild(slider);
                container.appendChild(span);
                container.appendChild(document.createElement('br'));
            }

            arrowButton.textContent = '▲';
            mainSlider.disabled = true;
        } else {
            container.classList.add('hidden');
            container.innerHTML = '';
            arrowButton.textContent = '▼';
            mainSlider.disabled = false;
        }
    }

    function calculateValues() {
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value.replace(/\s+/g, ''));
        const monthlyFee = parseFloat(document.getElementById('monthlyFee').value.replace(/\s+/g, ''));
        let monthlyRent = parseFloat(document.getElementById('monthlyRent').value.replace(/\s+/g, ''));
        const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
        const loanToValue = parseFloat(document.getElementById('loanToValue').value) / 100;
        const size = parseFloat(document.getElementById('size').value);
        const overallReturnRate = parseFloat(document.getElementById('overallReturnRate').value) / 100;
        const stockReturnRate = parseFloat(document.getElementById('stockReturnRate').value) / 100;
        const strictAmortization = document.getElementById('strictAmortization').checked;
        const initialInvestmentField = document.getElementById('initialInvestment');
        const yearsButton = document.querySelector('.year-btn.active');
        const years = yearsButton ? parseInt(yearsButton.getAttribute('data-years')) : 0;

        if (isNaN(monthlyRent) || isNaN(purchasePrice) || isNaN(monthlyFee) || isNaN(interestRate) || isNaN(loanToValue) || isNaN(size) || isNaN(overallReturnRate) || isNaN(stockReturnRate) || years === 0) {
            alert('Var god fyll i alla fält korrekt.');
            return;
        }

        let initialInvestment = parseFloat(initialInvestmentField.value.replace(/\s+/g, ''));
        if (isNaN(initialInvestment)) {
            alert('Var god fyll i en korrekt initial investering.');
            return;
        }

        let futureValueBuy = purchasePrice;
        let futureValueRent = initialInvestment;

        let loanAmount = purchasePrice * loanToValue;
        let totalInterestPaid = 0;
        let totalAmortizationPaid = 0;
        let monthlyAmortization = 0;

        if (loanToValue > 0.5) {
            monthlyAmortization = (loanAmount * 0.01) / 12;
        }

        // Beräkningar per månad
        const monthlyInterestRate = interestRate / 12;
        const monthlyStockReturnRate = (1 + stockReturnRate) ** (1 / 12) - 1;

        let totalMonthlyInvestment = 0;  // Total monthly investment tracker

        for (let i = 0; i < years * 12; i++) {
            const monthlyInterestPayment = loanAmount * monthlyInterestRate;
            const monthlyHousingCost = monthlyInterestPayment + monthlyAmortization + monthlyFee;
            const monthlyInvestment = monthlyHousingCost - monthlyRent;

            if (loanToValue > 0.5) {
                loanAmount -= monthlyAmortization;
            }
            
            totalInterestPaid += monthlyInterestPayment;
            totalAmortizationPaid += monthlyAmortization;

            totalMonthlyInvestment += monthlyInvestment;  // Track total investment for debugging

            if (monthlyInvestment > 0) {
                futureValueRent = futureValueRent * (1 + monthlyStockReturnRate) + monthlyInvestment;
            } else {
                futureValueRent *= (1 + monthlyStockReturnRate);
            }
        }

        // Beräkning av framtida värde för börsportföljen efter n år
        futureValueRent = futureValueRent * (1 + stockReturnRate) ** years;

        // Framtida värde för bostadsrätten
        futureValueBuy = purchasePrice * (1 + overallReturnRate) ** years;

        // Debug output
        console.log("Total Monthly Investment:", totalMonthlyInvestment);
        console.log("Future Value Rent:", futureValueRent);

        document.getElementById('buyResult').innerHTML = `
            <p>Framtida värdet ${years} år: ${futureValueBuy.toFixed(2)} kr</p>
            <p>Utvecklingen i kronor per år: ${(futureValueBuy / years).toFixed(2)} kr</p>
        `;
        document.getElementById('rentResult').innerHTML = `
            <p>Framtida värdet ${years} år: ${futureValueRent.toFixed(2)} kr</p>
            <p>Total räntekostnad: ${totalInterestPaid.toFixed(2)} kr</p>
        `;
        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
    }
});
