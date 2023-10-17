import React, { useEffect, useState } from "react";
import { LinearProgress, TextField } from "@mui/material";
import { HeaderComponent } from "../components/app-header";
import { AccountInfo } from "../components/account-info";
import { CredentialsInfo } from "../components/credentials";
import { useNavigate } from "react-router-dom";
import { ExtensionService } from "../services/Extension.service";
export const Home = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const [filter, setFilter] = useState(null);

  const getCredentials = async () => {
    const { credWallet } = await ExtensionService.getInstance();
    if (filter) {
      try {
        const credentials = await credWallet.findByQuery(JSON.parse(filter));
        setCredentials(credentials);
      } catch (err) {
        setCredentials([]);
      }
    } else {
      const credentials = await credWallet.list();
      setCredentials(credentials);
    }
  };

  useEffect(() => {
	  const accounts = JSON.parse(localStorage.getItem('accounts'));
	  if(!accounts || accounts.length <= 0) {
		  navigate('/welcome');
	  } else {
		  setAccounts(accounts);
	  }
    window.addEventListener("storage", () => {
      console.log("Change to local storage!");
      const accounts = JSON.parse(localStorage.getItem("accounts"));
      setAccounts(accounts ? accounts : []);
      if(!accounts || accounts.length <= 0) {
        navigate('/welcome');
      }
    });
	  getCredentials().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleCredentialDelete = async (credentialId) => {
    const { credWallet } = await ExtensionService.getInstance();
    await credWallet.remove(credentialId);
    await getCredentials().catch(console.error);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {accounts.length <= 0 && <p>Redirecting...</p>}
      {accounts.length > 0 && (
        <div>
          <HeaderComponent />
          <AccountInfo accounts={accounts} />
          <TextField
            label="Query"
            type="text"
            multiline={true}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <hr />
          <CredentialsInfo
            credentials={credentials}
            onDeleteCredential={handleCredentialDelete}
          />
        </div>
      )}
    </div>
  );
};
