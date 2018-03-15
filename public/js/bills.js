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

let onAddBillClicked = function() {
    let tableBody = document.getElementById('bills');
    
    let newBillRow = document.createElement('tr');
    newBillRow.classList.add('bill', 'odd');

    let amountTD = document.createElement('td');
    let newBillAmountInput = document.createElement('input');
    newBillAmountInput.classList.add('pay-input');
    newBillAmountInput.id = 'new-amount';
    amountTD.appendChild(newBillAmountInput);

    let categoryTD = document.createElement('td');
    let newBillCategoryInput = document.createElement('select');
    newBillCategoryInput.classList.add('pay-input');
    newBillCategoryInput.id = 'new-category';

    let categories = ['Electric', 'Gas', 'Wastewater', 'Internet', 'Garbage'];
    for (let i = 0; i < categories.length; i++) {
        let option = document.createElement('option');
        option.value = categories[i];
        option.innerText = categories[i];
        newBillCategoryInput.appendChild(option);
        categoryTD.appendChild(newBillCategoryInput);
    }
    
    let imageTD = document.createElement('td');
    let newBillImageInput = document.createElement('input');
    newBillImageInput.setAttribute('type', 'file');
    newBillImageInput.setAttribute('disabled', 'disabled');
    newBillImageInput.id = 'new-image';
    imageTD.appendChild(newBillImageInput);

    let blankTD = document.createElement('td');
    let newBillSaveButton = document.createElement('button');
    newBillSaveButton.classList.add('button');
    newBillSaveButton.innerText = 'Save';
    newBillSaveButton.onclick = onSaveClicked;
    blankTD.appendChild(newBillSaveButton);

    newBillRow.appendChild(amountTD);
    newBillRow.appendChild(categoryTD);
    newBillRow.appendChild(imageTD);
    newBillRow.appendChild(blankTD);

    tableBody.appendChild(newBillRow);
}

let onSaveClicked = function() {
    let amount = document.getElementById('new-amount');
    let category = document.getElementById('new-category');
    let image = document.getElementById('new-image');
    let userId = document.getElementById('user');

    axios.post('/bills', {
        amount: parseFloat(amount.value),
        category: category.value,
        userId: userId.value
    })
    .then(function(response) {
        location.reload();
    });
}