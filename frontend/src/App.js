import React from 'react';
import './assets/App.css';
import CustomerTable from './components/CustomerTable';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Customer Table</h1>
        <ErrorBoundary>
          <CustomerTable />
        </ErrorBoundary>
      </header>
    </div>
  );
}

export default App;
