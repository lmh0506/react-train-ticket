import React, {memo,useState, useCallback, useRef, useEffect} from 'react'
import './App.css'
let idSeq = new Date().getTime()
const LS_KEY = '_$_todo_'

const Control = memo((props) => {
  console.log('render Control:', props)
  const { dispatch } = props
  const inputRef = useRef()

  const onSubmit = e => {
    e.preventDefault()
    const newText = inputRef.current.value.trim()

    newText && dispatch({type: 'add', payload: {
      id: ++idSeq,
      text: newText,
      complete: false
    }})

    inputRef.current.value = ''
  }

  return <div className="control">
    <h1>todos</h1>
    <form onSubmit={onSubmit}>
      <input ref={inputRef} type="text" className="new-todo" placeholder="what needs tobe done"/>
    </form>
  </div>
})

const TodoItem = memo((props) => {
  console.log('render TodoItem:', props)
  const {
    todo: {
      id,
      text,
      complete
    }, 
    dispatch
  } = props

  const onChange = () => {
    dispatch({type: 'toggle', payload: id})
  }

  const onRemove = () => {
    dispatch({type: 'remove', payload: id})
  }
  
  return (
    <li className="todo-item">
      <input type="checkbox" onChange={onChange} checked={complete}/>
      <label className={complete ? 'complete' : ''}>{text}</label>
      <button onClick={onRemove}>X</button>
    </li>
  )
})

const Todos = memo(props => {
  console.log('render Todos:', props)
  const {todos, dispatch} = props

  return <ul>
    {
      todos.map(todo => {
        return <TodoItem key={todo.id} todo={todo} dispatch={dispatch}></TodoItem>
      })
    }
  </ul>
})

function ToDoList() {
  const [todos, setTodos] = useState([])

  // const addTodo = useCallback((todo) => {
  //   setTodos(todos => [...todos, todo])
  // }, [])

  // const removeTodo = useCallback((id) => {
  //   setTodos(todos => todos.filter(todo => todo.id !== id))
  // }, [])

  // const toggleTodo = useCallback((id) => {
  //   setTodos(todos => todos.map(todo => {
  //     return todo.id === id ? {
  //       ...todo,
  //       complete: !todo.complete
  //     } : todo
  //   }))
  // }, [])

  

const dispatch = useCallback(({type, payload}) => {
  switch(type) {
    case 'set':
      setTodos(payload)
      break;
    case 'add':
      setTodos(todos => [...todos, payload])
      break;
    case 'remove':
      setTodos(todos => todos.filter(todo => todo.id !== payload))
      break;
    case 'toggle':
      setTodos(todos => todos.map(todo => {
        return todo.id === payload ? {
          ...todo,
          complete: !todo.complete
        } : todo
      }))
      break;
    default:
  }
}, [])

  useEffect(() => {
    const todos = localStorage.getItem(LS_KEY) || []
    console.log(todos)
    dispatch({type: 'set', payload: JSON.parse(todos)})
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(todos))
  }, [todos])

  return <div className="todo-list">
    <Control dispatch={dispatch}></Control>
    <Todos dispatch={dispatch} todos={todos}></Todos>
  </div>
}

export default ToDoList
