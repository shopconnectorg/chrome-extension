import React, { useEffect, useState } from "react";
import { AccountInfo } from "../components/account-info";
// import { CredentialsInfo } from "../components/credentials";
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

export const Home = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [credentials, setCredentials] = useState([]);

  // Tab state
  const [tabIndex, setTabIndex] = useState("1");

  const getCredentials = async () => {
    const { credWallet } = await ExtensionService.getInstance();
    // todo find by query
    const credentials = await credWallet.list();
    setCredentials(credentials);
  };

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
        "https://athome.starbucks.com/sites/default/files/styles/carousel_415x347/public/2022-05/CAH_PDP_Vanilla_1842x1542_Ground_shadow.png.webp?itok=jyAVO26X",
      title: "Vanta Roast (18oz)",
      discount: "10%",
      expiry: "3 days",
      description: "Bought coffee in the past week",
      action: "Unlock",
    },
    {
      image: "https://dam.delonghi.com/600x600/assets/223655",
      title: "Delonghi Magnifica S",
      discount: "$5",
      expiry: "1 week",
      description: "Recurring customer discount",
      action: "Unlock",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {accounts.length <= 0 && <p>Redirecting...</p>}
      {accounts.length > 0 && (
        <div>
          <AccountInfo accounts={accounts} />
          <Tabs defaultValue="deals" className="w-[400px]">
            <TabsList className="ml-3">
              <TabsTrigger value="available-deals">Available Deals</TabsTrigger>
              <TabsTrigger value="other-deals">Other Deals</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            <TabsContent value="available-deals">
              <DealList data={dealsMockData}/>
            </TabsContent>
            <TabsContent value="other-deals">
              <DealList data={dealsMockData2}/>
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
  );
};
