let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("task-list");
const taskTitle = document.getElementById("task-title");
const taskDesc = document.getElementById("task-desc");
const taskReminder = document.getElementById("task-reminder");
const addTaskBtn = document.getElementById("add-task");
const filterButtons = document.querySelectorAll(".filter-buttons button");

let currentFilter = "all";

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks.filter(task => {
    if (currentFilter === "completed") return task.completed;
    if (currentFilter === "pending") return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const taskDetails = document.createElement("div");
    taskDetails.className = `task-details ${task.completed ? "completed" : ""}`;
    taskDetails.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      ${task.reminder ? `<small>⏰ Reminder: ${new Date(task.reminder).toLocaleString()}</small>` : ""}
    `;

    const taskButtons = document.createElement("div");
    taskButtons.className = "task-buttons";
    taskButtons.innerHTML = `
      <button class="complete">${task.completed ? "Undo" : "Complete"}</button>
      <button class="edit">Edit</button>
      <button class="delete">Delete</button>
    `;

    // Complete/Undo
    taskButtons.querySelector(".complete").onclick = () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
    };

    // Edit
    taskButtons.querySelector(".edit").onclick = () => {
      const newTitle = prompt("Edit Task Title", task.title);
      const newDesc = prompt("Edit Task Description", task.description);
      const newReminder = prompt("Edit Reminder (YYYY-MM-DDTHH:MM)", task.reminder || "");
      if (newTitle && newDesc !== null) {
        tasks[index].title = newTitle;
        tasks[index].description = newDesc;
        tasks[index].reminder = newReminder || null;
        tasks[index].reminded = false;
        saveTasks();
      }
    };

    // Delete
    taskButtons.querySelector(".delete").onclick = () => {
      if (confirm("Are you sure you want to delete this task?")) {
        tasks.splice(index, 1);
        saveTasks();
      }
    };

    li.appendChild(taskDetails);
    li.appendChild(taskButtons);
    taskList.appendChild(li);
  });
}

// Save to LocalStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Add Task
addTaskBtn.addEventListener("click", () => {
  const title = taskTitle.value.trim();
  const description = taskDesc.value.trim();
  const reminder = taskReminder.value;

  if (title && description) {
    tasks.push({
      title,
      description,
      reminder,
      completed: false,
      reminded: false,
    });

    taskTitle.value = "";
    taskDesc.value = "";
    taskReminder.value = "";
    saveTasks();
  } else {
    alert("Please enter both title and description.");
  }
});

// Filter Tasks
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-buttons .active").classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    renderTasks();
  });
});

// Reminder Checker
function checkReminders() {
  const now = new Date().toISOString();

  tasks.forEach((task, index) => {
    if (
      task.reminder &&
      !task.completed &&
      !task.reminded &&
      new Date(task.reminder).toISOString() <= now
    ) {
      alert(`🔔 Reminder: ${task.title}\n${task.description}`);
      tasks[index].reminded = true;
      saveTasks();
    }
  });
}

setInterval(checkReminders, 30000); // Check every 30 seconds

renderTasks();
