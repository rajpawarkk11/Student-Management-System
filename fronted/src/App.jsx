import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  // Backend URL
  const BASE_URL = "https://student-management-system-weq7.onrender.com";

  const [students, setStudents] = useState([]);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [update, setUpdate] = useState(false);

  // Get all students
  async function getStudents() {
    try {
      const response = await axios.get(BASE_URL + "/students");
      setStudents(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to fetch students");
    }
  }

  useEffect(() => {
    getStudents();
  }, []);

  function handleID(event) {
    setId(event.target.value);
  }

  function handleName(event) {
    setName(event.target.value);
  }

  function handleCourse(event) {
    setCourse(event.target.value);
  }

  // Create / Update Student
  async function sendData(event) {
    event.preventDefault();

    try {
      if (!update) {
        const response = await axios.post(BASE_URL + "/students", {
          id,
          name,
          course,
        });

        alert(response.data.message);
      } else {
        const response = await axios.put(BASE_URL + "/students/" + id, {
          id,
          name,
          course,
        });

        alert(response.data.message);
      }

      await getStudents();

      setId("");
      setName("");
      setCourse("");
      setUpdate(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  // Edit Student
  function editStudent(student) {
    setId(student.id);
    setName(student.name);
    setCourse(student.course);
    setUpdate(true);
  }

  // Delete Student
  async function deleteStudent(id) {
    try {
      const response = await axios.delete(BASE_URL + "/students/" + id);

      alert(response.data.message);
      await getStudents();
    } catch (error) {
      console.error(error);
      alert("Failed to delete student");
    }
  }

  return (
    <div className="container">
      <h1>Student Management System</h1>

      <form className="student-form">
        <input
          type="number"
          placeholder="Student ID"
          onChange={handleID}
          value={id}
        />

        <input
          type="text"
          placeholder="Student Name"
          onChange={handleName}
          value={name}
        />

        <input
          type="text"
          placeholder="Student Course"
          onChange={handleCourse}
          value={course}
        />

        <button type="submit" onClick={sendData}>
          {update ? "Update" : "Submit"}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Course</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.course}</td>

              <td>
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => editStudent(student)}
                >
                  Edit
                </button>
              </td>

              <td>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => deleteStudent(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;