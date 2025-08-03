import logo from './logo.svg';
import './App.css';
import TaskManager from "./components/TaskManager.js";
function App() {
  return (
    <div className="container mt-4">
        <h2 className="text-center mb-4">MyDay</h2>
        <TaskManager/>
    </div>
  );
}

export default App;
