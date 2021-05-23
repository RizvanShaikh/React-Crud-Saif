import React ,{ useState, useEffect}  from 'react';
import axios from 'axios';
import {Link, useParams} from 'react-router-dom';
const ViewTodos = () => {
    const[values,setValues]=useState({
       title:"",
       description: "",
       status: false,
       date: "",
       start_time: "",
       end_time: "",
    })
   const {viewId}=useParams();
    const loadData=async () =>{
        try{
        const data=await axios.get(`http://localhost:1337/todos/${viewId}`)
        setValues(data.data);
    }   
        catch(e){
            console.log(e);
        }
}
useEffect(()=>{
   loadData();
},[])
    return (  
        <>
       
      <h1 className="display-4">Task Id: {viewId}</h1>
      <hr />
      <div align="center">
      <ul className="list-group w-50">
        <li className="list-group-item">Title: {values.title}</li>
        <li className="list-group-item">Description: {values.description}</li>
        <li className="list-group-item">Date: {values.date}</li>
        <li className="list-group-item">Start_time: {values.start_time}</li>
        <li className="list-group-item">End_time: {values.end_time}</li>
        <li className="list-group-item">
          Status: <a style={values.status? {color:"green"}:{color:"red"}} > 
                  {values.status?"Task Completed":"Task Incomplete"}
          </a>
          </li>
      </ul>
      </div>
      <Link className="btn btn-primary" to="/" style={{marginTop:"20px"}}>
        Back
      </Link>
        </>
    );
}
 
export default ViewTodos;