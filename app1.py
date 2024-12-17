from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'  # SQLite Database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define Task Model
class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Unique ID for each task
    name = db.Column(db.String(80), nullable=False)  # Task name (required)
    status = db.Column(db.String(20), default="pending")  # Task status (default: "pending")

    def to_dict(self):
        """Converts the Task object to a dictionary for JSON serialization."""
        return {"id": self.id, "name": self.name, "status": self.status}

# Ensure database tables are created at startup
with app.app_context():
    db.create_all()

# Routes
@app.route('/')
def home():
    """Home route to verify the API is running."""
    return jsonify({"message": "Welcome to the Flask API with a Database!"})

# 1. Get All Tasks
@app.route('/tasks', methods=['GET'])
def get_tasks():
    """Fetches all tasks from the database."""
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

# 2. Add a New Task
@app.route('/tasks', methods=['POST'])
def add_task():
    """Adds a new task to the database."""
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({"error": "Task 'name' is required"}), 400
    new_task = Task(name=data['name'])
    db.session.add(new_task)
    db.session.commit()
    return jsonify({"message": "Task added!", "task": new_task.to_dict()}), 201

# 3. Update a Task
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """Updates an existing task's details."""
    data = request.get_json()
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found!"}), 404
    task.name = data.get('name', task.name)
    task.status = data.get('status', task.status)
    db.session.commit()
    return jsonify({"message": "Task updated!", "task": task.to_dict()})

# 4. Delete a Task
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """Deletes a task from the database."""
    task = Task.query.get(task_id)
    if not task:
        return jsonify({"error": "Task not found!"}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted!"})

if __name__ == '__main__':
    app.run(debug=True)
