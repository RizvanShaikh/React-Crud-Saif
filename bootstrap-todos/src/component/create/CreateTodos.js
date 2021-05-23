import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import axios from "axios";
import { useHistory, Link, useParams } from "react-router-dom";
import { Alert } from "@material-ui/lab";
import { Snackbar } from "@material-ui/core";

const CreateTodos = () => {
  const [errorMsg, setErrorMsg] = useState(null);

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [values, setValues] = useState({
    title: "",
    description: "",
    status: false,
    date: "",
    start_time: "",
    end_time: "",
  });
  // console.log("Endtime:",values.end_time);
  // console.log("date:",values.date);
  const { editId } = useParams();

  let history = useHistory();

  const onEdit = async () => {
    try {
      const data = await axios.get(`http://localhost:1337/todos/${editId}`);
      setValues(data.data);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (editId) {
      onEdit();
    }
  }, []);

  const onSubmit = async (values) => {
    if (editId) {
      try {
        await axios.put(`http://localhost:1337/todos/${editId}`, values);

        history.push("/");
      } catch (e) {
        setErrorMsg(e.message);
      }
    } else {
      try {
        const data = await axios.post(`http://localhost:1337/todos/`, values);
        setValues(data.dada);
        history.push("/");
      } catch (e) {
        setErrorMsg(e.message);
        console.log(e);
      }
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={values}
        validationSchema={Yup.object().shape({
          title: Yup.string().required("Please Enter title...!"),
          description: Yup.string().required("Please Describe your title...!"),
          date: Yup.string().required("Please select date"),
          start_time: Yup.string().required("Please Enter start time"),
          end_time: Yup.string().required("Please Enter end time"),
          status: Yup.boolean().required("Check or Uncheck the Box for status"),
        })}
        onSubmit={(values) => {
          onSubmit(values);
          if (editId) {
            setNotify({
              isOpen: true,
              message: "Updated successfully",
              type: "success",
            });
          } else {
            setNotify({
              isOpen: true,
              message: "Added successfully",
              type: "success",
            });
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <div className="container">
            <div className="w-75 mx-auto shadow p-5">
              <h2 className="text-center mb-4">
                {" "}
                {editId ? "Edit" : "Add"} Todos
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter Your Title"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.title && touched.title && <p>{errors.title}</p>}
                <div className="form-group">
                  <textarea
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Describe Your Title"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.description && touched.description && (
                  <p>{errors.description}</p>
                )}
                <div className="form-group">
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    name="date"
                    value={values.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.date && touched.date && <p>{errors.date}</p>}
                <div className="form-group">
                  <input
                    type="time"
                    className="form-control form-control-lg"
                    step="2"
                    name="start_time"
                    value={values.start_time}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.start_time && touched.start_time && (
                  <p>{errors.start_time}</p>
                )}
                <div className="form-group">
                  <input
                    type="time"
                    className="form-control form-control-lg"
                    step="2"
                    name="end_time"
                    value={values.end_time}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.end_time && touched.end_time && (
                  <p>{errors.end_time}</p>
                )}
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox"
                      name="status"
                      checked={values.status}
                      value={values.status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />{" "}
                    Status:{" "}
                    <a
                      style={
                        values.status
                          ? { color: "#006600" }
                          : { color: "tomato" }
                      }
                    >
                      {values.status ? "Completed" : "Incomplete"}
                    </a>
                  </label>
                </div>
                {errors.status && touched.status && <p>{errors.status}</p>}
                <button className="btn btn-primary">
                  {editId ? "Update" : "Add"}
                </button>
                {"  "}
                <Link class="btn btn-outline-primary mr-2" to="/">
                  Cancel
                </Link>
              </form>
            </div>
          </div>
        )}
      </Formik>
      {errorMsg ? <h3 style={{ color: "red" }}>{errorMsg}</h3> : ""}
      <Snackbar
        open={notify.isOpen}
        autoHideDuration={10000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={notify.type}>{notify.message};</Alert>
      </Snackbar>
    </>
  );
};
export default CreateTodos;
