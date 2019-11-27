import React, {createContext, memo, Component, useState, useEffect, useContext, useMemo, useCallback, useRef} from 'react';
import logo from './logo.svg';
import TodoList from './ToDoList'
import './App.css';

const BatteryContext = createContext()
const TestContext = createContext('asd')

const Foo = memo(props => {
  console.log('render')
  // 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。
  // 只能在 React 的函数组件中调用 Hook。不要在其他 JavaScript 函数中调用
  const [count, setCount] = useState(() => {
    return props.defaultCount || 0
  })
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  
  const onResize = () => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  const test = useContext(TestContext)
  const batter = useContext(BatteryContext)
  
  useEffect(() => {
    console.log(size)
    document.title = 'click me' + count
  // eslint-disable-next-line
  }, [count]) // 仅在count更新时执行

  // 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）
  // 作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行
  useEffect(() => {
    window.addEventListener('resize', onResize, false)
    return () => {
      window.addEventListener('resize', onResize, false)
    }
  }, [])

  return (
    <div>
      <p>test: {test}</p>
      <p>batter: {batter}</p>
      <button onClick={() => setCount(count + 1)}>button({count}),[{size.width}*{size.height}]</button>
    </div>
  )
})

class Leaf extends Component {
  // contextType只能定义一个
  static contextType = BatteryContext
  render() {
    console.log(this.context)
    const batter = this.context
    return (
      // <BatteryContext.Consumer>
        <p>context: {batter}</p>
      // </BatteryContext.Consumer>
    )
  }
}

const Middle = memo(props => {
  console.log('render middle')
  const leafRef = useRef()

  useEffect(() => {
    console.log(leafRef)
  })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p onClick={props.onClick}>double: {props.double}</p>
        <Leaf ref={leafRef}></Leaf>
        <Foo></Foo>
      </header>
    </div>
  )
})

function App(props) {
  const [count, setCount] = useState(0)
  const [batter, setBatter] = useState(30)

  const onChange = () => {
    setCount(count + 1)
    setBatter(batter - 1)
  }
  const double = useMemo(() => {
    return count * 2
  // eslint-disable-next-line
  }, [count === 3])

  const onClick = useCallback(
    () => {
      console.log('click me')
    },
    [],
  )

  return (
    <div>
      <BatteryContext.Provider value={batter}>
        {/* 只有当组件所处的树中没有匹配到 Provider 时，createContext 的 defaultValue 参数才会生效 */}
        {/* <TestContext.Provider> */}
          <TodoList></TodoList>
          <button onClick={onChange}>click me</button>
          <Middle double={double} onClick={onClick}></Middle>
        {/* </TestContext.Provider> */}
      </BatteryContext.Provider>
    </div>
  );
}

export default App;
