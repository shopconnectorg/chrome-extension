import React, { useEffect, useState } from 'react';
import { Home, Welcome, Auth, Auth2, NewAccount } from './pages';
import { Routes, Route } from 'react-router-dom';
import { ExtensionService } from './services/Extension.service';
import './App.css';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const [inited, setInited] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(()=>{
    ExtensionService.getInstance()
      .then(() => setInited(true))
      .catch(err => {
        setError(err.message)
        console.error(err);
      });
      chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'backgroundToPopup') {
          console.log(request.data);
          // Process the message, for example, fetching data or performing an action
          const data = "Data from the background script";
          
          // Send the data back to the popup
          sendResponse({ data });
        }
      });
      // chrome.runtime.sendMessage({ action: 'popupToBackground', data: 'Hello from the popup' }, function(response) {
      //   if (response) {
      //     // Handle the response from the background script
      //     console.log('Response from background:', response);
      //   }
      // });
  }, [])

  return (
    <div className="App">
      {!inited && error && <div>
        <h6>{error}</h6>
      </div>}
      { inited && !error ? (<Routes>
        <Route path={'/'} element={<Home/>}/>
        <Route path={'/welcome'} element={<Welcome/>} />
        <Route path={'/auth'} element={<Auth/>} />
        <Route path={'/newAccount'} element={<NewAccount/>} />
        <Route path={'/auth2'} element={<Auth2/>} />
      </Routes>) : (<CircularProgress/>)
      }
    </div>
  );
}

export default App;
