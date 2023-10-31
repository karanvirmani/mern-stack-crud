import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

const StudentTableRow = (props) => {
  const { _id, teacherEmail, studentEmail, time, zoomLink } = props.obj;

  const deleteStudent = () => {
    axios
      .delete("http://localhost:4000/students/delete-student/" + _id)
      .then((res) => {
        if (res.status === 200) {
          alert("Student successfully deleted");
          window.location.reload();
        } else Promise.reject();
      })
      .catch((err) => alert("Something went wrong"));
  };

  return (
    <tr>
      <td>{teacherEmail}</td>
      <td>{studentEmail}</td>
      <td>{time}</td>
      <td>{zoomLink}</td>
      <td>
        <Link className="edit-link" to={"/edit-student/" + _id}>
          Edit
        </Link>
        <Button onClick={deleteStudent} size="sm" variant="danger">
          Delete
        </Button>
      </td>
    </tr>
  );
};

export default StudentTableRow;
