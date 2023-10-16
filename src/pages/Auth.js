import React, { useState, useEffect } from "react";
import { approveMethod, proofMethod, receiveMethod } from "../services";
import FullLogo from "../ui/icons/Primary_ Logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { ExtensionService } from "../services/Extension.service";
import { LinearProgress } from "@mui/material";
import { base64ToBytes } from "@0xpolygonid/js-sdk";

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
  const navigate = useNavigate();
  const dataType = useQuery("type");
  const payload = useQuery("payload");
  const [error, setError] = useState(null);

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
      const { packageMgr } = await ExtensionService.getInstance();
      let msgBytes;
      if (dataType === "base64") {
        msgBytes = base64ToBytes(payload);
      } else {
        msgBytes = await fetch(decodeURIComponent(payload))
          .then((res) => res.arrayBuffer())
          .then((res) => new Uint8Array(res));
      }
      const { unpackedMessage } = await packageMgr.unpack(msgBytes);
      const requestType = detectRequest(unpackedMessage);
      console.log("unpackedMessage", unpackedMessage);
      switch (requestType) {
        case RequestType.Proof:
          await proofMethod(msgBytes);
          break;
        case RequestType.CredentialOffer: {
          const result = await receiveMethod(msgBytes);
          if (result !== "SAVED") {
            throw new Error(result.message);
          }
          break;
        }
        case RequestType.Auth: {
          const result = await approveMethod(msgBytes);
          if (result.code === "ERR_NETWORK") {
            throw new Error(result.message);
          }
          break;
        }
        default:
          throw new Error(`Unknown request type: ${requestType}`);
      };
      navigate("/");
    })().catch(setError);
  }, []);

  const progressHeight = 20;

  return (
    <div className={"auth-wrapper"}>
      <img src={FullLogo} alt={""} />
      <h2>Automatic approval</h2>
      <div className="progress-indicator" style={{ height: progressHeight }}>
        {!error && <LinearProgress size={progressHeight} />}
      </div>
      <div className={"error"}>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};
