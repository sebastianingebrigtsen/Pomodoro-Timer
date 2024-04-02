// Event listener for DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
  // DOM elements
  const addButton = document.getElementById('addTaskButton');
  const taskInput = document.getElementById('newTaskInput');
  const todoList = document.getElementById('todoList');
  const showCompletedTasksButton = document.getElementById('showCompletedTasksButton');
  let showCompletedOnly = true;

  // Save tasks to local storage
  function saveTasks() {
    // Extract tasks from todo list and save them
    const tasks = Array.from(document.querySelectorAll('.todo-item')).map((task) => {
      return {
        text: task.querySelector('.task-text').textContent,
        completed: task.classList.contains('completed'),
      };
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Load tasks from local storage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach((task) => addTask(task.text, task.completed));
  }

  // Initial load of tasks and update task visibility
  loadTasks();
  updateTaskVisibility();

  // Event listener for adding new task
  addButton.addEventListener('click', () => {
    if (taskInput.value.trim() !== '') {
      addTask(taskInput.value.trim());
      taskInput.value = '';
      saveTasks();
    }
  });

  // Event listener for adding new task on pressing Enter
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addButton.click();
    }
  });

  // Update task visibility based on showCompletedOnly flag
  function updateTaskVisibility() {
    const todoList = document.getElementById('todoList');
    let tasks = Array.from(todoList.children);

    tasks.forEach((task) => {
      if (!showCompletedOnly && task.classList.contains('completed')) {
        task.style.display = 'none';
      } else {
        task.style.display = '';
      }
    });
  }

  // Event listener for sorting completed tasks
  document.getElementById('sortCompletedTasks').addEventListener('click', sortCompletedTasks);

  // Function to sort completed tasks and update UI
  function sortCompletedTasks() {
    const tasks = Array.from(document.querySelectorAll('.todo-item'));

    tasks.sort((a, b) => {
      let aCompleted = a.classList.contains('completed');
      let bCompleted = b.classList.contains('completed');
      return aCompleted === bCompleted ? 0 : aCompleted ? -1 : 1;
    });

    todoList.innerHTML = '';

    tasks.forEach((task) => todoList.appendChild(task));
  }

  // Function to add a new task to the list
  function addTask(text, completed = false) {
    // Create task elements
    const li = document.createElement('li');
    // Add classes for styling and completion state
    li.classList.add('todo-item');
    if (completed) {
      li.classList.add('completed');
    }

    // Create check circle element for completion indicator
    const checkCircle = document.createElement('span');
    checkCircle.classList.add('check-circle');
    if (completed) {
      checkCircle.classList.add('completed-circle');
    }

    // Create check icon element
    const checkIcon = document.createElement('i');
    checkIcon.classList.add('fa', 'fa-check');
    checkIcon.style.display = completed ? 'inline' : 'none';
    checkCircle.appendChild(checkIcon);

    // Create task text element
    const taskText = document.createElement('span');
    taskText.textContent = text;
    taskText.classList.add('task-text');

    // Create action buttons container
    const actionButtons = document.createElement('div');
    actionButtons.classList.add('action-buttons');

    // Create edit button
    const editButton = document.createElement('button');
    editButton.classList.add('edit-button');
    const editIcon = document.createElement('i');
    editIcon.classList.add('fa-solid', 'fa-pencil');
    editButton.appendChild(editIcon);

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('fa-solid', 'fa-trash');
    deleteButton.appendChild(deleteIcon);

    // Event listeners for completion, deletion, and editing
    checkCircle.addEventListener('click', () => {
      li.classList.toggle('completed');
      checkCircle.classList.toggle('completed-circle');
      checkIcon.style.display = li.classList.contains('completed') ? 'inline' : 'none';
      saveTasks();
      updateTaskVisibility();
    });

    deleteButton.addEventListener('click', () => {
      li.remove();
      saveTasks();
    });

    editButton.addEventListener('click', function (event) {
      event.stopPropagation();
      triggerEdit(taskText, li, editButton);
    });

    taskText.addEventListener('dblclick', () => {
      triggerEdit(taskText, li, editButton);
    });

    // Append elements to task item
    actionButtons.appendChild(editButton);
    actionButtons.appendChild(deleteButton);
    li.appendChild(checkCircle);
    li.appendChild(taskText);
    li.appendChild(actionButtons);

    // Append task item to the list
    document.getElementById('todoList').appendChild(li);
  }

  // Function to trigger task editing
  function triggerEdit(taskText, li, editButton) {
    if (!li.querySelector('input.edit-input')) {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = taskText.textContent;
      input.classList.add('edit-input');
      li.insertBefore(input, taskText);
      li.removeChild(taskText);

      editButton.innerHTML = '';
      const saveIcon = document.createElement('i');
      saveIcon.classList.add('fa-solid', 'fa-check');
      editButton.appendChild(saveIcon);

      input.focus();

      // Function to save edited task
      const saveEdit = () => {
        taskText.textContent = input.value;
        setTimeout(() => {
          li.replaceChild(taskText, input);
          editButton.innerHTML = '';
          const editIcon = document.createElement('i');
          editIcon.classList.add('fa-solid', 'fa-pencil');
          editButton.appendChild(editIcon);
          saveTasks();
        }, 100);
      };

      // Event listener for outside click to save edited task
      const outsideClickHandler = (event) => {
        if (!li.contains(event.target)) {
          saveEdit();
          document.removeEventListener('click', outsideClickHandler);
        }
      };

      setTimeout(() => {
        document.addEventListener('click', outsideClickHandler);
      }, 0);

      // Event listeners for blur and Enter key to save edited task
      input.addEventListener('blur', saveEdit);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          saveEdit();
          input.blur();
        }
      });

      editButton.removeEventListener('click', outsideClickHandler);
    }
  }

  // Set initial state and event listeners for showing completed tasks
  const toggleCompletedTasksButton = document.getElementById('toggleCompletedTasks');
  toggleCompletedTasksButton.innerHTML = '<i class="fa-solid fa-eye-slash"></i> <span>Hide Completed Tasks</span>';
  const deleteCompletedTasksButton = document.getElementById('deleteCompletedTasks');
  const deleteAllTasksButton = document.getElementById('deleteAllTasks');
  const dropdownContent = document.getElementById('myDropdown');

  // Event listener for toggling dropdown menu
  document.querySelector('.dropbtn').addEventListener('click', () => {
    dropdownContent.classList.toggle('show');
  });

  // Event listener for toggling completed tasks visibility
  toggleCompletedTasksButton.addEventListener('click', (e) => {
    e.preventDefault();
    showCompletedOnly = !showCompletedOnly;
    updateTaskVisibility();

    if (showCompletedOnly) {
      toggleCompletedTasksButton.innerHTML = '<i class="fa-solid fa-eye-slash"></i> <span>Hide Completed Tasks</span>';
    } else {
      toggleCompletedTasksButton.innerHTML = '<i class="fa-solid fa-eye"></i> <span>Show Completed Tasks</span>';
    }

    dropdownContent.classList.remove('show');
  });

  // Event listener for deleting completed tasks
  deleteCompletedTasksButton.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.todo-item.completed').forEach((task) => task.remove());
    saveTasks();
    dropdownContent.classList.remove('show');
  });

  // Event listener for deleting all tasks
  deleteAllTasksButton.addEventListener('click', (e) => {
    e.preventDefault();

    const isConfirmed = confirm('Are you sure you want to delete all tasks?');

    if (isConfirmed) {
      document.querySelectorAll('.todo-item').forEach((task) => task.remove());
      saveTasks();
    }

    dropdownContent.classList.remove('show');
  });

  // Event listener for closing dropdown menu when clicking outside
  window.onclick = (event) => {
    if (!event.target.matches('.dropbtn')) {
      if (dropdownContent.classList.contains('show')) {
        dropdownContent.classList.remove('show');
      }
    }
  };
});
