import { createContext, useContext, useCallback, useEffect, useState } from "react";

const CurrencyContext = createContext({});

// interface CurrencyProps {
//   options: string,
//   loading: string,
//   children?: any,
// };

export function CurrencyProvider({children}: {children: React.ReactNode} ){

    const [options, setOptions] = useState({});

    const reqCurrency = async () => {

        const APIResponse = await fetch("https://economia.awesomeapi.com.br/json/available/uniq");

        if(APIResponse.status === 200) {
            const data = await APIResponse.json();
            return data;
        }
    }

    const fetchOptions = useCallback(async () => {
      try {
        const data = await (reqCurrency())
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
          {children}
      </CurrencyContext.Provider>
    )
}

export function useCurrency(){

  const context = useContext(CurrencyContext);

  return context;
}

export default CurrencyProvider;
