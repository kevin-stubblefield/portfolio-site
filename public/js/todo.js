document.querySelector('.projects li:first-of-type').className ='active';

var listItems = document.getElementsByTagName('li');

var projectDescription = document.getElementById('project-description');
var projectTasks = document.getElementById('project-tasks');
var projectHeader = document.getElementById('project-details-header');

for (var i = 0; i < projects.length; i++) {
    listItems[i].project = projects[i];
}

var selectedProject = listItems[0].project;

update();

function onMenuButtonClick(sender) {
    sender.classList.toggle('clicked');
    document.getElementById('menu').classList.toggle('hidden');
}

function onProjectClick(sender) {
    for (var i = 0; i < listItems.length; i++) {
        listItems[i].classList.remove('active');
    }

    sender.classList.add('active');
    selectedProject = sender.project;
    update();
}

function onNewProjectClick(sender) {

}

function onAddTaskClick(sender) {
    var newTaskDescription = 'New Task';
    var newListItem;

    axios.post(
        '/todo/' + sender.getAttribute('data-project-id'),
        { description: newTaskDescription }
    ).then(function(response) {
        newListItem = makeListItem({
            description: newTaskDescription,
            complete: false,
            id: response.data.id
        });

        if (newListItem) {
            enterEditMode(newListItem);
        }
    });
}

function onCompleteClick(parent) {
    parent.classList.add('complete');
    axios.patch('/todo/tasks/complete/' + parent.getAttribute('data-task-id'));
}

function onEditClick(parent) {
    enterEditMode(parent);
}

function onDeleteClick(parent) {
    projectTasks.removeChild(parent);
    axios.delete('/todo/tasks/' + parent.getAttribute('data-task-id'));
}

function update() {
    projectDescription.innerText = selectedProject.description;

    var addButton = document.getElementById('add-task-button');
    if (addButton) {
        projectHeader.removeChild(addButton);
    }

    if (isLoggedIn()) {
        var button = document.createElement('button');
        button.setAttribute('id', 'add-task-button');
        button.innerText = 'Add Task';
        button.setAttribute('onclick', 'onAddTaskClick(this)');
        button.setAttribute('data-project-id', selectedProject.id);
        button.className = 'button';
        projectHeader.appendChild(button);
    }
    
    while (projectTasks.firstChild) {
        projectTasks.removeChild(projectTasks.firstChild);
    }

    for (var i = 0; i < selectedProject.tasks.length; i++) {
        makeListItem(selectedProject.tasks[i]);
    }
}

function generateIcons() {
    var icons = document.createElement('div');
    icons.className = 'icons';
    
    var deleteIcon = document.createElement('i');
    deleteIcon.className = 'fa fa-trash-o';
    deleteIcon.setAttribute('onclick', 'onDeleteClick(this.parentNode.parentNode)');

    var editIcon = document.createElement('i');
    editIcon.className = 'fa fa-pencil-square-o';
    editIcon.setAttribute('onclick', 'onEditClick(this.parentNode.parentNode)');

    var completeIcon = document.createElement('i');
    completeIcon.className = 'fa fa-check';
    completeIcon.setAttribute('onclick', 'onCompleteClick(this.parentNode.parentNode)');

    icons.appendChild(completeIcon);
    icons.appendChild(editIcon);
    icons.appendChild(deleteIcon);

    return icons;
}

function makeListItem(body) {
    var li = document.createElement('li');
    var text = document.createTextNode(
        body.description
    );

    var span = document.createElement('span');
    
    span.appendChild(text);
    li.appendChild(span);

    if (isLoggedIn()) {
        var icons = generateIcons();
        li.appendChild(icons);
    }

    li.className = 'project-task';
    if (body.complete) {
        li.classList.add('complete');
    }
    li.setAttribute('data-task-id', body.id);
    projectTasks.appendChild(li);

    return li;
}

function enterEditMode(parent) {
    parent.lastChild.classList.add('hidden');
    var oldText = parent.firstChild.innerText;
    var input = document.createElement('input');
    input.className = 'input';
    input.setAttribute('placeholder', oldText);
    input.onkeypress = function(event) {
        if (!event) event = window.event;
        var keyCode = event.keyCode || event.which;
        if (keyCode === 13) {
            parent.lastChild.classList.remove('hidden');
            if (this.value === '') {
                parent.firstChild.innerText = oldText;
            } else {
                parent.firstChild.innerText = this.value;
                axios.patch(
                    '/todo/tasks/' + parent.getAttribute('data-task-id'),
                    { description: this.value }
                );
            }
            return false;
        } else if (keyCode === 27) {
            parent.lastChild.classList.remove('hidden');
            parent.firstChild.innerText = oldText;
            return false;
        }
    }
    
    parent.firstChild.innerHTML = '';
    parent.firstChild.appendChild(input);
    input.focus();
}

function isLoggedIn() {
    return Object.keys(user).length > 0;
}