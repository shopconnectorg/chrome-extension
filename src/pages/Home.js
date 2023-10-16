import React, { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import { HeaderComponent } from "../components/app-header";
import { AccountInfo } from "../components/account-info";
import { CredentialsInfo } from "../components/credentials";
import { ExtensionService } from "../services/Extension.service";

export const Home = () => {
  const [credentials, setCredentials] = useState([]);
  const accounts = JSON.parse(localStorage.getItem("accounts"))

  const getCredentials = async () => {
    const { credWallet } = await ExtensionService.getInstance();
    // todo find by query
    const credentials = await credWallet.list();
    setCredentials(credentials);
  };

  useEffect(() => {
    getCredentials().catch(console.error);
  }, []);

  const handleCredentialDelete = async (credentialId) => {
    const { credWallet } = await ExtensionService.getInstance();
    await credWallet.remove(credentialId);
    await getCredentials().catch(console.error);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {accounts?.length > 0 ? (
        <div>
          <HeaderComponent />
          <AccountInfo accounts={accounts} />
          <CredentialsInfo
            credentials={credentials}
            onDeleteCredential={handleCredentialDelete}
          />
        </div>
      ) : (
        <div className="progress-indicator">
          <h2>Initalizing...</h2>
          <LinearProgress size={20} />
        </div>
      )}
    </div>
  );
};
