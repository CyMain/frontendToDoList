import './App.css'
import {useCallback, useEffect, useReducer, useRef, useState} from 'react'

//Global vars
//Sample Data for use

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
    || `http://127.0.0.1:8000/api/todos`;

//global functions
// function getCurrentDate(){
//   const date = new Date();
//   const year = date.getFullYear();
//   const month = String(date.getMonth()+1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   const formattedDate = `${year}-${month}-${day}`;
//   return formattedDate
// }

//Reducer Functions
const getTodosReducer = (state, action)=>{
  switch (action.type){
    case "FETCH_TODOS_INIT":
      return {
        ...state,
        isLoading:true,
        isError:false,
      }
    case "FETCH_TODOS_SUCCESS":
      return {
        ...state,
        isLoading:false,
        isError:false,
        list: action.payload.list,
        tags: action.payload.tags,
      }
    case "FETCH_TODOS_FAILURE":
      return {
        ...state,
        isLoading:false,
        isError:true,
      }
    default:
      throw new Error("Unhandled action type in getTodosReducer")
  }
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
          tag:"",
        }
      )}}>+</button>
    </div>
  )
}

const List = (
  {list, deleteTodo, toEditView, isLoading, isError}
)=>{
  return(
    <div id="list-container">
      {isError ?
        <div className="error-message">Something went wrong while fetching todos.</div>
        :
        <ul id="todo-list">
          {isLoading ?
            <div className="loading-message">Loading todos...</div>
            :
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
      }
    </div>
  )
}

const CreateEditView = ({currEditTodo, toListView, operTodo, view, tagsList})=>{
  const title = useRef(null)
  const desc = useRef(null)
  const tag = useRef(null)
  const completedYes = useRef(null)
  const completedNo = useRef(null)
  const [tagType, setTagType] = useState(
        currEditTodo && currEditTodo.tag && currEditTodo.tag == "none" ? "new" : "existing"
  );
  const handleOper = (e)=>{
    e.preventDefault()
    const operTodoData = {
      id: currEditTodo.id,
      title: title.current ? title.current.value : "",
      desc: desc.current ? desc.current.value : "",
      tag: tag.current ? tag.current.value : "none",
      dateCreated: currEditTodo.dateCreated,
      completed: completedYes.current && completedYes.current.checked ? true : false,
    }
    operTodo(operTodoData)
  }

  const handleRadioChange=(e)=>{
    console.log(`Tag type selected: ${e.target.value}`)
    setTagType(e.target.value)
  }
  
  return(
    <>
      <header className="app-header">
        <h1>Update Your To-Do</h1>
      </header>
      <form className="todo-edit-create-view" onSubmit={handleOper} method = {view == "edit"?"PUT":"POST"}>
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
        <fieldset>
          <legend>Completed:</legend>
          <label htmlFor="completeradio">Yes</label>
          <input type="radio" name='completedRadio' id="completeradio" ref={completedYes}/>
          <label htmlFor="notcompleteradio">No</label>
          <input type="radio" name='completedRadio' id="notcompleteradio" ref={completedNo}/>
        </fieldset>
        <button type="submit" id="create-todo-button">{view === "create"?"Create Todo" : "Edit Todo"}</button>
        <button type="button" id="back-to-list-button" onClick={toListView}>Back to List</button>
      </form>
    </>
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
    toCreateView,
    isLoading,
    isError
  }
)=>{
  return(
    <>
      <header className="app-header">
        <h1>Cy's To-Do List</h1>
      </header>
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
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </>
  )
}

//Main Component
function App() {
  const [todos, dispatchTodos]= useReducer(getTodosReducer,{
    list:[], tags:[], isLoading:false, isError:false
  })
  const [tags, setTags] = useState(todos.tags || [])
  const query = useRef(null)
  const tagRef = useRef(null)
  const [view, setView] = useState("list") //list or edit/create
  let [currEditTodo, setCurrEditTodo] = useState({
    title:"",
    desc:"",
    completed:"false",
    dateCreated: Date.now,
    tag:"none",
  })

  //handlers
  const fetchTodosHandler = useCallback(()=>{
    dispatchTodos({type:"FETCH_TODOS_INIT"})
    let url = API_BASE_URL
    if(query.current && query.current.value){
      if (tagRef.current && tagRef.current.value && (tagRef.current.value !== "none")){
        url = `${url}/${tagRef.current.value}?key=${query.current.value}`
      }else{
        url =`${url}?key=${query.current.value}`
        console.log(`tagRef:${tagRef.current.value}`)
      }
    }

    fetch(url)
    .then(res=>res.json())
    .then(data=>{
      dispatchTodos({type:"FETCH_TODOS_SUCCESS", payload:data})
      setTags(data.tags)
    }).catch(error=>{
      console.error(`Fetch Error:`, error)
      dispatchTodos({type:`FETCH_TODOS_FAILURE`});
    });
  }, [dispatchTodos])

  function deleteTodoHandler(id){
    dispatchTodos({type:"FETCH_TODOS_INIT"})
    fetch(`${API_BASE_URL}/${id}`, {
      method:"DELETE",
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(`Delete Response: ${data.message}`)
      fetchTodosHandler()
    })
    .catch(error=>{
      console.error(`Error deleting todo: ${id}:`, error)
      dispatchTodos({type:`FETCH_TODOS_FAILURE`})
    })
  }

  //useEffect Hooks
  useEffect(()=>{
    fetchTodosHandler()
  }, [fetchTodosHandler])

  //App Component Handlers
  function toCreateView({id=null, title, desc, tag, completed}){
    console.log(`entering edit view for todo id: ${id}`)
    const ncurrEditTodo = {...currEditTodo}
    ncurrEditTodo.id = id
    ncurrEditTodo.title = title ? title : ""
    ncurrEditTodo.desc = desc ? desc : ""
    ncurrEditTodo.tag = tag ? tag : "none"
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
    console.log("returning to list view");
    fetchTodosHandler();
    setView("list");
  }

  const editTodoHandler = ({id, title=null, desc=null, tag=null, dateCreated=null, completed=false})=>{
    console.log(`editting todo of id ${id}`)
    console.log(`Editting: ${title}, ${desc}, ${tag}, ${dateCreated}, ${completed}`)
    fetch(`${API_BASE_URL}/${id}`, {
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        updatedTitle: title,
        updatedDesc: desc,
        updatedTag: tag,
        updatedCompleted: completed,
      })
    })
    .then(res => res.json())
    .then(resdata => {
      console.log(resdata)
      toListView()
    })
  }

  const createTodoHandler = ({id, title, desc, tag, dateCreated, completed})=>{
    console.log(`creating todo of id ${id}`)
    console.log(`creating: ${title}, ${desc}, ${tag}, ${dateCreated}, ${completed}`)
    fetch(`${API_BASE_URL}/`, {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({
        newTitle: title,
        newDesc: desc,
        newTag: tag,
      })
    })
    .then(res => res.json())
    .then(resdata => {
      console.log(resdata)
      toListView()
    })
    
  }
  return(
    <main>
      
      {
        view === "create"? (
          <CreateEditView currEditTodo={currEditTodo} toListView = {toListView} operTodo= {createTodoHandler} view = "create" tagsList = {tags}/>
        ):(
        view==="edit" ? (
          <CreateEditView currEditTodo={currEditTodo} toListView = {toListView} operTodo = {editTodoHandler} view = "edit" tagsList = {tags}/>
        ) :(
          <ListView
            searchHandlerQuery={fetchTodosHandler}
            queryRef={query}
            tags={tags}
            tagRef={tagRef}
            list={todos.list}
            deleteTodo = {deleteTodoHandler}
            toEditView={toEditView}
            toCreateView={toCreateView}
            isLoading={todos.isLoading}
            isError={todos.isError}
          />
        ))
      }
    </main>
  )
}

export default App
