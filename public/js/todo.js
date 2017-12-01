document.querySelector('.projects li:first-of-type').className ='active';

var listItems = document.getElementsByTagName('li');

function onProjectClick(sender) {
    for (var i = 0; i < listItems.length; i++) {
        listItems[i].classList.remove('active');
    }

    sender.classList.add('active');
}