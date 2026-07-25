import {useEffect, useState} from 'react'
import './App.css'
import axios from 'axios'

function App(){
  // API key is insert
  const BASE_URL = 'http://127.0.0.1:8000'
  const[students, setStudents] = useState([])

  const[id, setId] = useState('')
  const[name, setName] = useState('')
  const[course, setCourse] = useState('')
  const[update, setUpdate] = useState(false)

  async function getStudents(){
    const response = await axios.get(BASE_URL + '/students')
    setStudents(response.data)
  }


// #to fetch data in javascript useEffect
  useEffect(() => {
    getStudents()
  }, [])


  function handleID(event){
    setId(event.target.value)
  }
  function handleName(event){
    setName(event.target.value)
  }
  function handleCourse(event){
    setCourse(event.target.value)
  }

  async function sendData(){
    if(update === false){
      const response = await axios.post(BASE_URL + '/students', {
      id: id,
      name: name,
      course: course
    })
    alert(response.data.message)
    }
    else{   //call put method to insert into DB
      const response = await axios.put(BASE_URL + "/students/" + id, {
        id:id,
        name:name,
        course:course
      })
      alert(response.data.message)
    }
  }

  function editStudent(student){
    setId(student.id)
    setName(student.name)
    setCourse(student.course)
    setUpdate(true)
  }

  async function deleteStudent(id){
    const response = await axios.delete(BASE_URL + '/students/' + id)
    alert(response.data.message)
    getStudents()
  }

  return(
    <div className="container">
      <h1>Student Management System</h1>

      <form  className='student-form'>
        <input type="number" placeholder='Student ID' onChange={handleID} value ={id}/>
        <input type="text" placeholder='Student Name' onChange={handleName} value={name}/>
        <input type="text" placeholder='Student Course' onChange={handleCourse} value={course}/>
        <button onClick={sendData}>{ update ? "Update" : "Submit"}</button>
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
          {/* when we want to add data or code of javascript in html we need {} brackets see down*/}
          { students.map((student) => {
            return(
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.course}</td>
                <td><button className='edit-btn' onClick={() => {editStudent(student)}}>Edit</button></td>
                <td><button className='delete-btn' onClick={ () => {deleteStudent(student.id)}}>Delete</button></td>
                
              </tr>
            )
          }) }
        </tbody>
      </table>
    </div>
    
  )
}

export default App