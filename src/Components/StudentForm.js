import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css"; // Import the styles

const StudentForm = (props) => {
  const validationSchema = Yup.object().shape({
    teacherEmail: Yup.string()
      .email("You have entered an invalid email address")
      .required("Required"),
    studentEmail: Yup.string()
      .test("is-emails", "Invalid email address", function (value) {
        if (!value) {
          return true; // Allow empty input
        }
        const emails = value.split(",").map((email) => email.trim());
        return emails.every((email) => Yup.string().email().isValidSync(email));
      })
      .required("Required"),
    time: Yup.date().required("Required"), // Change to date type
  });

  return (
    <div className="form-wrapper">
      <Formik {...props} validationSchema={validationSchema}>
        <Form>
          <FormGroup>
            <span>Teacher Email</span>
            <Field name="teacherEmail" type="text" className="form-control" />
            <ErrorMessage
              name="teacherEmail"
              className="d-block invalid-feedback"
              component="span"
            />
          </FormGroup>
          <FormGroup>
            <span>Student Email (comma-separated)</span>
            <Field name="studentEmail" type="text" className="form-control" />
            <ErrorMessage
              name="studentEmail"
              className="d-block invalid-feedback"
              component="span"
            />
          </FormGroup>
          <FormGroup>
            <span>Time</span>
            <Field
              name="time"
              render={(fieldProps) => (
                <Datetime
                  value={fieldProps.field.value}
                  inputProps={{ name: fieldProps.field.name }}
                  onChange={(value) =>
                    fieldProps.form.setFieldValue(fieldProps.field.name, value)
                  }
                />
              )}
            />
            <ErrorMessage
              name="time"
              className="d-block invalid-feedback"
              component="span"
            />
          </FormGroup>
          <Button variant="danger" size="lg" block="block" type="submit">
            {props.children}
          </Button>
        </Form>
      </Formik>
    </div>
  );
};

export default StudentForm;
