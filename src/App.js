import { useEffect, useCallback, useState } from 'react';
import './App.css';

import Conversor from './components/Conversor';

function App() {

  const [options, setOptions] = useState(null);

  const req2 = async () => {

    const APIResponse = await fetch("https://economia.awesomeapi.com.br/json/available/uniq");

    if(APIResponse.status === 200) {
        const data = await APIResponse.json();
        return data;
    }
}
  //console.log(req2())

  const fetchOptions = useCallback(async () => {
    try {
      const data = await (req2())
      setOptions(data);

      // desenvolver minha funcao pra dar fetch aqui e atribuir ao setOptions
     } catch (ex) {
      // Caso der erro, atribuir um array vazio as opcoes, para sair do Loading
      setOptions({});
    }
  }, [setOptions]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions])

  if(options === null){
    return <h1>loading...</h1>
  }
  return (
    <div className="App">
      <Conversor options={options} />
    </div>
  );
}

export default App;
