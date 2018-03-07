document.querySelector('.projects li:first-of-type').className ='active';

var projectList = document.getElementsByClassName('projects')[0];
var listItems = projectList.children;

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

    axios.get('/todo/' + sender.project.id)
        .then(function(response) {
            sender.project = response.data;
            sender.classList.add('active');
            selectedProject = sender.project;
            update();
        });
}

function onNewProjectClick() {
    var li = makeProjectListItem();
    li.classList.add('active');

    li.firstChild.onkeypress = function(event) {
        if (!event) event = window.event;
        var keyCode = event.keyCode || event.which;
        if (keyCode === 13) {
            if (this.value === '') {
                li.innerText = defaultName;
            } else {
                li.innerText = this.value;
                createNewProject(this.value, li);
            }
            return false;
        } else if (keyCode === 27) {
            li.innerText = defaultName;
            return false;
        }
    }

    li.firstChild.focus();
}

function createNewProject(title, li) {
    axios.post('/todo', {
        title: title,
        description: 'New Project Description',
        category: 'development'
    }).then(function(response) {
        li.project = response.data;
        projectList.insertBefore(li, null);
        selectedProject = li.project;
        selectedProject.tasks = [];
        update();
    });
}

function onEditProjectClick() {
    var toEdit;
    for (var i = 0; i < listItems.length; i++) {
        if (listItems[i].project.id === selectedProject.id) {
            toEdit = listItems[i];
            break;
        }
    }
    enterEditProjectMode(toEdit, true);
}

function onProjectDescriptionClick(sender) {
    enterEditProjectMode(sender, false);
}

function onDeleteProjectClick() {
    axios.delete('/todo/' + selectedProject.id);
    var toRemove;
    var nextProject;
    for (var i = 0; i < listItems.length; i++) {
        if (listItems[i].project.id === selectedProject.id) {
            toRemove = listItems[i];
            nextProject = listItems[i + 1] || listItems[i - 1] || {};
            break;
        }
    }
    projectList.removeChild(toRemove);
    nextProject.classList.add('active');
    selectedProject = nextProject.project;
    update();
}

function onAddTaskClick(sender) {
    var newTaskDescription = 'New Task';
    var newListItem;

    axios.post(
        '/todo/' + sender.getAttribute('data-project-id'),
        { description: newTaskDescription }
    ).then(function(response) {
        newListItem = makeTaskListItem({
            description: newTaskDescription,
            complete: false,
            id: response.data.id
        });

        if (newListItem) {
            enterEditTaskMode(newListItem);
        }
    });
}

function onCompleteClick(parent) {
    parent.classList.add('complete');
    axios.patch('/todo/tasks/complete/' + parent.getAttribute('data-task-id'));
}

function onEditClick(parent) {
    enterEditTaskMode(parent);
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

    if (isLoggedIn() && isAuthorized()) {
        projectDescription.setAttribute('onclick', 'onProjectDescriptionClick(this)');
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
        makeTaskListItem(selectedProject.tasks[i]);
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

function makeTaskListItem(body) {
    var li = document.createElement('li');
    var text = document.createTextNode(
        body.description
    );

    var span = document.createElement('span');
    
    span.appendChild(text);
    li.appendChild(span);

    if (isLoggedIn() && isAuthorized()) {
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

function makeProjectListItem() {
    var li = document.createElement('li');
    var input = document.createElement('input');
    input.className = 'input';

    var defaultName = 'New Project';
    var parent = li;

    input.setAttribute('placeholder', defaultName);
    
    
    li.appendChild(input);
    projectList.appendChild(li);
    for (var i = 0; i < listItems.length; i++) {
        listItems[i].classList.remove('active');
    }

    return li;
}

function enterEditTaskMode(parent) {
    parent.lastChild.classList.add('hidden');
    var oldText = parent.firstChild.innerText;
    var input = document.createElement('input');
    input.className = 'input';
    input.setAttribute('value', oldText);
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

function enterEditProjectMode(parent, title) {
    var oldText = parent.innerText;
    var input = document.createElement('input');
    input.className = 'input';
    input.setAttribute('value', oldText);
    input.onkeypress = function(event) {
        if (!event) event = window.event;
        var keyCode = event.keyCode || event.which;
        if (keyCode === 13) {
            if (this.value === '') {
                parent.innerText = oldText;
            } else {
                parent.innerText = this.value;
                var body = {};
                if (title) {
                    body.title = this.value;
                } else {
                    body.description = this.value;
                }
                axios.patch(
                    '/todo/' + selectedProject.id,
                    body
                );
            }
            return false;
        } else if (keyCode === 27) {
            parent.innerText = oldText;
            return false;
        }
    }
    
    parent.innerHTML = '';
    parent.appendChild(input);
    input.focus();
}

function isLoggedIn() {
    return Object.keys(user).length > 0;
}

function isAuthorized() {
    return user.role > 0;
}