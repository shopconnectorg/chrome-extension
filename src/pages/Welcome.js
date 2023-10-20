import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/logo.png";
import FullLogo from '../ui/icons/Primary_ Logo.svg';
import Icon from '@mui/material/Icon';
import { Button } from "../components/ui/button";
import { DEFAULT_ACCOUNT_NAME } from "../constants";
import { IdentityService } from "../services/Identity.service";
import { ExtensionService } from "../services/Extension.service";
import { Checkbox } from "../components/ui/checkbox";
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';

export const Welcome = () => {
  const [oldUi, setOldUi] = useState(false);

  const navigate = useNavigate();
  const { state } = useLocation();
	const [isIdentityPresent, setIdentityPresent] = useState(false);
	const [step, setStep] = useState('step1');
	const [input, setInput] = useState({
		password: '',
		confirmPassword: ''
	});
	const [error, setError] = useState({
		password: '',
		confirmPassword: ''
	})

	useEffect(() => {
		(async () => {
			const { dataStorage } = await ExtensionService.getInstance();
			const identities = await dataStorage.identity.getAllIdentities();
			setIdentityPresent(identities.length > 0);
		})().catch(console.error);
	}, [])

	const onInputChange = (e) => {
		const { name, value } = e.target;
		setInput(prev => ({
			...prev,
			[name]: value
		}));
		validateInput(e);
	}

	const validateInput = e => {
		const { name, value } = e.target;
		setError(prev => {
			const stateObj = { ...prev, [name]: "" };
			switch (name) {
				case "password":
					if (!value) {
						stateObj[name] = "Please enter Password.";
					} else if (input.confirmPassword && value !== input.confirmPassword) {
						stateObj["confirmPassword"] = "Password and Confirm Password does not match.";
					} else {
						stateObj["confirmPassword"] = input.confirmPassword ? "" : error.confirmPassword;
					}
					break;
				case "confirmPassword":
					if (!value) {
						stateObj[name] = "Please enter Confirm Password.";
					} else if (input.password && value !== input.password) {
						stateObj[name] = "Password and Confirm Password does not match.";
					}
					break;
				default:
					break;
			}
			return stateObj;
		});
	}

	const handleClickStart = () => {
		setStep('step2');
	}
	const handleClickCreate = () => {
		setStep('step3');
	}
	async function handleClickCreatePassword() {
		if (!isIdentityPresent) {
			const identity = await IdentityService.createIdentity();
			localStorage.setItem(
				'accounts',
				JSON.stringify([
					{
						name: DEFAULT_ACCOUNT_NAME,
						did: identity.did.string(),
						isActive: true,
					}
				])
			);
			window.dispatchEvent(new Event("storage"));
			if (state) {
				navigate(state);
			} else {
				navigate('/');
			}
		}
	}
  return (
    <>
      <div className="absolute top-1 right-1 z-50	">
        <Checkbox checked={oldUi} onCheckedChange={() => setOldUi(!oldUi)} />
      </div>
      {oldUi ? (
        <div>
          {step === "step1" && (
            <div className={"welcome-step1"}>
              <img src={Logo} alt={""} />
              <h3>Welcome to PolygonID</h3>
              <p>Connecting you to Ethereum and</p>
              <p>the decentralized network...</p>
              <p style={{ paddingTop: 20, paddingBottom: 30 }}>
                We're glad to see you.
              </p>
              <Button
                className={"blue-button"}
                color="primary"
                size="large"
                variant="outlined"
                onClick={handleClickStart}
              >
                Let's get started
              </Button>
            </div>
          )}
          {step === "step2" && (
            <div className={"welcome-step2"}>
              <img src={FullLogo} alt={""} />
              <h3>First time in PolygonID?</h3>
              <div className={"block-wrap"}>
                <div className={"section"}>
                  <Icon component={AssignmentReturnedIcon} color={"primary"} />
                  <h5>No, I have Secret Recovery Phrase</h5>
                  <p style={{ fontSize: 12 }}>
                    Access your wallet with your Secret Recovery Phrase
                  </p>
                  <Button
                    className={"blue-button"}
                    color="primary"
                    size="small"
                    variant="outlined"
                  >
                    Import an existing wallet
                  </Button>
                </div>
                <div className={"section"}>
                  <Icon component={AddIcon} color={"primary"} />
                  <h5>Yes, let's set up!</h5>
                  <p style={{ fontSize: 12 }}>This will create a new wallet</p>
                  <Button
                    className={"blue-button"}
                    color="primary"
                    size="small"
                    variant="outlined"
                    onClick={handleClickCreate}
                  >
                    Create a new wallet
                  </Button>
                </div>
              </div>
            </div>
          )}
          {step === "step3" && (
            <div className={"welcome-step3"}>
              <img src={FullLogo} alt={""} />
              <h1 style={{ textAlign: "left" }}>Create password</h1>
              <TextField
                className={"pas-input"}
                error={!!error.password}
                name="password"
                id="outlined-error-helper-text"
                label="New password (8 characters min)"
                type="password"
                value={input.password}
                helperText={
                  error.password && (
                    <span className="err">{error.password}</span>
                  )
                }
                onChange={onInputChange}
                onBlur={validateInput}
              />
              <TextField
                className={"pas-input"}
                error={!!error.confirmPassword}
                id="outlined-error-helper-text"
                name="confirmPassword"
                label="Confirm password"
                type="password"
                value={input.confirmPassword}
                helperText={
                  error.confirmPassword && (
                    <span className="err">{error.confirmPassword}</span>
                  )
                }
                onChange={onInputChange}
                onBlur={validateInput}
              />
              <Button
                className={"blue-button"}
                color="primary"
                size="small"
                variant="outlined"
                onClick={handleClickCreatePassword}
                disabled={!!error.confirmPassword || !!error.password}
              >
                Create
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className={"welcome-step1"}>
          <img src={Logo} alt={""} className="mb-5" />
          <h3>Welcome to</h3>
          <h1 className="text-xl font-bold">ShopConnect</h1>
          <p className="my-6">Insert product description here.</p>
          {/* <Input
        type="password"
        placeholder="Create password (min 8 characters)"
        value={input.password}
        onChange={onInputChange}
      ></Input>
      <Input
        type="password"
        placeholder="Confirm password"
        value={input.confirmPassword}
        onChange={onInputChange}
      ></Input> */}
          <Button
            onClick={handleClickCreatePassword}
            // disabled={!!error.confirmPassword || !!error.password}
          >
            Get started
          </Button>
        </div>
      )}
    </>
  );
};
