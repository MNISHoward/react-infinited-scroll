import './App.css';
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import FixFunction from './demo/FixFunction';
import FixClass from './demo/FixClass';
import DynamicFunction from './demo/DynamicFunction';
import DynamicClass from './demo/DynamicClass';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" >
          <Route path="fixfunc" element={<FixFunction />} />
          <Route path="dynafunc" element={<DynamicFunction />} />
          <Route path="fixclass" element={<FixClass />} />
          <Route path="dynaclass" element={<DynamicClass />} />
          <Route
            index
            element={<Navigate to="dynaclass" />}
          />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
