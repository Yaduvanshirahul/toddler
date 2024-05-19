document.getElementById('add-module-btn').addEventListener('click', addModule);

let moduleCount = 0;
let resourceCount = 0;

function addModule() {
    moduleCount++;
    const moduleId = `module-${moduleCount}`;
    
    const module = document.createElement('div');
    module.classList.add('module');
    module.id = moduleId;
    module.draggable = true;

    module.innerHTML = `
        <div class="module-header">
            <span class="module-title" contenteditable="true">Module ${moduleCount}</span>
            <div class="module-actions">
                <button onclick="addResource('${moduleId}')">Add Resource</button>
                <button onclick="addLink('${moduleId}')">Add Link</button>
                <button onclick="deleteModule('${moduleId}')">Delete</button>
            </div>
        </div>
        <ul class="resources-list"></ul>
    `;

    module.addEventListener('dragstart', dragStart);
    module.addEventListener('dragover', dragOver);
    module.addEventListener('drop', drop);
    
    document.getElementById('modules-container').appendChild(module);
}

function addResource(moduleId) {
    resourceCount++;
    const resourceId = `resource-${resourceCount}`;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.classList.add('hidden');
    input.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const resource = document.createElement('li');
            resource.classList.add('resource');
            resource.id = resourceId;
            resource.draggable = true;

            resource.innerHTML = `
                <span contenteditable="true">${file.name}</span>
                <button onclick="deleteResource('${resourceId}')">Delete</button>
            `;
            
            resource.addEventListener('dragstart', dragStart);
            resource.addEventListener('dragover', dragOver);
            resource.addEventListener('drop', drop);

            document.querySelector(`#${moduleId} .resources-list`).appendChild(resource);
        }
    });

    input.click();
}

function addLink(moduleId) {
    const url = prompt('Enter the URL:');
    if (url) {
        resourceCount++;
        const resourceId = `resource-${resourceCount}`;

        const resource = document.createElement('li');
        resource.classList.add('resource');
        resource.id = resourceId;
        resource.draggable = true;

        resource.innerHTML = `
            <a href="${url}" target="_blank">${url}</a>
            <button onclick="deleteResource('${resourceId}')">Delete</button>
        `;

        resource.addEventListener('dragstart', dragStart);
        resource.addEventListener('dragover', dragOver);
        resource.addEventListener('drop', drop);

        document.querySelector(`#${moduleId} .resources-list`).appendChild(resource);
    }
}

function deleteModule(moduleId) {
    const module = document.getElementById(moduleId);
    module.remove();
}

function deleteResource(resourceId) {
    const resource = document.getElementById(resourceId);
    resource.remove();
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const draggedElementId = event.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(draggedElementId);

    if (event.target.classList.contains('resources-list')) {
        event.target.appendChild(draggedElement);
    } else if (event.target.classList.contains('resource')) {
        event.target.parentElement.insertBefore(draggedElement, event.target.nextSibling);
    } else if (event.target.classList.contains('module')) {
        const modulesContainer = document.getElementById('modules-container');
        modulesContainer.insertBefore(draggedElement, event.target.nextSibling);
    }
}
