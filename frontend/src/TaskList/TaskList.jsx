import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState('');
  const [editTaskStatus, setEditTaskStatus] = useState('');

  // Fetch tasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://127.0.0.1:5000/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error fetching tasks:", error));
  };

  // Add a new task
  const addTask = () => {
    if (!newTask) return; // Avoid adding empty tasks

    axios.post('http://127.0.0.1:5000/tasks', { name: newTask })
      .then(response => {
        fetchTasks(); // Refresh the task list
        setNewTask(''); // Clear the input field
      })
      .catch(error => console.error("Error adding task:", error));
  };

  // Delete a task
  const deleteTask = (taskId) => {
    axios.delete(`http://127.0.0.1:5000/tasks/${taskId}`)
      .then(() => fetchTasks()) // Refresh the task list
      .catch(error => console.error("Error deleting task:", error));
  };

  // Start editing a task
  const startEditTask = (task) => {
    setEditTaskId(task.id);
    setEditTaskName(task.name);
    setEditTaskStatus(task.status);
  };

  // Update a task
  const updateTask = () => {
    if (!editTaskName) return; // Avoid saving empty task names

    axios.put(`http://127.0.0.1:5000/tasks/${editTaskId}`, {
      name: editTaskName,
      status: editTaskStatus,
    })
      .then(() => {
        fetchTasks(); // Refresh the task list
        setEditTaskId(null); // Clear editing state
        setEditTaskName('');
        setEditTaskStatus('');
      })
      .catch(error => console.error("Error updating task:", error));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Task List</h1>

      {/* Add New Task */}
      <div className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task name"
          className="border-2 border-gray-300 p-2 rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
        >
          Add Task
        </button>
      </div>

      {/* Display Task List */}
      <ul className="space-y-4">
        {tasks.map(task => (
          <li key={task.id} className="flex justify-between items-center p-4 border rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
            {editTaskId === task.id ? (
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={editTaskName}
                  onChange={(e) => setEditTaskName(e.target.value)}
                  className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={editTaskStatus}
                  onChange={(e) => setEditTaskStatus(e.target.value)}
                  className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={updateTask}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-xl font-semibold">{task.name}</span>
                <span className={`px-4 py-1 text-white rounded-full ${task.status === 'completed' ? 'bg-green-500' : task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-500'}`}>
                  {task.status}
                </span>
                <button
                  onClick={() => startEditTask(task)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
