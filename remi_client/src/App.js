import './App.css';
import { Route, Routes } from 'react-router';
import { Layout } from './components/LayoutComponent';
import SelectEntity from './components/SelectEntityComponent';
import Report from './components/ReportComponent'; 
function App() {
  return (
    <Layout>
      <Routes>
        <Route exact path='/' element={<SelectEntity/>} />
        <Route exact path='/report' element={<Report/>} />
      </Routes>
    </Layout>
  );
}

export default App;
