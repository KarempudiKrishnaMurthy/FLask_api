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
    <div>
      <h1>Task List</h1>

      {/* Add New Task */}
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task name"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Display Task List */}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {editTaskId === task.id ? (
              <div>
                <input
                  type="text"
                  value={editTaskName}
                  onChange={(e) => setEditTaskName(e.target.value)}
                />
                <select
                  value={editTaskStatus}
                  onChange={(e) => setEditTaskStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button onClick={updateTask}>Save</button>
              </div>
            ) : (
              <div>
                {task.name} - {task.status}
                <button onClick={() => startEditTask(task)}>Edit</button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
