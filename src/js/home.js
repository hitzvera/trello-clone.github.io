import { baseUrl } from "./constant.js";

const usernameElm = document.getElementById("home-username");
const imageProfileElm = document.getElementById("home-avatar");
const logoutBtn = document.getElementById("logout-home");

const containerTasks = document.getElementById("container-tasks");
const containerTable = document.getElementById("containerTable");

const boardViewButton = document.getElementById("board-view-button");
const tableViewButton = document.getElementById("table-view-button");

const openAdd = document.getElementById("open-add");
const containerAdd = document.getElementById("container-add-area");
const closeAddArea = document.getElementById("close-add-area");
const editButton = document.getElementById("edit-task");
const addForm = document.getElementById("add-form");
const editForm = document.getElementById("edit-form");
const containerDetailArea = document.getElementById("container-detail-area");
const containerEditArea = document.getElementById("container-edit-area");
const closeDetailArea = document.getElementById("close-detail-area");
const closeEditArea = document.getElementById("close-edit-area");
const taskNameDetail = document.getElementById("task-name-detail");
const createdatDetail = document.getElementById("createdat-detail");
const startdateDetail = document.getElementById("startdate-detail");
const enddateDetail = document.getElementById("enddate-detail");
const descriptionDetail = document.getElementById("description-detail");
const deleteTaskElm = document.getElementById("delete-task");
const searchInput = document.getElementById("search-input");
const user = JSON.parse(localStorage.getItem("user"));

let isBoardView = true;
let taskId;
let tasks = await init();

if (user) {
  usernameElm.innerText = user.username;
  imageProfileElm.src = user.image_url;
}

logoutBtn.addEventListener("click", () => {
  const confirmLogout = confirm("Are you sure you want to logout?");

  if (confirmLogout) {
    localStorage.removeItem("user");
    window.location.href = "../../index.html";
  }
});

boardViewButton.addEventListener("click", () => {
  isBoardView = true;
  init();
});

tableViewButton.addEventListener("click", () => {
  isBoardView = false;
  init();
});

openAdd.addEventListener("click", () => {
  containerAdd.classList.remove("hidden");
  containerAdd.classList.add("flex");
});

closeDetailArea.addEventListener("click", () => {
  containerDetailArea.classList.add("hidden");
  containerDetailArea.classList.remove("flex");
});

closeAddArea.addEventListener("click", () => {
  containerAdd.classList.add("hidden");
  containerAdd.classList.remove("flex");
});

closeEditArea.addEventListener("click", () => {
  containerEditArea.classList.add("hidden");
  containerEditArea.classList.remove("flex");
});

searchInput.addEventListener("keyup", (e) => {
  const searchQuery = e.target.value;
  searchTasks(searchQuery);
});

addForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskName = document.getElementById("taskName").value;
  const description = document.getElementById("description-add").value;
  const startDate = document.getElementById("start-date").value;
  const endDate = document.getElementById("end-date").value;


  addNewTask(taskName, description, startDate, endDate);
});

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const taskName = document.getElementById("taskName-edit").value;
  const description = document.getElementById("description-edit").value;
  const startDate = document.getElementById("start-date-edit").value;
  const endDate = document.getElementById("end-date-edit").value;

  loading(true);
  await fetch(`${baseUrl}/users/${user.id}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task_name: taskName,
      description,
      start_date: startDate,
      end_date: endDate,
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      location.reload();
    })
    .catch((err) => {
      console.log(err);
      return [];
    })
    .finally(() => {
      loading(false);
    });
});

// EDIT TASK ELEMENT
editButton.addEventListener("click", async (e) => {
  document.getElementById("container-edit-area").classList.remove("hidden");
  document.getElementById("container-edit-area").classList.add("flex");
  containerDetailArea.classList.add("hidden");
  containerDetailArea.classList.remove("flex");

  loading(true);
  const task = await fetch(`${baseUrl}/users/${user.id}/tasks/${taskId}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });

  document.getElementById("taskName-edit").value = task.task_name;
  document.getElementById("description-edit").value = task.description;
  document.getElementById("start-date-edit").value = task.start_date;
  document.getElementById("end-date-edit").value = task.end_date;
  loading(false);
});

