// todo-script.js

// Selectors
const taskInput = document.querySelector('#taskInput');
const addButton = document.querySelector('#addButton');
const taskList = document.querySelector('#taskList');
const clearCompletedButton = document.querySelector('#clearCompletedButton');
const filterSelect = document.querySelector('#filterSelect');

// Load tasks from local storage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Display tasks on load
document.addEventListener('DOMContentLoaded', displayTasks);

addButton.addEventListener('click', addTask);
clearCompletedButton.addEventListener('click', clearCompleted);
filterSelect.addEventListener('change', filterTasks);

function addTask() {
    const taskValue = taskInput.value.trim();
    if (taskValue === '') return;
    const task = { id: Date.now(), text: taskValue, completed: false };
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
    taskInput.value = '';
}

function displayTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.setAttribute('data-id', task.id);
        li.textContent = task.text;
        if (task.completed) li.classList.add('completed');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editTask(task.id));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        const completeButton = document.createElement('button');
        completeButton.textContent = task.completed ? 'Undo' : 'Complete';
        completeButton.addEventListener('click', () => completeTask(task.id));

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        li.appendChild(completeButton);
        taskList.appendChild(li);
    });
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);
    const newText = prompt('Edit task:', task.text);
    if (newText !== null) {
        task.text = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
    }
}

function completeTask(id) {
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

function filterTasks() {
    const filterValue = filterSelect.value;
    const listItems = taskList.querySelectorAll('li');
    listItems.forEach(item => {
        const taskCompleted = item.classList.contains('completed');
        if (filterValue === 'all') {
            item.style.display = '';
        } else if (filterValue === 'completed' && !taskCompleted) {
            item.style.display = 'none';
        } else if (filterValue === 'active' && taskCompleted) {
            item.style.display = 'none';
        }
    });
}