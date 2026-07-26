from fastapi import FastAPI
import psycopg2
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Connection
def get_db():
    connection = psycopg2.connect(os.getenv("DATABASE_URL"))
    cursor = connection.cursor()
    return connection, cursor

# Class based validation
class Student(BaseModel):
    id: int = None
    name: str = None
    course: str = None

# Get all students
@app.get("/")
def root():
    return {
        "message": "Student Management System API is running successfully 🚀",
        "docs": "/docs"
    }


@app.get("/students")
def get_students():
    connection, cursor = get_db()

    cursor.execute("SELECT * FROM students")
    rows = cursor.fetchall()

    result = []
    for row in rows:
        result.append({
            "id": row[0],
            "name": row[1],
            "course": row[2],
        })

    cursor.close()
    connection.close()

    return result

# Get single student
@app.get("/students/{id}")
def get_single_student(id: int):
    connection, cursor = get_db()

    cursor.execute("SELECT * FROM students WHERE id=%s", (id,))
    row = cursor.fetchone()

    cursor.close()
    connection.close()

    return {
        "id": row[0],
        "name": row[1],
        "course": row[2],
    }

# Create new student
@app.post("/students")
def create_student_record(student: Student):
    connection, cursor = get_db()

    cursor.execute(
        "INSERT INTO students VALUES (%s, %s, %s)",
        (student.id, student.name, student.course)
    )
    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Student Record Created Successfully"
    }

# Replace student
@app.put("/students/{id}")
def replace_student_record(id: int, student: Student):
    connection, cursor = get_db()

    cursor.execute(
        "UPDATE students SET id=%s, name=%s, course=%s WHERE id=%s",
        (student.id, student.name, student.course, id)
    )
    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Student Record Replaced Successfully"
    }

# Update student
@app.patch("/students/{id}")
def update_student_record(id: int, student: Student):
    connection, cursor = get_db()

    if student.id is not None:
        cursor.execute(
            "UPDATE students SET id=%s WHERE id=%s",
            (student.id, id)
        )

    if student.name is not None:
        cursor.execute(
            "UPDATE students SET name=%s WHERE id=%s",
            (student.name, id)
        )

    if student.course is not None:
        cursor.execute(
            "UPDATE students SET course=%s WHERE id=%s",
            (student.course, id)
        )

    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Student Record Updated Successfully"
    }

# Delete student
@app.delete("/students/{id}")
def delete_student_record(id: int):
    connection, cursor = get_db()

    cursor.execute("DELETE FROM students WHERE id=%s", (id,))
    connection.commit()

    cursor.close()
    connection.close()

    return {
        "message": "Student Data Deleted Successfully"
    }