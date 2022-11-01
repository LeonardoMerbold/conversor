import './App.css';
import React from 'react';
import Conversor from "./components/Conversor";
import CurrencyProvider from "./contexts/Currency";

function App() {

  return (
    <div className="App">
          <CurrencyProvider>
            <Conversor />
          </CurrencyProvider>
    </div>

  );
}

export default App;
