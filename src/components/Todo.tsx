import React, { useEffect, useState } from "react";
import { Task } from "../types/types";
import "./todo.css";

function Todo() {
  const [todo, setTodo] = useState<string>("");
  const [todoList, setTodoList] = useState<Task[]>(
    JSON.parse(localStorage.getItem("lists") || "[]")
  );
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const storedTodos = localStorage.getItem("lists");
    console.log(storedTodos);
    if (storedTodos === undefined) return;
    if (storedTodos) {
      setTodoList(JSON.parse(storedTodos));
    }
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
    return;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(event.target.value);
  };

  const addNewTask = () => {
    if (!todo) {
      alert("todoが入力されていません");
      return;
    }

    const newTodo: Task = {
      taskName: todo,
      status: "incomplete",
    };

    setTodoList([...todoList, newTodo]);
    setTodo("");
  };

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(todoList));
  }, [todoList]);

  const changeStatus = (index: number) => {
    const taskList = [...todoList];
    if (taskList[index].status === "incomplete") {
      taskList[index].status = "complete";
    } else if (taskList[index].status === "complete") {
      taskList[index].status = "incomplete";
    }

    setTodoList(taskList);
    localStorage.setItem("lists", JSON.stringify(todoList));
  };

  const handleDelete = (index: number) => {
    const taskList = [...todoList];
    taskList.splice(index, 1);
    setTodoList(taskList);
  };

  const todoListItems = todoList
    .filter((task) => filter === "all" || task.status === filter)
    .map((task, index) => (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>
          {task.status === "complete" ? <s>{task.taskName}</s> : task.taskName}
        </td>
        <td>{task.status}</td>
        <td>
          <input
            type="checkbox"
            checked={task.status === "complete"}
            onChange={() => changeStatus(index)}
          />
        </td>
        <td>
          <input
            type="button"
            value="Delete"
            id="delete-btn"
            onClick={() => handleDelete(index)}
          />
        </td>
      </tr>
    ));

  return (
    <div className="todo">
      <div className="todo-container">
        <h1>Todo List</h1>
        <form onSubmit={(event) => event.preventDefault()}>
          <input
            type="text"
            className="todo-input"
            id="task"
            placeholder="タスク"
            value={todo}
            onChange={handleChange}
          ></input>
          <input type="button" value="add" onClick={addNewTask}></input>
        </form>
        <div className="filters">
          <label htmlFor="">
            <input
              type="radio"
              value="all"
              onChange={handleFilterChange}
              checked={filter === "all"}
            />
            all
          </label>
          <label htmlFor="">
            <input
              type="radio"
              value="complete"
              onChange={handleFilterChange}
              checked={filter === "complete"}
            />
            complete
          </label>
          <label htmlFor="">
            <input
              type="radio"
              value="incomplete"
              onChange={handleFilterChange}
              checked={filter === "incomplete"}
            />
            incomplete
          </label>
        </div>
      </div>
      <table id="tasks">
        <thead>
          <tr>
            <th>S.N.</th>
            <th>Task</th>
            <th>Status</th>
            <th>Checkbox</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>{todoListItems}</tbody>
      </table>
    </div>
  );
}

export default Todo;
