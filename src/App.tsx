import Conversor from 'components/Conversor';
import CurrencyProvider from "contexts/Currency";

export default function App() {

  return (
    <div className="App">
          <CurrencyProvider>
            <Conversor />
          </CurrencyProvider>
    </div>

  );
}
