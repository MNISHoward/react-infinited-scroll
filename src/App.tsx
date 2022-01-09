import React from 'react';
import './App.css';
import faker from 'faker'

function App() {
  const name = faker.name.firstName(1);
  return (
    <div className="container">
     { name }
    </div>
  );
}

export default App;
