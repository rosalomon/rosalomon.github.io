function calculate() {
    var loanAmount = document.getElementById('loanAmount').value;
    var interestRate = document.getElementById('interestRate').value;
    var currentInterestCost = loanAmount * (interestRate / 100);
    var newInterestRate = interestRate - 0.25;
    var newInterestCost = loanAmount * (newInterestRate / 100);
    var difference = currentInterestCost - newInterestCost;
    document.getElementById('output').innerHTML = 'Nuvarande räntekostnad: ' + currentInterestCost.toFixed(2) + '<br>' +
                                                   'Ny räntekostnad vid 0.25 procentenheter lägre ränta: ' + newInterestCost.toFixed(2) + '<br>' +
                                                   'Skillnad: ' + difference.toFixed(2);

    // Skicka ett meddelande till föräldrasidan med den nya höjden
    var widgetHeight = document.querySelector('.widget').offsetHeight;
    window.parent.postMessage({ 'widget-height': widgetHeight }, '*');
}
