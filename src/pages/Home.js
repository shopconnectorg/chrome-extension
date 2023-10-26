import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AccountInfo } from "../components/account-info";
import PurchaseHistory from "../components/History";
import DealList from "../components/DealList";
import { ExtensionService } from "../services/Extension.service";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Checkbox } from "../components/ui/checkbox";
import { useShopConnectStore } from "../utils/store";
import { useShopConnect } from "../utils/hooks";
import { OldHome } from './old/Home';

export const Home = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [credentials, setCredentials] = useState([]);
  const { fetchPromotions } = useShopConnect();
  const { promotions } = useShopConnectStore((state) => state);
  const [oldUi, setOldUi] = useState(false);
  const [availablePromotions, setAvailablePromotions] = useState([]);
  const [otherPromotions, setOtherPromotions] = useState([]);

  const getCredentials = async () => {
    const { credWallet } = await ExtensionService.getInstance();
    // todo find by query
    const credentials = await credWallet.list();
    setCredentials(credentials);
  };

  const filterPromotions = async (promotions) => {
    const { credWallet } = await ExtensionService.getInstance();
    const available = [];
    const other = [];
    for await (const promotion of promotions) {
      const [{ query }] = promotion.authRequest.body.scope;
      const credentials = await credWallet.findByQuery(query);
      console.log('Credentials', credentials);
      if (credentials.length > 0) {
        available.push(promotion);
      } else {
        other.push(promotion);
      }
    }
    setAvailablePromotions(available);
    setOtherPromotions(other);
  }

  useEffect(() => {
    console.log('All Promotions', promotions);
    filterPromotions(promotions).catch(console.error);
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
  }, []);

  useEffect(() => {
    if (accounts.length > 0) {
      const [{ did }] = accounts;
      fetchPromotions(did);
    }
  }, [accounts]);

  return (
    <>
      <div className="absolute top-1 right-1 z-50	">
        <Checkbox checked={oldUi} onCheckedChange={() => setOldUi(!oldUi)} />
      </div>
      {oldUi ? (
        <OldHome />
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
                  <DealList promotions={availablePromotions} applicable={true} />
                </TabsContent>
                <TabsContent value="other-deals">
                  <DealList promotions={otherPromotions} />
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
