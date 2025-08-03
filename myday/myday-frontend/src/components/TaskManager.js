import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaEdit, FaCheckCircle } from "react-icons/fa";
import "./TaskManager.css"; // custom styles

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Low",
  });
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get("http://localhost:8080/api/task")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error(err));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Update Task
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTask) {
      axios
        .put(`http://localhost:8080/api/task/${editingTask.id}`, form)
        .then(() => {
          setEditingTask(null);
          resetForm();
          fetchTasks();
        })
        .catch((err) => console.error(err));
    } else {
      axios
        .post("http://localhost:8080/api/task", { ...form, status: "Pending" })
        .then(() => {
          resetForm();
          fetchTasks();
        })
        .catch((err) => console.error(err));
    }
  };

  const resetForm = () => {
    setForm({ title: "", description: "", dueDate: "", priority: "Low" });
  };

  // Edit Task
  const handleEdit = (task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate?.slice(0, 16),
      priority: task.priority,
    });
  };

  // Delete Task
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/task/${id}`)
      .then(fetchTasks)
      .catch((err) => console.error(err));
  };

  // Mark Completed
  const markCompleted = (task) => {
    axios
      .put(`http://localhost:8080/api/task/${task.id}`, {
        ...task,
        status: "Completed",
      })
      .then(fetchTasks)
      .catch((err) => console.error(err));
  };

  return (
    <div className="row">
      {/* Form Section */}
      <div className="col-lg-4 mb-4">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body">
            <h4 className="card-title text-center mb-4 text-primary">
              {editingTask ? "✏️ Edit Task" : "➕ Add New Task"}
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  name="title"
                  placeholder="Task Title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  name="description"
                  placeholder="Description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <input
                  type="datetime-local"
                  className="form-control"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <select
                  className="form-select"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <button type="submit" className="btn btn-gradient w-100 py-2">
                {editingTask ? "Update Task" : "Add Task"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Task List Section */}
      <div className="col-lg-8">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body">
            <h4 className="card-title mb-4 text-primary">📋 Your Tasks</h4>
            <div className="list-group">
              {tasks.length === 0 ? (
                <p className="text-muted text-center">
                  No tasks yet. Start by adding one!
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="list-group-item d-flex justify-content-between align-items-center shadow-sm mb-3 rounded task-card"
                    style={{
                      backgroundColor:
                        task.status === "Completed" ? "#e8f9f1" : "#ffffff",
                    }}
                  >
                    <div>
                      <h6 className="mb-1 text-dark fw-bold">{task.title}</h6>
                      <small className="text-muted">
                        {task.description} <br />
                        <span className="text-secondary">
                          Due: {task.dueDate?.replace("T", " ")} | Priority:{" "}
                          <span
                            className={`fw-bold ${
                              task.priority === "High"
                                ? "text-danger"
                                : task.priority === "Medium"
                                ? "text-warning"
                                : "text-success"
                            }`}
                          >
                            {task.priority}
                          </span>
                        </span>
                      </small>
                      <br />
                      <span
                        className={`badge rounded-pill ${
                          task.status === "Completed"
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <div className="d-flex">
                      {task.status !== "Completed" && (
                        <button
                          className="btn btn-outline-success btn-sm me-2"
                          onClick={() => markCompleted(task)}
                        >
                          <FaCheckCircle />
                        </button>
                      )}
                      <button
                        className="btn btn-outline-info btn-sm me-2"
                        onClick={() => handleEdit(task)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(task.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskManager;
