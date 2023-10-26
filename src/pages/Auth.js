import React, { useState, useEffect } from "react";
import { approveMethod, proofMethod, receiveMethod } from "../services";
import { useLocation, useNavigate } from "react-router-dom";
import { ExtensionService } from "../services/Extension.service";
import { LinearProgress } from "@mui/material";
import { base64ToBytes } from "@0xpolygonid/js-sdk";
import Logo from "../assets/logo.png";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { OldAuth } from "./old/Auth";

const RequestType = {
  Auth: "auth",
  CredentialOffer: "credentialOffer",
  Proof: "proof",
};

const useQuery = (key) => {
  const { search } = useLocation();
  return React.useMemo(
    () => new URLSearchParams(search).get(key),
    [search, key]
  );
};

export const Auth = () => {
  const [oldUi, setOldUi] = useState(false);

  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const dataType = useQuery("type");
  const payload = useQuery("payload");
  const [error, setError] = useState(null);
  const [requestType, setRequestType] = useState("");
  const [data, setData] = useState(null);
  const [msgBytes, setMsgBytes] = useState(null); // [msgBytes, setMsgBytes
  const [isReady, setIsReady] = useState(true);


  console.log("dataType", dataType);
  console.log("payload", payload);

  const detectRequest = (unpackedMessage) => {
    const { type, body } = unpackedMessage;
    const { scope = [] } = body;

    if (type.includes("request") && scope.length) {
      return RequestType.Proof;
    } else if (type.includes("offer")) {
      return RequestType.CredentialOffer;
    } else if (type.includes("request")) {
      return RequestType.Auth;
    }
  };

  useEffect(() => {
    (async () => {
      const { packageMgr, dataStorage } = await ExtensionService.getInstance();
      const identity = dataStorage.identity.getAllIdentities();
      if (identity.length <= 0) {
        navigate("/welcome", { state: pathname + search });
      } else {
        let msgBytes;
        if (dataType === "base64") {
          msgBytes = base64ToBytes(payload);
        } else {
          msgBytes = await fetch(decodeURIComponent(payload))
            .then((res) => res.arrayBuffer())
            .then((res) => new Uint8Array(res));
        }
        const { unpackedMessage } = await packageMgr.unpack(msgBytes);
        setMsgBytes(msgBytes);
        console.log("unpackedMessage", unpackedMessage);
        setData(unpackedMessage);
        setRequestType(detectRequest(unpackedMessage));
      }
    })().catch(console.error);
  }, []);

  async function handleClickReject() {
    navigate("/");
  }
  async function handleClickApprove() {
    setIsReady(false);
    const result = await approveMethod(msgBytes);
    if (result.code !== "ERR_NETWORK") navigate("/");
    else {
      setError(result.message);
      setIsReady(true);
    }
  }
  async function handleClickProof() {
    setIsReady(false);
    try {
      await proofMethod(msgBytes);
      navigate("/");
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    } finally {
      setIsReady(true);
    }
  }

  async function handleClickReceive() {
    setIsReady(false);
    let result = await receiveMethod(msgBytes).catch((error) =>
      setError(error)
    );
    if (result === "SAVED") navigate("/");
    else {
      setError(result.message);
      setIsReady(true);
    }
  }

  const getCredentialRequestData = () => {
    const { body } = data;
    const { scope = [] } = body;
    return scope.map(({ circuitId, query }) => {
      let data = [];
      data.push({
        name: "Credential type",
        value: query.type,
      });
      query.credentialSubject &&
        data.push({
          name: "Requirements",
          value: Object.keys(query.credentialSubject).reduce((acc, field) => {
            const filter = query.credentialSubject[field];
            const filterStr = Object.keys(filter).map((operator) => {
              return `${field} - ${operator} ${filter[operator]}\n`;
            });
            return acc.concat(filterStr);
          }, ""),
        });
      data.push({
        name: "Allowed issuers",
        value: query.allowedIssuers.join(", "),
      });
      data.push({
        name: "Proof type",
        value: circuitId,
      });
      return data;
    });
  };
  const progressHeight = 20;
  return (
    <>
      <div className="absolute top-1 right-1 z-50">
        <Checkbox checked={oldUi} onCheckedChange={() => setOldUi(!oldUi)} />
      </div>
      {oldUi ? (
        <OldAuth />
      ) : (
        <div className={"auth-wrapper h-5/6"}>
          <div
            className="progress-indicator"
            style={{ height: progressHeight }}
          >
            {!isReady && <LinearProgress size={progressHeight} />}
          </div>
          {requestType && requestType === RequestType.Proof && (
            <div className="flex flex-col items-center justify-between h-full pt-16 px-3 pb-3 text-center">
              <div className="flex flex-col items-center">
                <span className="max-w-xs text-xl">
                  This site wants to verify the following information from your
                  account:
                </span>
              </div>

              <div className="flex flex-col items-center justify-center h-full py-4">
                <div className="w-full px-5 py-2 border-2	border-black rounded-full">
                  {data.body.reason}
                </div>
              </div>
              <div className="w-full">
                <div className="flex items-center space-x-2">
                  {/* Not functional currently */}
                  <Checkbox id="auto-approve" />
                  <label
                    htmlFor="auto-approve"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enable auto-approve from now on
                  </label>
                </div>
                <div className="flex flex-row justify-between	space-x-3 mt-3">
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={handleClickReject}
                  >
                    Reject
                  </Button>
                  <Button
                    className="w-full"
                    disabled={!isReady}
                    onClick={handleClickProof}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          )}
          {requestType && requestType === RequestType.Auth && (
            <div className="flex flex-col items-center justify-between h-full pt-16 px-3 pb-3 text-center">
              <div className="flex flex-col items-center justify-center h-full mb-10">
                <div className="w-16 h-16 mb-8">
                  <img src={Logo} alt="ShopConnect" />
                </div>
                <span className="max-w-xs text-xl">
                  This site wants you to authorize your
                </span>
                <span className="text-2xl font-bold">ShopConnect account</span>
              </div>
              <div className="w-full">
                <div className="flex flex-row justify-between	space-x-3 mt-3">
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={handleClickReject}
                  >
                    Reject
                  </Button>
                  <Button
                    className="w-full"
                    disabled={!isReady}
                    onClick={handleClickApprove}
                  >
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          )}
          {requestType && requestType === RequestType.CredentialOffer && (
            <div className="flex flex-col items-center justify-between h-full pt-16 px-3 pb-3 text-center">
              <div className="flex flex-col items-center">
                <span className="max-w-xs text-xl">
                  This site wants to issue a receipt for your purchase
                </span>
              </div>
              <div className="w-full">
                <div className="flex items-center space-x-2">
                  {/* Not functional currently */}
                  <Checkbox id="auto-approve" />
                  <label
                    htmlFor="auto-approve"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enable auto-approve from now on
                  </label>
                </div>
                <div className="flex flex-row justify-between	space-x-3 mt-3">
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={handleClickReject}
                  >
                    Reject
                  </Button>
                  <Button
                    className="w-full"
                    disabled={!isReady}
                    onClick={handleClickReceive}
                  >
                    Claim
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
