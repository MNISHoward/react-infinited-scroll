import './App.css';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import FixFunction from './demo/FixFunction';
import FixClass from './demo/FixClass';
import DynamicFunction from './demo/DynamicFunction';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" >
          <Route path="fixfunc" element={<FixFunction />} />
          <Route path="dynafunc" element={<DynamicFunction />} />
          <Route path="fixclass" element={<FixClass />} />
          <Route
            index
            element={<Navigate to="dynafunc" />}
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
