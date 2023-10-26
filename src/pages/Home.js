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
import { useShopConnect } from "../utils/hooks";

export const Home = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const { fetchPromotions } = useShopConnect();
  const { promotions } = useShopConnectStore((state) => state);
  const [oldUi, setOldUi] = useState(false);
  const [availablePromotions, setAvailablePromotions] = useState([]);

  const getCredentials = async () => {
    const { credWallet } = await ExtensionService.getInstance();
    // todo find by query
    const credentials = await credWallet.list();
    setCredentials(credentials);
  };

  useEffect(() => {
    console.log(promotions);
    (async () => {
      const { credWallet } = await ExtensionService.getInstance();
      const available = [];
      for (const promotion of promotions) {
        const [{ query }] = promotion.authRequest.body.scope;
        const credentials = credWallet.findByQuery(query);
        if (credentials.length > 0) {
          availablePromotions.push(promotion);
        }
      }
      setAvailablePromotions(available);
    })().catch(console.error);
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

  const getOtherPromotions = () => {
    return promotions.filter((promo) => !availablePromotions.includes(promo));
  }

  useEffect(() => {
    if (accounts.length > 0) {
      fetchPromotions(accounts[0].did);
    }
  }, [accounts]);

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
                  <DealList promotions={availablePromotions} />
                </TabsContent>
                <TabsContent value="other-deals">
                  <DealList promotions={getOtherPromotions()} />
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
