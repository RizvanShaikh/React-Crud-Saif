import React, { useState, useEffect } from "react";
import { Link,useHistory } from "react-router-dom";
import axios from "axios";
import { Table } from "react-bootstrap";
import _ from "lodash";
import { Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
// import {getCurrentDate} from './utils'
const CreateList = () => {
  const [values, setValues] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [notify,setNotify]=useState({
    isOpen:false,
    message:"",
    type:""
  })
  const [confirmDialog,setConfirmDialog]=useState({
    isOpen:false,
    title:"",
    subTitle:"",
    
  })
  let history=useHistory();
  const pageSize = 2;
//  var  today1=new Date().toLocaleTimeString();
//  var  today2=new Date().toLocaleDateString();
  // const today2='2021-04-24'
  // const today1='12:40:50.000'
  // console.log(today1);
  // console.log(today2);
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    try {
      const data = await axios.get("http://localhost:1337/todos");
      setValues(data.data);
      setPageData(_(data.data).slice(0).take(pageSize).value());
    } catch (e) {
      console.log(e);
    }
  };

  const pageCount = values ? Math.ceil(values.length / pageSize) : 0;
  if (pageCount === 1) return null;

  const pages = _.range(1, pageCount + 1);
  const pagination = (pageNo) => {
    setCurrentPage(pageNo);
    const startIndex = (pageNo - 1) * pageSize;
    const paginatedPost = _(values).slice(startIndex).take(pageSize).value();
    setPageData(paginatedPost);
    history.push(`/${pageNo}`)
  };

  const onChecked = async (id, value) => {
    try {
      setValues([
        ...values.map((element) => {
          if (id === element.id) {
            element.status = !element.status;
          }
          return element;
        }),
      ]);

      await axios.put(`http://localhost:1337/todos/${id}`, value);
    } catch (e) {
      console.log(e);
    }
  };

  const onDelete = async (id) => {
    try {
      setConfirmDialog({
        ...confirmDialog,
        isOpen:false
      })
      
      await axios.delete(`http://localhost:1337/todos/${id}`);
      loadData();
      setNotify({
        isOpen:true,
        message:"Deleted successfully",
        type:"error"
      })
     }catch (e) {
      console.log(e);
    }
  };
  let todosList = "";
  if (pageData.length > 0) {
    todosList = pageData.map((element, index) => (
      <tr key={index} style={element.status ? {backgroundColor:"tomato"}:{backgroundColor:""}}>
        <td>
          <input
            type="checkbox"
            checked={element.status}
            onChange={() => onChecked(element.id, element)}
          />
        </td>
        <td>{element.id}</td>
        <td>{element.title}</td>
        <td>{element.description}</td>
        <td>{element.date}</td>
        <td>{element.start_time}</td>
        <td>{element.end_time}</td>
        {/* <td style={element.date>today2 ? {color:"red"}:{color:"green"}}>
          {element.status ? "Completed" : "Incomplete"}</td> */}
        <td style={element.status ? {color:"green"}:{color:"red"}}>
        {element.status ? "Completed" : "Incomplete"}</td>
        <td>
          <Link
            class="btn btn-primary mr-2"
            to={`/create/ViewTodos/${element.id}`}
          >
            View
          </Link>

          <Link
            class="btn btn-outline-primary mr-2"
            to={`/create/CreateTodos/${element.id}`}
          >
            Edit
          </Link>

          <Link class="btn btn-danger" onClick={() => setConfirmDialog({
            isOpen:true,
            title:"Are you sure to delete this record?",
            subTitle:"You can't undo this operation!!",
            onConfirm:()=>{onDelete(element.id)}
          })
          //onDelete(element.id)
          
          }>
            Delete
          </Link>
        </td>
      </tr>
    ));
  } else {
    todosList = (
      <tr>
        <td colSpan={9}>No Data Found</td>
      </tr>
    );
  }
const handleClose=(event, reason)=>{
   setNotify({
     ...notify,
     isOpen:false
   })
}
  return (
    <>
      <Link class="btn btn-outline-primary mr-2" to="/create/CreateTodos">
        Add New Todos
      </Link>
      <h1 align="center" style={{ marginTop: "20px" }}>
        Todos List{" "}
      </h1>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th> Select </th>
            <th> ID </th>
            <th> Title </th>
            <th> Description </th>
            <th> Date </th>
            <th> Start_Time</th>
            <th> End_Time</th>
            <th> Status</th>
            <th> Action</th>
          </tr>
        </thead>
        <tbody>{todosList}</tbody>
      </Table>
      <nav className="d-flex justify-content-center">
        <ul className="pagination">
          {pages.map((page) => {
            return (
              <li
                className={
                  page === currentPage ? "page-item active" : "page-item"
                }
              >
                <p className="page-link" onClick={() => pagination(page)}>
                  {page}
                </p>
              </li>
            );
          })}
        </ul>
      </nav>
      <Dialog open={confirmDialog.isOpen}>
        <DialogTitle>

        </DialogTitle>
        <DialogContent>
          <Typography variant="h6">
            {confirmDialog.title}
          </Typography>
          <Typography variant="subtitle2">
            {confirmDialog.subTitle}
          </Typography>

        </DialogContent>
        <DialogActions>
         <button class="btn btn-primary mr-2" onClick={confirmDialog.onConfirm}>
         Yes
         </button>
         <button class="btn btn-outline-primary mr-2" onClick={()=>setConfirmDialog({
           ...confirmDialog,
           isOpen:false
         })}>
         No
         </button>
        </DialogActions>
      </Dialog>
      <Snackbar 
      open={notify.isOpen}
      autoHideDuration={3000}
      anchorOrigin={{vertical:"top",horizontal:"right"}}
      onClose={handleClose}
      >
        <Alert severity={notify.type} onClose={handleClose}>
           {notify.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateList;
