import React, { useEffect } from 'react';
// import { useEffect } from 'react';
import './App.css';
import { transactionData } from './data/transactionData';
import { useTransaction } from './hooks/useTransaction';

function App() {
  const {
    create,
    loading,
    response,
  } = useTransaction();
/** /
  const handleClick = () => {
    // TODO: Update with actual data
    create(transactionData)
  }
/**/
  useEffect(() => {
    create(transactionData);
  }, []);

  // TODO: Refactor to not use `useEffect`
  useEffect(() => {
    if(!!response?.redirect_url) {
      window.location.replace(response.redirect_url)
    }
  }, [response])

  return (
    <div className="App">
      {/* <button onClick={handleClick}>Test</button> */}
      {loading && (<p>Loading...</p>)}
    </div>
  );
}

export default App;
