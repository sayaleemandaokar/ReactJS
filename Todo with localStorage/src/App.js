import React, {useState, useEffect} from "react";
import {Container} from "reactstrap";

import "bootstrap/dist/css/bootstrap.min.css" 

import "./App.css";
import Todos from "./Components/Todos";
import TodoForm from "./Components/TodoForm";

const App = () =>{
  const [todos, setTodos] = useState([]);

  //grab the data which is already present in local storage. grab before anything happens
  //Does something before any component gets loaded, we use useEffect()
  useEffect(() => {
    const localTodos = localStorage.getItem("todos"); // loads an item from local storage
    console.log({localStorage});

    if(localTodos){
      setTodos(JSON.parse(localTodos));
    }
  }, [])


  const addTodos = async todo => {
    setTodos([...todos, todo])
  }

  //adds into localstrorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos])


  const markComplete = id => {
    setTodos(todos.filter(todo => todo.id !== id));
  }

  return(
    <Container fluid>
      <h1>Todo with local strorage</h1>
      <Todos todos = {todos} markComplete = {markComplete} />
      <TodoForm addTodos = {addTodos} />
    </Container>
  )
}

export default App;
