import React, { useEffect, useCallback, useState } from 'react';
import './App.css';
import Conversor from './components/Conversor';


function App() {

  const [options, setOptions] = useState(null);

  const reqAcurrency = async () => {

    const APIResponse = await fetch("https://economia.awesomeapi.com.br/json/available/uniq");

    if(APIResponse.status === 200) {
        const data = await APIResponse.json();
        return data;
    }
}

  const fetchOptions = useCallback(async () => {
    try {
      const data = await (reqAcurrency())
      setOptions(data);

     } catch (ex) {

      setOptions({});
    }
  }, [setOptions]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions])

  if(options === null){
    return <h1>Loading...</h1>
  }

  return (
    <div className="App">
        <Conversor options={options} />
    </div>

  );
}

export default App;
