import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMoon, FaSun } from "react-icons/fa";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true" // Persist theme preference
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    // Apply dark mode to the <body> element
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  const fetchTasks = () => {
    axios
      .get("http://127.0.0.1:5000/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  const addTask = () => {
    if (!newTask) return;
    axios
      .post("http://127.0.0.1:5000/tasks", { name: newTask, status: "pending" })
      .then(() => {
        fetchTasks();
        setNewTask("");
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  const updateTaskStatus = (taskId, status) => {
    axios
      .put(`http://127.0.0.1:5000/tasks/${taskId}`, { status })
      .then(() => fetchTasks())
      .catch((error) => console.error("Error updating task status:", error));
  };

  const deleteTask = (taskId) => {
    axios
      .delete(`http://127.0.0.1:5000/tasks/${taskId}`)
      .then(() => fetchTasks())
      .catch((error) => console.error("Error deleting task:", error));
  };

  const categorizedTasks = {
    pending: tasks.filter((task) => task.status === "pending"),
    "in-progress": tasks.filter((task) => task.status === "in-progress"),
    completed: tasks.filter((task) => task.status === "completed"),
  };

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      } min-h-screen transition-all`}
    >
      <div className="max-w-6xl mx-auto p-6">
        {/* Toggle Bar in Top Right */}
        <div className="absolute top-4 right-4">
          <div
            className="relative w-16 h-8 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer transition"
            onClick={() => setDarkMode(!darkMode)}
          >
            {/* Icon Change on Toggle */}
            <div
              className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-all ${
                darkMode ? "translate-x-8" : "translate-x-0"
              } flex items-center justify-center`}
            >
              {darkMode ? (
                <FaMoon className="text-blue-500" />
              ) : (
                <FaSun className="text-yellow-500" />
              )}
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-semibold text-center mb-6">Your Daily Tasks</h1>

        {/* Add Task */}
        <div className="flex flex-col md:flex-row items-center justify-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter new task"
            className={`border-2 p-3 rounded-md w-full md:w-3/4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode
                ? "bg-gray-800 border-gray-600 text-white"
                : "bg-white border-gray-300 text-black"
            }`}
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Add Task
          </button>
        </div>

        {/* Task Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending */}
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-200"
            } p-4 rounded-lg shadow-md`}
          >
            <h2 className="text-lg font-semibold mb-4">Pending</h2>
            {categorizedTasks.pending.map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center mb-4 p-2 border-b dark:border-gray-600"
              >
                <span>{task.name}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateTaskStatus(task.id, "in-progress")}
                    className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 transition"
                  >
                    Start
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* In Progress */}
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-200"
            } p-4 rounded-lg shadow-md`}
          >
            <h2 className="text-lg font-semibold mb-4">In Progress</h2>
            {categorizedTasks["in-progress"].map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center mb-4 p-2 border-b dark:border-gray-600"
              >
                <span>{task.name}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateTaskStatus(task.id, "completed")}
                    className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Completed */}
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-200"
            } p-4 rounded-lg shadow-md`}
          >
            <h2 className="text-lg font-semibold mb-4">Completed</h2>
            {categorizedTasks.completed.map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center mb-4 p-2 border-b dark:border-gray-600"
              >
                <span>{task.name}</span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoList;
