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

  // Mock data
  const dealsMockData = [
    {
      image:
        "https://athome.starbucks.com/sites/default/files/styles/carousel_415x347/public/2022-05/CAH_PDP_Vanilla_1842x1542_Ground_shadow.png.webp?itok=jyAVO26X",
      title: "Vanta Roast (18oz)",
      discount: "10%",
      expiry: "3 days",
      description: "Bought coffee in the past week",
      action: "Apply",
    },
    {
      image: "https://dam.delonghi.com/600x600/assets/223655",
      title: "Delonghi Magnifica S",
      discount: "$5",
      expiry: "1 week",
      description: "Recurring customer discount",
      action: "Apply",
    },
  ];

  const dealsMockData2 = [
    {
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/ee361960-9780-4d98-9aa5-f58822aa1789/air-force-1-07-shoes-3RD8Zk.png",
      title: "Nike Air Force 1 '07",
      discount: "20%",
      expiry: "2 weeks",
      description: "Spent over $500 in the past month",
      action: "Unlock",
    },
    {
      image:
        "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/dfa68bbe-e102-4e33-9b6e-6763e2a75f19/everyday-cushioned-training-crew-socks-FJSFHQ.png",
      title: "Nike Everyday Cushioned",
      discount: "$5",
      expiry: "1 week",
      description: "Recurring customer discount",
      action: "Unlock",
    },
  ];

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
                  <DealList data={dealsMockData} />
                </TabsContent>
                <TabsContent value="other-deals">
                  <DealList data={dealsMockData2} />
                </TabsContent>
                <TabsContent value="history">
                  <PurchaseHistory />
                  {/* <CredentialsInfo
                credentials={credentials}
                onDeleteCredential={handleCredentialDelete}
              /> */}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      )}
    </>
  );
};
