let tasks = [];
let editingId = null;
document.addEventListener("DOMContentLoaded", () => {
    loadData();
    
    document.getElementById("task-form").addEventListener("submit", (e) => {
        e.preventDefault();
        saveTaskSubmit();
    });
});

function loadData() {
    const savedTasks = localStorage.getItem("codynn_flow_tasks");
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    } else {
        tasks = [
            { id: 1, title: "HTML/CSS App scaffolding", status: "completed", priority: "critical", completed: true },
            { id: 2, title: "Integrate JavaScript CRUD Layer", status: "progress", priority: "normal", completed: false },
            { id: 3, title: "Test Client Persistence", status: "pending", priority: "minor", completed: false }
        ];
    }
    updateGreetings();
    renderTasks();
}

function saveData() {
    localStorage.setItem("codynn_flow_tasks", JSON.stringify(tasks));
}

function updateGreetings() {
    const hour = new Date().getHours();
    let greet = "Good Morning";
    
    if (hour >= 12 && hour < 18) {
        greet = "Good Afternoon";
    } else if (hour >= 18) {
        greet = "Good Evening";
    }
    document.getElementById("greeting").textContent = `${greet}, Developer`;
}

function renderTasks() {
    const onHoldContainer = document.getElementById("onhold-tasks");
    const completedContainer = document.getElementById("completed-tasks");

    const onHoldTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    if (onHoldTasks.length === 0) {
        onHoldContainer.innerHTML = `<p style="color: #9CA3AF; padding: 20px;">No pending items on your board.</p>`;
    } else {
        onHoldContainer.innerHTML = onHoldTasks.map(t => createTaskHTML(t)).join('');
    }

    if (completedTasks.length === 0) {
        completedContainer.innerHTML = `<p style="color: #9CA3AF; padding: 20px;">No completed tasks yet.</p>`;
    } else {
        completedContainer.innerHTML = completedTasks.map(t => createTaskHTML(t)).join('');
    }

    updateSummaryCards(onHoldTasks.length, completedTasks.length);
    saveData();
}

function createTaskHTML(task) {
    return `
        <div class="task-item">
            <div class="task-checkbox ${task.completed ? 'completed' : ''}" onclick="toggleTask(${task.id})"></div>
            <div class="task-content">
                <div class="task-title ${task.completed ? 'completed' : ''}">${task.title}</div>
                <span class="status-badge ${task.status}">${task.status.toUpperCase()}</span>
                <span class="priority-badge ${task.priority}">
                    <i class="fa-solid fa-circle" style="font-size: 8px;"></i> ${task.priority.toUpperCase()}
                </span>
            </div>
            <div class="task-actions">
                <button class="action-btn edit" onclick="editTask(${task.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="action-btn delete" onclick="deleteTask(${task.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
    `;
}

function updateSummaryCards(pendingLen, completedLen) {
    const total = tasks.length;
    const rate = total > 0 ? Math.round((completedLen / total) * 100) : 0;

    document.getElementById("task-count").textContent = pendingLen;
    document.getElementById("total-tasks").textContent = total;
    document.getElementById("completed-count").textContent = completedLen;
    document.getElementById("pending-count").textContent = pendingLen;
    document.getElementById("completion-rate-value").textContent = `${rate}%`;
    document.getElementById("completion-progress").style.width = `${rate}%`;
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        task.status = task.completed ? "completed" : "progress";
        renderTasks();
    }
}

function saveTaskSubmit() {
    const title = document.getElementById("task-title-input").value;
    const status = document.getElementById("task-status").value;
    const priority = document.getElementById("task-priority").value;
    const isCompleted = status === "completed";

    if (editingId !== null) {
        const task = tasks.find(t => t.id === editingId);
        if (task) {
            task.title = title;
            task.status = status;
            task.priority = priority;
            task.completed = isCompleted;
        }
    } else {
        const newTask = {
            id: Date.now(),
            title: title,
            status: status,
            priority: priority,
            completed: isCompleted
        };
        tasks.push(newTask);
    }

    closeModel();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        editingId = id;
        document.getElementById("modal-title").textContent = "Update Existing Task";
        document.getElementById("task-title-input").value = task.title;
        document.getElementById("task-status").value = task.status;
        document.getElementById("task-priority").value = task.priority;
        openModel();
    }
}
function deleteTask(id) {
    if (confirm("Are you sure you want to remove this task?")) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    }
}

function openModel() {
    document.getElementById("task-modal").classList.add("active");
}

function closeModel() {
    document.getElementById("task-modal").classList.remove("active");
    document.getElementById("task-form").reset();
    document.getElementById("modal-title").textContent = "Add / Update Task";
    editingId = null;
}