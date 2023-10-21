import React from "react";
import LogoImage from "../../assets/logo.png";
import { Badge } from "../ui/badge";
import Tooltip from '@mui/material/Tooltip';
import { hideString } from "../../utils";
import { useShopConnect } from "../../utils/hooks";

import "./styles.css";

export const AccountInfo = (props) => {
  const connectedSite = "nike.com";

  const sc = useShopConnect();
  const onLogoClick = () => {
    sc.sendMessage();
  }

  return (
    <div className={"menu-bar"}>
      <div className={"account-info"}>
        <Badge variant="secondary" className="flex">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
          {connectedSite}
        </Badge>
      </div>
      <div className="absolute inset-0 flex items-center justify-center" onClick={onLogoClick}>
        <img className="h-6 mr-2" src={LogoImage} alt={"ShopConnect"} />
        <h3 className="text-lg font-bold">ShopConnect</h3>
      </div>
    </div>
  );
};

export const OldAccountInfo = (props) => {
  const currentAccount = props.accounts[0];
  return (
    <div className={"menu-bar"}>
      {/* <div className={'account-info'}>
				<button className="connected-status-indicator" onClick={()=>{}}>
					<div className={'color-indicator'}>
						<span className="color-indicator__inner-circle" />
					</div>
					<div className="connected-status-indicator__text">Connected</div>
				</button>
			</div> */}
      <div className={"selected-account"}>
        <div style={{ display: "inline" }}>
          <Tooltip disableFocusListener title="Copy to clipboard">
            <button
              className="selected-account__clickable"
              onClick={() => {
                navigator.clipboard.writeText(currentAccount.did);
              }}
            >
              <div className={"selected-account__name"}>
                {currentAccount.name}
              </div>
              <div className="selected-account__address">
                {hideString(currentAccount.did, 6, -6)}
                <div className={"selected-account__copy"}>
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 0H1H9V1H1V9H0V0ZM2 2H11V11H2V2ZM3 3H10V10H3V3Z"
                      fill="#535a61"
                    ></path>
                  </svg>
                </div>
              </div>
            </button>
          </Tooltip>
        </div>
      </div>
      {/* <div className={'menu-bar__account-options'}>
				<Icon component={MoreVertIcon} color={'red'} />
			</div> */}
    </div>
  );
};
