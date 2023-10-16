import React, { useEffect, useState } from 'react';
import { Home, Welcome, Auth, NewAccount } from './pages';
import { Routes, Route } from 'react-router-dom';
import { ExtensionService } from './services/Extension.service';
import { IdentityService } from "./services/Identity.service";
import './App.css';
import CircularProgress from '@mui/material/CircularProgress';

async function ensureAccount() {
  const accounts = JSON.parse(localStorage.getItem("accounts"));
  if (!accounts || accounts.length <= 0) {
    const { did } = await IdentityService.createIdentity();
    localStorage.setItem(
      "accounts",
      JSON.stringify([
        {
          name: "Automatic",
          did: did.string(),
          isActive: true,
        },
      ])
    );
  }
}

function App() {
  const [inited, setInited] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      await ExtensionService.getInstance();
      await ensureAccount();
      setInited(true);
    })().catch((err) => {
      setError(err.message);
      console.error(err)
    });
  }, []);

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
      </Routes>) : (<CircularProgress/>)
      }
    </div>
  );
}

export default App;
