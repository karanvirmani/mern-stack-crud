// CreateStudent Component for add new student

// Import Modules
import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentForm from "./StudentForm";

// CreateStudent Component
const CreateStudent = () => {
  const [formValues, setFormValues] = useState({
    teacherEmail: "",
    studentEmail: [],
    time: "",
  });
  // onSubmit handler
  const onSubmit = (studentObject, action) => {
    axios
      .post("http://localhost:4000/students/create-student", studentObject)
      .then((res) => {
        if (res.status === 200) {
          alert("Student successfully created");
          action.resetForm();
        } else Promise.reject();
      })
      .catch((err) => alert("Something went wrong"));
  };

  // Return student form
  return (
    <StudentForm
      initialValues={formValues}
      onSubmit={onSubmit}
      enableReinitialize
    >
      Create Meeting
    </StudentForm>
  );
};

// Export CreateStudent Component
export default CreateStudent;
