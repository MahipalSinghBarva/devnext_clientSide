import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './component/Navbar';
import Quiz from './component/Quiz';
import ShowData from './component/ShowData';

function App() {

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Quiz />} />
        <Route path='/data' element={<ShowData />} />
      </Routes>
    </Router>
  );
}

export default App;
