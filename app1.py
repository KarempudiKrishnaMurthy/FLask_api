from flask import Flask, request, jsonify

app = Flask(__name__)

# Sample in-memory data storage
tasks = []

# 1. Home Route
@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Flask API!"})

# 2. Get All Tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify({"tasks": tasks})

# 3. Add a New Task
@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    task_id = len(tasks) + 1
    task = {"id": task_id, "name": data.get("name", ""), "status": data.get("status","")}
    tasks.append(task)
    return jsonify({"message": "Task added!", "task": task}), 201

# 4. Update a Task
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    for task in tasks:
        if task['id'] == task_id:
            task['name'] = data.get("name", task["name"])
            task['status'] = data.get("status", task["status"])
            return jsonify({"message": "Task updated!", "task": task})
    return jsonify({"error": "Task not found!"}), 404

# 5. Delete a Task
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task['id'] != task_id]
    return jsonify({"message": "Task deleted!"})

if __name__ == '__main__':
    app.run(debug=True)
