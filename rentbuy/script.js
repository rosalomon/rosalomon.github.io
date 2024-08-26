document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculateBtn').addEventListener('click', calculateValues);

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

    function getSelectedYears() {
        const yearsButton = document.querySelector('.year-btn.active');
        return yearsButton ? parseInt(yearsButton.getAttribute('data-years')) : 0;
    }

    function displayResults(futureValueBuy, futureValueRent, years) {
        document.getElementById('buyResult').innerHTML = `<p>Framtida värdet efter ${years} år: ${futureValueBuy.toFixed(2)} kr</p>`;
        document.getElementById('rentResult').innerHTML = `<p>Framtida värdet efter ${years} år: ${futureValueRent.toFixed(2)} kr</p>`;
    }
});