deleteTaskElm.addEventListener("click", async (e) => {
  try {
    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) {
      return;
    }
    loading(true);
    await deleteTasks(taskId);
    location.reload();
  } catch (error) {
    console.log(error);
  } finally {
    loading(false);
  }
});

async function deleteTasks(id) {
  const response = await fetch(`${baseUrl}/users/${user.id}/tasks/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
  location.reload();
}

async function addNewTask(taskName, description, startDate, endDate) {
  const response = await fetch(`${baseUrl}/users/${user.id}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      task_name: taskName,
      description,
      start_date: startDate,
      end_date: endDate
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      location.reload();
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
}

function loading(isLoading) {
  if (isLoading) {
    document.getElementById("loading-area").classList.remove("hidden");
    document.getElementById("loading-area").classList.add("flex");
  } else {
    document.getElementById("loading-area").classList.add("hidden");
    document.getElementById("loading-area").classList.remove("flex");
  }
}

async function getAllTasks() {
  try {
    loading(true);
    const response = await fetch(`${baseUrl}/users/${user.id}/tasks`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    const data = await response.json();
    return data; // Return the data when the promise resolves successfully
  } catch (error) {
    console.error(error);
    return []; // Return an empty array in case of an error
  } finally {
    loading(false);
  }
}

async function init() {
  try {
    const tasks = await fetchData();
    if (isBoardView) {
      renderTasksBoard(tasks);
    } else {
      rednerTasksTable(tasks);
    }
    return tasks;
  } catch (error) {
    console.error(error);
  }
}

async function fetchData() {
  try {
    const tasks = await getAllTasks();
    return tasks;
  } catch (error) {
    console.error(error);
  }
}

function filterTasks(searchQuery) {
  return tasks.filter((task) => {
    return task.task_name.includes(searchQuery);
  });
}

function renderTasksBoard(tasks) {
  containerTasks.innerHTML = "";
  containerTable.innerHTML = "";

  tasks.forEach((task) => {
    const newFigure = document.createElement("figure");
    const h2 = document.createElement("h2");
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    // styling for new task
    newFigure.classList.add(
      "w-[300px]",
      "bg-white",
      "h-fit",
      "leading-none",
      "rounded-md",
      "px-2",
      "py-2",
      "hover:border-2",
      "hover:border-black",
      "card-task",
      "cursor-pointer"
    );

    h2.classList.add("font-semibold", "text-lg");
    p1.classList.add("text-[12px]");
    p2.classList.add("line-clamp-6", "mt-4", "mb-4", "box-border");
    h2.innerText = task.task_name;
    p1.innerText = new Date(task.createdAt).toLocaleString();
    p2.innerText = task.description;
    newFigure.appendChild(h2);
    newFigure.appendChild(p1);
    newFigure.appendChild(p2);
    containerTasks.appendChild(newFigure);

    newFigure.addEventListener("click", () => {
      containerDetailArea.classList.remove("hidden");
      containerDetailArea.classList.add("flex");

      taskNameDetail.innerText = task.task_name;
      createdatDetail.innerText = new Date(task.createdAt).toLocaleString();
      startdateDetail.innerText = unixTimestampToReadableDate(task.start_date) === "Invalid Date" ? task.start_date : unixTimestampToReadableDate(task.start_date);
      enddateDetail.innerText = unixTimestampToReadableDate(task.end_date) === "Invalid Date" ? task.end_date : unixTimestampToReadableDate(task.end_date);
      descriptionDetail.innerText = task.description;
      taskId = task.id;
    });
  });
}

function rednerTasksTable(tasks) {
  containerTable.innerHTML = "";
  containerTasks.innerHTML = "";

  // Create a table element and define its structure
  const table = document.createElement("table");
  table.classList.add("border-collapse", "w-full");

  // Create a table header row
  const tableHeader = document.createElement("tr");
  tableHeader.classList.add("bg-gray-200", "border-b", "border-gray-400");

  const tableHeaderColumns = [
    "Task Name",
    "Created At",
    "Start Date",
    "End Date",
    "Description",
  ];

  tableHeaderColumns.forEach((headerText) => {
    const th = document.createElement("th");
    th.classList.add("p-2", "text-left");
    th.innerText = headerText;
    tableHeader.appendChild(th);
  });

  table.appendChild(tableHeader);

  tasks.forEach((task) => {
    const row = document.createElement("tr");
    row.classList.add(
      "border-b",
      "border-gray-400",
      "bg-white",
      "cursor-pointer"
    );

    const taskNameCell = document.createElement("td");
    const createdAtCell = document.createElement("td");
    const startDateCell = document.createElement("td");
    const endDateCell = document.createElement("td");
    const descriptionCell = document.createElement("td");

    taskNameCell.innerText = task.task_name;
    createdAtCell.innerText = new Date(task.createdAt).toLocaleString();
    startDateCell.innerText = unixTimestampToReadableDate(task.start_date) === "Invalid Date" ? task.start_date : unixTimestampToReadableDate(task.start_date);
    endDateCell.innerText = unixTimestampToReadableDate(task.end_date) === "Invalid Date" ? task.end_date : unixTimestampToReadableDate(task.end_date);
    descriptionCell.innerText = task.description;

    row.appendChild(taskNameCell);
    row.appendChild(createdAtCell);
    row.appendChild(startDateCell);
    row.appendChild(endDateCell);
    row.appendChild(descriptionCell);

    // Add a click event to handle task details just like before
    row.addEventListener("click", () => {
      containerDetailArea.classList.remove("hidden");
      containerDetailArea.classList.add("flex");

      taskNameDetail.innerText = task.task_name;
      createdatDetail.innerText = new Date(task.createdAt).toLocaleString();
      startdateDetail.innerText = unixTimestampToReadableDate(task.start_date) === "Invalid Date" ? task.start_date : unixTimestampToReadableDate(task.start_date);
      enddateDetail.innerText = unixTimestampToReadableDate(task.end_date) === "Invalid Date" ? task.end_date : unixTimestampToReadableDate(task.end_date);
      descriptionDetail.innerText = task.description;
      taskId = task.id;
    });
    table.appendChild(row);
  });

  containerTable.appendChild(table);
}
async function searchTasks(searchQuery) {
  let filteredTasks;

  if (searchQuery === "") {
    filteredTasks = tasks; // Render all tasks if search query is empty
  } else {
    filteredTasks = filterTasks(searchQuery);
  }

  renderTasksBoard(filteredTasks);
}

function unixTimestampToReadableDate(unixTimestamp) {
  // Create a Date object from the timestamp
  const date = new Date(unixTimestamp * 1000); // JavaScript Date uses milliseconds, so we multiply by 1000

  // Format the date to a human-readable format (e.g., "YYYY-MM-DD HH:MM:SS")
  const formattedDate = date.toLocaleString(); // You can customize the formatting as needed

  return formattedDate;
}
// function handleClickOutside(event) {
//   if (!containerDetailArea.contains(event.target)) {
//     containerDetailArea.classList.add("hidden");
//     containerDetailArea.classList.remove("flex");
//     document.removeEventListener("click", handleClickOutside); // Remove the listener once the white box is closed
//   }
// }

// const isWhiteboxClosed = containerDetailArea.classList.contains("hidden");

// if (!isWhiteboxClosed) {
//   // Event listener to detect clicks outside the white box
//   document.addEventListener("click", handleClickOutside);
// }
