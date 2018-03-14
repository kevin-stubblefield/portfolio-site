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
        buttonElement.innerText = 'Requested';
    });
};