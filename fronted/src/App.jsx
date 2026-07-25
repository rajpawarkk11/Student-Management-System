import { useEffect, useMemo, useState } from "react";
import "./App.css";
import axios from "axios";
import {
  FaUserGraduate,
  FaBookOpen,
  FaDatabase,
  FaSearch,
  FaPlus,
} from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const BASE_URL =
    "https://student-management-system-weq7.onrender.com";

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [update, setUpdate] = useState(false);

  async function getStudents() {
    try {
      setLoading(true);
      const response = await axios.get(BASE_URL + "/students");
      setStudents(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.course.toLowerCase().includes(search.toLowerCase()) ||
        String(student.id).includes(search)
    );
  }, [students, search]);

  const clearForm = () => {
    setId("");
    setName("");
    setCourse("");
    setUpdate(false);
  };

  async function sendData(e) {
    e.preventDefault();

    if (!id || !name || !course) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (!update) {
        const response = await axios.post(BASE_URL + "/students", {
          id,
          name,
          course,
        });

        toast.success(response.data.message);
      } else {
        const response = await axios.put(BASE_URL + "/students/" + id, {
          id,
          name,
          course,
        });

        toast.success(response.data.message);
      }

      clearForm();
      await getStudents();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  function editStudent(student) {
    setId(student.id);
    setName(student.name);
    setCourse(student.course);
    setUpdate(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteStudent(id) {
    if (!window.confirm("Delete this student?")) return;

    try {
      const response = await axios.delete(BASE_URL + "/students/" + id);

      toast.success(response.data.message);
      await getStudents();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete student");
    }
  }

  return (
    <>
      <Toaster position="top-right" />

      <div className="dashboard">

        <div className="header">

          <div>

            <h1>🎓 Student Management Dashboard</h1>

            <p>
              Manage Students using React, FastAPI &
              PostgreSQL
            </p>

          </div>

          <button
            className="add-btn-top"
            onClick={clearForm}
          >
            <FaPlus />
            New Student
          </button>

        </div>

        <div className="cards">

          <div className="card">
            <FaUserGraduate className="card-icon" />
            <h2>{students.length}</h2>
            <p>Total Students</p>
          </div>

          <div className="card">
            <FaBookOpen className="card-icon" />
            <h2>
              {new Set(students.map((s) => s.course)).size}
            </h2>
            <p>Courses</p>
          </div>

          <div className="card">
            <FaDatabase className="card-icon" />
            <h2>Online</h2>
            <p>Database Connected</p>
          </div>

        </div>

        <div className="search-box">

          <FaSearch />

          <input
            type="text"
            placeholder="Search Student..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>
                <form className="student-form" onSubmit={sendData}>

          <h2>
            {update ? "✏ Update Student" : "➕ Add Student"}
          </h2>

          <input
            type="number"
            placeholder="Student ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />

          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Student Course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />

          <div className="btn-group">

            <button
              type="submit"
              className="submit-btn"
            >
              {update ? "Update Student" : "Add Student"}
            </button>

            <button
              type="button"
              className="clear-btn"
              onClick={clearForm}
            >
              🧹 Clear
            </button>

          </div>

        </form>

        {loading ? (

          <div className="loading">
            Loading Students...
          </div>

        ) : (

          <div className="table-container">

            <table className="student-table">

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

                {filteredStudents.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="empty"
                    >
                      📂 No Students Found
                    </td>

                  </tr>

                ) : (

                  filteredStudents.map((student) => (

                    <tr key={student.id}>

                      <td>{student.id}</td>

                      <td>{student.name}</td>

                      <td>

                        <span className="course-badge">

                          {student.course}

                        </span>

                      </td>

                      <td>

                        <button
                          className="edit-btn"
                          onClick={() =>
                            editStudent(student)
                          }
                        >
                          ✏ Edit
                        </button>

                      </td>

                      <td>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteStudent(student.id)
                          }
                        >
                          🗑 Delete
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        )}

        <footer className="footer">

          <p>
            Developed by <strong>Raj Pawar</strong>
          </p>

          <p>
            React • FastAPI • PostgreSQL • Neon •
            Render • Vercel
          </p>

        </footer>

      </div>

    </>

  );
}

export default App;