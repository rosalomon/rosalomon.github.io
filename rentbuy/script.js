document.addEventListener('DOMContentLoaded', function() {
    const göteborgYearlyRent = 1321;
    const västraGötalandYearlyRent = 1227;
    let selectedLocation = null;

    document.querySelectorAll('.location-btn').forEach(button => {
        button.addEventListener('click', function() {
            toggleActiveLocationButton(this);
            selectedLocation = this.getAttribute('data-location');
        });
    });

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

    function toggleActiveLocationButton(activeButton) {
        const buttons = document.querySelectorAll('.location-btn');
        buttons.forEach(button => {
            if (button === activeButton) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    function calculateValues() {
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
        const monthlyFee = parseFloat(document.getElementById('monthlyFee').value);
        const monthlyRent = parseFloat(document.getElementById('monthlyRent').value);
        const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
        const loanToValue = parseFloat(document.getElementById('loanToValue').value) / 100;
        const size = parseFloat(document.getElementById('size').value);
        const overallReturnRate = parseFloat(document.getElementById('overallReturnRate').value) / 100;
        const stockReturnRate = parseFloat(document.getElementById('stockReturnRate').value) / 100;
        const yearsButton = document.querySelector('.year-btn.active');
        const years = yearsButton ? parseInt(yearsButton.getAttribute('data-years')) : 0;

        if (isNaN(purchasePrice) || isNaN(monthlyFee) || isNaN(monthlyRent) || isNaN(interestRate) || isNaN(loanToValue) || isNaN(size) || isNaN(overallReturnRate) || isNaN(stockReturnRate) || years === 0 || !selectedLocation) {
            alert('Var god fyll i alla fält korrekt.');
            return;
        }

        const yearlyRent = selectedLocation === 'goteborg' ? göteborgYearlyRent : västraGötalandYearlyRent;
        const calculatedMonthlyRent = (yearlyRent * size) / 12;
        if (isNaN(monthlyRent)) {
            monthlyRent = calculatedMonthlyRent;
        }

        const initialInvestment = purchasePrice * (1 - loanToValue);
        let futureValueBuy = purchasePrice;
        let futureValueRent = initialInvestment;

        for (let i = 1; i <= years; i++) {
            futureValueBuy = futureValueBuy * (1 + overallReturnRate);
            futureValueRent = futureValueRent * (1 + stockReturnRate) + (monthlyRent * 12);
        }

        document.getElementById('buyResult').textContent = `Framtida värde: ${futureValueBuy.toFixed(2)} kr`;
        document.getElementById('rentResult').textContent = `Framtida värde: ${futureValueRent.toFixed(2)} kr`;
        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
    }
});
