document.querySelector('.projects li:first-of-type').className ='active';

var listItems = document.getElementsByTagName('li');

var projectDescription = document.getElementById('project-description');
var projectTasks = document.getElementById('project-tasks');

for (var i = 0; i < projects.length; i++) {
    listItems[i].project = projects[i];
}

var selectedProject = listItems[0].project;

update();

function onProjectClick(sender) {
    for (var i = 0; i < listItems.length; i++) {
        listItems[i].classList.remove('active');
    }

    sender.classList.add('active');
    selectedProject = sender.project;
    update();
}

function onCompleteClick(parent) {
    parent.classList.add('complete');
    axios.patch('/todo/tasks/complete/' + parent.getAttribute('data-task-id'));
}

function onEditClick(parent) {
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
        }
    }
    
    parent.firstChild.innerHTML = '';
    parent.firstChild.appendChild(input);
}

function onDeleteClick(parent) {
    projectTasks.removeChild(parent);
    axios.delete('/todo/tasks/' + parent.getAttribute('data-task-id'));
}

function update() {
    projectDescription.innerText = selectedProject.description;
    
    while (projectTasks.firstChild) {
        projectTasks.removeChild(projectTasks.firstChild);
    }

    for (var i = 0; i < selectedProject.tasks.length; i++) {
        var li = document.createElement('li');
        var text = document.createTextNode(
            selectedProject.tasks[i].description
        );

        var span = document.createElement('span');
        
        span.appendChild(text);
        li.appendChild(span);

        if (Object.keys(user).length > 0) {
            var icons = generateIcons();
            li.appendChild(icons);
        }

        li.className = 'project-task';
        if (selectedProject.tasks[i].complete) {
            li.classList.add('complete');
        }
        li.setAttribute('data-task-id', selectedProject.tasks[i].id);
        projectTasks.appendChild(li);
    }
}

function generateIcons() {
    var icons = document.createElement('div');
    
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