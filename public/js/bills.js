let onPaidClicked = function(payment) {
    let amountElement = document.getElementById('pay-' + payment.billId + '-' + payment.id);
    axios.post('/bills/payments', {
        billId: payment.billId,
        amount: parseFloat(amountElement.value),
        paid_by: payment.paidBy,
        paid_to: payment.paidTo.id,
        status: 'Awaiting Verification'
    })
    .then(function(response) {
        console.log(response.data);
        let payment = response.data;
        let owedElement = document.getElementById('owed-' + payment.billId);
        let uiAmount = parseFloat(owedElement.innerText.substr(1));
        owedElement.innerText = '$' + (uiAmount - parseFloat(payment.amount)).toFixed(2);
    });
};

let onBillClicked = function(bill) {
    let paymentsElement = document.getElementById('payments-' + bill.id);
    if (!paymentsElement) {
        return;
    }
    paymentsElement.classList.toggle('hide');
}

let onVerifyClicked = function(payment) {
    axios.patch('/bills/payments/' + payment.id, {
        status: 'Verified'
    })
    .then(function(response) {
        let payment = response.data;
        let buttonElement = document.getElementById('verify-' + payment.id);
        buttonElement.parentElement.innerText = 'Verified';
        let countElement = document.getElementById('awaiting-' + payment.bill.id);
        if (!countElement) {
            return;
        }
        countElement.innerHTML = '<span>' + (parseInt(countElement.innerText) - 1).toString() + '</span>';
        if (countElement.innerText === '0') {
            countElement.innerText = '';
        }
    });
}