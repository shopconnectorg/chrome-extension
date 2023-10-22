import React, { useEffect, useState } from "react";
import { AccountInfo, OldAccountInfo } from "../components/account-info";
import { CredentialsInfo } from "../components/credentials";
import PurchaseHistory from "../components/History";
import DealList from "../components/DealList";
import { useNavigate } from "react-router-dom";
import { ExtensionService } from "../services/Extension.service";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Checkbox } from "../components/ui/checkbox";
import { HeaderComponent } from "../components/app-header";
import { useShopConnectStore } from "../utils/store";

export const Home = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [credentials, setCredentials] = useState([]);

  // Promotions data
  const { promotions } = useShopConnectStore((state) => state);

  const [oldUi, setOldUi] = useState(false);

  const getCredentials = async () => {
    const { credWallet } = await ExtensionService.getInstance();
    // todo find by query
    const credentials = await credWallet.list();
    setCredentials(credentials);
  };

  // console log promotions when it changes
  useEffect(() => {
    console.log(promotions);
  }, [promotions]);

  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem("accounts"));
    if (!accounts || accounts.length <= 0) {
      navigate("/welcome");
    } else {
      setAccounts(accounts);
    }
    window.addEventListener("storage", () => {
      console.log("Change to local storage!");
      const accounts = JSON.parse(localStorage.getItem("accounts"));
      setAccounts(accounts ? accounts : []);
      if (!accounts || accounts.length <= 0) {
        navigate("/welcome");
      }
    });
    getCredentials().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCredentialDelete = async (credentialId) => {
    const { credWallet } = await ExtensionService.getInstance();
    await credWallet.remove(credentialId);
    await getCredentials().catch(console.error);
  };

  return (
    <>
      <div className="absolute top-1 right-1 z-50	">
        <Checkbox checked={oldUi} onCheckedChange={() => setOldUi(!oldUi)} />
      </div>
      {oldUi ? (
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {accounts.length <= 0 && <p>Redirecting...</p>}
          {accounts.length > 0 && (
            <div>
              <HeaderComponent />
              <OldAccountInfo accounts={accounts} />
              <CredentialsInfo
                credentials={credentials}
                onDeleteCredential={handleCredentialDelete}
              />
            </div>
          )}
        </div>
      ) : (
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          {accounts.length <= 0 && <p>Redirecting...</p>}
          {accounts.length > 0 && (
            <div>
              <AccountInfo accounts={accounts} />
              <Tabs defaultValue="available-deals" className="w-[400px]">
                <TabsList className="ml-3">
                  <TabsTrigger value="available-deals">
                    Available Deals
                  </TabsTrigger>
                  <TabsTrigger value="other-deals">Other Deals</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="available-deals">
                  <DealList />
                </TabsContent>
                <TabsContent value="other-deals">
                  <DealList />
                </TabsContent>
                <TabsContent value="history">
                  <PurchaseHistory credentials={credentials} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      )}
    </>
  );
};
