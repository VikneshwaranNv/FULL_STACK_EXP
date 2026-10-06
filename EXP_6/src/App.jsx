import { useState } from "react";
import "./App.css";

function Header({ title }) {
  return (
    <header>
      <h1>{title}</h1>
      <p>React Components + Props + State</p>
    </header>
  );
}

function StudentCard({ student, onStatusChange }) {
  return (
    <div className="student-card">
      <h2>{student.name}</h2>

      <p>
        <strong>Age:</strong> {student.age}
      </p>

      <p>
        <strong>Course:</strong> {student.course}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        <span className={student.present ? "present" : "absent"}>
          {student.present ? "Present" : "Absent"}
        </span>
      </p>

      <button onClick={() => onStatusChange(student.id)}>
        Mark {student.present ? "Absent" : "Present"}
      </button>
    </div>
  );
}

function App() {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Arun",
      age: 20,
      course: "React JS",
      present: true,
    },
    {
      id: 2,
      name: "Priya",
      age: 21,
      course: "Java",
      present: false,
    },
    {
      id: 3,
      name: "Karthik",
      age: 20,
      course: "Python",
      present: true,
    },
  ]);

  const [name, setName] = useState("");

  function changeStatus(id) {
    setStudents(
      students.map((student) =>
        student.id === id
          ? { ...student, present: !student.present }
          : student
      )
    );
  }

  function addStudent() {
    if (name.trim() === "") {
      return;
    }

    const newStudent = {
      id: Date.now(),
      name: name,
      age: 20,
      course: "React JS",
      present: false,
    };

    setStudents([...students, newStudent]);
    setName("");
  }

  return (
    <div className="app">
      <Header title="Student Management System" />

      <div className="add-section">
        <input
          type="text"
          placeholder="Enter student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button onClick={addStudent}>Add Student</button>
      </div>

      <div className="student-container">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onStatusChange={changeStatus}
          />
        ))}
      </div>

      <div className="summary">
        <h2>Class Summary</h2>

        <p>Total Students: {students.length}</p>

        <p>
          Present Students:{" "}
          {students.filter((student) => student.present).length}
        </p>

        <p>
          Absent Students:{" "}
          {students.filter((student) => !student.present).length}
        </p>
      </div>
    </div>
  );
}

export default App;