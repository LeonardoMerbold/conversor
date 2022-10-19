import { createContext, useContext, useCallback, useEffect, useState } from "react";

const CurrencyContext = createContext({});

function CurrencyProvider(props){

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

    return (
      <CurrencyContext.Provider value={{options, fetchOptions, loading: options === null}} >
          {props.children}
      </CurrencyContext.Provider>
    )
}

export function useCurrency(){

  const context = useContext(CurrencyContext);

  return context;
}

export default CurrencyProvider;
