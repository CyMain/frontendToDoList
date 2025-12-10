import './App.css'
import {useCallback, useEffect, useRef, useState} from 'react'

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

//global functions
function getCurrentDate(){
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth()+1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate
}

//Components
const SearchBar = (
  {
    searchHandlerQuery,
    queryRef,
    tags,
    tagRef,
    toCreateView
  }
)=>{
  return(
    <div id="search-container">
      <input type="text" name="" id="search-bar"  ref={queryRef}/>
      <button type="button" id="search-button" onClick={searchHandlerQuery}>Search</button>
      <label htmlFor="tags">Category: </label>
      <select name="tags" id="tagsselect" onChange={searchHandlerQuery} ref={tagRef}>
        <option value="none">None</option>
        {
          tags.map((tag, index) => <option key={index} value={tag}>{tag}</option>)
        }
      </select>
      <button type="button" onClick={()=>{toCreateView(
        {
          title:"",
          desc:"",
          completed:"false",
          dateCreated: getCurrentDate(),
          tag:"",
        }
      )}}>+</button>
    </div>
  )
}

const List = (
  {list, deleteTodo, toEditView}
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
                  <button type="button" className="edit-button" onClick={()=>{
                    toEditView(
                      todo
                    )
                  }}>Edit</button>
                  <button type="button" className="delete-button" onClick={()=>deleteTodo(todo.id)}>Delete</button>
                </div>
              </div>
            </li>
          )
        }
      </ul>
    </div>
  )
}

const CreateEditView = ({currEditTodo, toListView, operTodo, view, tagsList})=>{
  const title = useRef(null)
  const desc = useRef(null)
  const tag = useRef(null)
  const [tagType, setTagType] = useState(
        currEditTodo && currEditTodo.tag && currEditTodo.tag == "none" ? "new" : "existing"
  );
  const handleOper = ()=>{
    const operTodoData = {
      id: currEditTodo.id,
      title: title.current ? title.current.value : "",
      desc: desc.current ? desc.current.value : "",
      tag: tag.current ? tag.current.value : "none",
      dateCreated: currEditTodo.dateCreated,
      completed: currEditTodo.completed,
    }
    operTodo(operTodoData)
  }

  const handleRadioChange=(e)=>{
    console.log(`Tag type selected: ${e.target.value}`)
    setTagType(e.target.value)
  }
  
  return(
    <div className="todo-edit-create-view">
      <h1>Create a new Todo</h1>
      <fieldset>
        <legend>Title:</legend>
        <input
          type="text"
          name="title"
          id="task-title"
          placeholder='Enter a title'
          ref={title}
          defaultValue={currEditTodo.title}
        />
      </fieldset>
      <fieldset>
        <legend>Desc:</legend>
        <textarea
          type="text"
          name="title"
          id="task-desc"
          placeholder='Enter a description'
          ref={desc}
          defaultValue={currEditTodo.desc? currEditTodo.desc : "" }
        ></textarea>
      </fieldset>
      <fieldset>
        <legend>Tag:</legend>
        <div className="tag-options">
          <label htmlFor="newtagradio">New Tag</label>
          <input
           type="radio"
           name='tagradio'
           id='newtagradio'
           value="new"
           onChange={handleRadioChange}
           checked = {tagType=="new"}
          />
          <label htmlFor="extagradio">Existing Tag</label>
          <input
           type="radio"
           name='tagradio'
           id='extagradio'
           value="existing"
           checked = {tagType=="existing"}
           onChange={handleRadioChange}/>
        </div>
        <div className="tag-option">
          {
            tagType==="new" ? (
              <input
                type="text"
                name="newtaginput"
                id="newtaginput"
                placeholder='Enter new tag name'
                ref = {tag}
                defaultValue={currEditTodo.tag? currEditTodo.tag : ""}
              />
            ):(
              <select
               name="extagselect"
               id=""
               className="extagoptions"
               ref={tag}
               defaultValue={currEditTodo.tag || "none"}
              >
                <option value="none">None</option>
                {
                  tagsList && tagsList.length > 0 ? (
                    tagsList.map((tagOption, index)=>(
                      <option key={index} value={tagOption}>{tagOption}</option>
                    ))
                  ) : null
                }
              </select>
            )
          }
        </div>
      </fieldset>
      <button type="button" id="create-todo-button" onClick={handleOper}>{view === "create"?"Create Todo" : "Edit Todo"}</button>
      <button type="button" id="back-to-list-button" onClick={toListView}>Back to List</button>
    </div>
  )
}

const ListView = (
  {
    searchHandlerQuery,
    queryRef,
    tags,
    tagRef,
    list,
    deleteTodo,
    toEditView,
    toCreateView
  }
)=>{
  return(
    <div id="list-display-view">
      <SearchBar
        searchHandlerQuery= {searchHandlerQuery}
        queryRef= {queryRef}
        tags = {tags}
        tagRef={tagRef}
        toCreateView = {toCreateView}
      />
      <List
        list = {list}
        deleteTodo={deleteTodo}
        toEditView={toEditView}
      />
    </div>
  )
}

