import './App.css'
import {useState} from 'react'

//Global vars
//Sample Data for use
const todos = [
    {
        id: 1,
        title: "Learn ExpressJS",
        desc:"Follow that one video",
        tag:"learning",
        dateCreated: "2024-06-01",
        completed: true,
    },
    {
        id: 2,
        title: "Build a ToDo List App",
        tag:"coding",
        dateCreated: "2024-06-01",
        completed: false
    },
    {
        id: 3,
        title: "Test the App",
        desc:"Test using Postman.",
        tag:"coding",
        dateCreated: "2024-06-01",
        completed: true
    }
]

//Components
const SearchBar = ()=>{
  return(
    <div id="search-container">
      <input type="text" name="" id="search-bar" />
      <button type="button" id="search-button">Search</button>
    </div>
  )
}

const List = (
  {list}
)=>{
  return(
    <div id="list-container">
      <ul id="todo-list">
        {
          list.map(todo=>
            <li className="todo-item" key={todo.id}>
              <div className="item-container">
                <div className="item-details">
                  <h3 className="item-title">{todo.title}</h3>
                  <p className="item-desc">{todo.desc||"No Description."}</p>
                  <div className="item-bottom">
                    <span className="item-tag">Tag: <em><strong>{todo.tag||"None"}</strong></em></span>
                    <span className="item-date">Date Created: {todo.dateCreated}</span>
                  </div>
                </div>
                <div className="item-buttons">
                  <button type="button" className="edit-button">Edit</button>
                  <button type="button" className="delete-button">Delete</button>
                </div>
              </div>
            </li>
          )
        }
      </ul>
    </div>
  )
}

//Main Component
function App() {
  const [currTodos, setCurrTodos]= useState(todos)

//App Component Handlers
function todosFilterHandler(query){
  setCurrTodos(
    todos.filter(
      todo => 
        todo.title.toLowerCase().includes(query.toLowerCase())||
        todo.desc.toLowerCase().includes(query.toLowerCase())
    )
  )
}
  return(
    <main>
      <header className="app-header">
        <h1>Cy's To-Do List</h1>
      </header>
      <div id="list-display-section">
        <SearchBar searchHandlerQuery={todosFilterHandler}/>
        <List list={currTodos}/>
      </div>
    </main>
  )
}

export default App
