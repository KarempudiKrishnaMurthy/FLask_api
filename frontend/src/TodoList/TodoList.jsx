import React, { useEffect, useState } from "react";
import axios from "axios";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Beautiful To-Do List
      </h1>

      <div className="flex mb-6 space-x-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
          className="border-2 border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Tasks */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pending</h2>
          {categorizedTasks.pending.map((task) => (
            <div
              key={task.id}
              className="flex justify-between items-center mb-4 p-2 border-b"
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

        {/* In Progress Tasks */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">In Progress</h2>
          {categorizedTasks["in-progress"].map((task) => (
            <div
              key={task.id}
              className="flex justify-between items-center mb-4 p-2 border-b"
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

        {/* Completed Tasks */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Completed</h2>
          {categorizedTasks.completed.map((task) => (
            <div
              key={task.id}
              className="flex justify-between items-center mb-4 p-2 border-b"
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
  );
}

export default TodoList;