//Main Component
function App() {
  const [initialTodos, setInitialTodos] = useState(todos)
  const [currTodos, setCurrTodos]= useState(initialTodos)
  let tags = []
  const query = useRef("")
  const selectedTag = useRef("none")
  const [view, setView] = useState("list") //list or edit/create
  let [currEditTodo, setCurrEditTodo] = useState({
    title:"",
    desc:"",
    completed:"false",
    dateCreated: Date.now,
    tag:"none",
  })

  //App Component Handlers
  function toCreateView({id, title, desc, tag, dateCreated, completed}){
    console.log(`entering edit view for todo id: ${id}`)
    const ncurrEditTodo = {...currEditTodo}
    ncurrEditTodo.id = id ? id : (initialTodos.length + 1)
    ncurrEditTodo.title = title ? title : ""
    ncurrEditTodo.desc = desc ? desc : ""
    ncurrEditTodo.tag = tag ? tag : "none"
    ncurrEditTodo.dateCreated = dateCreated ? dateCreated : Date.now
    ncurrEditTodo.completed = completed ? completed : false
    setCurrEditTodo(ncurrEditTodo)
    setView("create")
  }
  function toEditView({id, title, desc, tag, dateCreated, completed}){
    console.log(`entering edit view for todo id: ${id}`)
    const ncurrEditTodo = {...currEditTodo}
    ncurrEditTodo.id = id ? id : null
    ncurrEditTodo.title = title ? title : ""
    ncurrEditTodo.desc = desc ? desc : ""
    ncurrEditTodo.tag = tag ? tag : "none"
    ncurrEditTodo.dateCreated = dateCreated ? dateCreated : Date.now
    ncurrEditTodo.completed = completed ? completed : false
    setCurrEditTodo(ncurrEditTodo)
    setView("edit")
  }
  function toListView(){
    console.log("returning to list view")
    setView("list")
  }
  const todosFilterHandler= useCallback(()=>{
    const queryValue = query.current.value.toLowerCase()
    const tagValue = selectedTag.current.value
    console.log(`Filtering todos with query: ${queryValue} and tag: ${tagValue}`)
    setCurrTodos(
      initialTodos.filter(todo => {
        const matchesQuery = todo.title.toLowerCase().includes(queryValue) ||
                             (todo.desc && todo.desc.toLowerCase().includes(queryValue))
        const matchesTag = tagValue === "none" || todo.tag === tagValue
        return matchesQuery && matchesTag
      })
    )
  }, [initialTodos])

  const editTodo = ({id, title, desc, tag, dateCreated, completed}) => {
    console.log(`editting todo of id ${id}`)
    console.log(`Editting: ${title}, ${desc}, ${tag}, ${dateCreated}, ${completed}`)
    const todosHolder = initialTodos.map(todo=>{
      if (todo.id == id){
        return{
          ...todo,
          title: title,
          desc: desc,
          completed: completed,
          dateCreated: dateCreated,
          tag: tag
        }
        
      }
      return todo
    })
    setInitialTodos(todosHolder)
    toListView()
  }
  const createTodo = ({id, title, desc, tag, dateCreated, completed}) => {
    console.log(`creating todo of id ${id}`)
    console.log(`creating: ${title}, ${desc}, ${tag}, ${dateCreated}, ${completed}`)
    const todosHolder = initialTodos.map(todo=>{
      if (todo.id == id){
        return{
          ...todo,
          title: title,
          desc: desc,
          completed: completed,
          dateCreated: dateCreated,
          tag: tag
        }
        
      }
      return todo
    })
    todosHolder.push({
      id: id,
      title: title,
      desc: desc,
      completed: completed,
      dateCreated: dateCreated,
      tag: tag
    })
    setInitialTodos(todosHolder)
    toListView()
  }

  function updateTags(){
    const alltags = initialTodos.map(todo=>todo.tag).filter(tag=>tag!==undefined)
    console.log(`All Tags: ${alltags}`)
    tags = [...new Set(alltags)]
  }

  useEffect(()=>{
    todosFilterHandler() // Also filter when todos change
  }, [initialTodos, todosFilterHandler])

  function deleteTodoHandler(id){
    setInitialTodos(
      initialTodos.filter(
        todo => todo.id !== id
      )
    )
  }

  updateTags()

  return(
    <main>
      <header className="app-header">
        <h1>Cy's To-Do List</h1>
      </header>
      {
        view === "create"? (
          <CreateEditView currEditTodo={currEditTodo} toListView = {toListView} operTodo= {createTodo} view = "create" tagsList = {tags}/>
        ):(
        view==="edit" ? (
          <CreateEditView currEditTodo={currEditTodo} toListView = {toListView} operTodo = {editTodo} view = "edit" tagsList = {tags}/>
        ) :(
          <ListView
            searchHandlerQuery={todosFilterHandler}
            queryRef={query}
            tags={tags}
            tagRef={selectedTag}
            list={currTodos}
            deleteTodo = {deleteTodoHandler}
            toEditView={toEditView}
            toCreateView={toCreateView}
          />
        ))
      }
    </main>
  )
}

export default App
