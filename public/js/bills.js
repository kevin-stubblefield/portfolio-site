let onPaidClicked = function(payment) {
    axios.patch('/bills/payments/' + payment.id, {
        status: 'Awaiting Verification'
    })
    .then(function(response) {
        console.log(response.data);
        let payment = response.data;
        let statusElement = document.getElementById('status-' + payment.id);
        statusElement.innerText = payment.status;
        let buttonElement = document.getElementById('button-' + payment.id);
        buttonElement.parentElement.innerText = 'Requested';
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
        status: 'Paid'
    })
    .then(function(response) {
        let payment = response.data;
        let buttonElement = document.getElementById('verify-' + payment.id);
        buttonElement.parentElement.innerText = 'Paid';
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