import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Invoice from './components/Invoice'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/invoice/:order_id' element={<Invoice />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
