// EditStudent Component for update student data

// Import Modules
import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentForm from "./StudentForm";

// EditStudent Component
const EditStudent = (props) => {
  const [formValues, setFormValues] = useState({
    teacherEmail: "",
    studentEmail: [],
    time: "",
    zoomLink: "",
  });

  //onSubmit handler
  const onSubmit = (studentObject) => {
    axios
      .put(
        "http://localhost:4000/students/update-student/" +
          props.match.params.id,
        studentObject
      )
      .then((res) => {
        if (res.status === 200) {
          alert("Student successfully updated");
          props.history.push("/student-list");
        } else Promise.reject();
      })
      .catch((err) => alert("Something went wrong"));
  };

  // Load data from server and reinitialize student form
  useEffect(() => {
    axios
      .get(
        "http://localhost:4000/students/update-student/" + props.match.params.id
      )
      .then((res) => {
        const { teacherEmail, studentEmail, time, zoomLink } = res.data;
        setFormValues({ teacherEmail, studentEmail, time, zoomLink });
      })
      .catch((err) => console.log(err));
  }, [props.match.params.id]);

  // Return student form
  return (
    <StudentForm
      initialValues={formValues}
      onSubmit={onSubmit}
      enableReinitialize
    >
      Update Student
    </StudentForm>
  );
};

// Export EditStudent Component
export default EditStudent;
