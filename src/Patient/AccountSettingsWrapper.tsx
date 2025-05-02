import React from "react";
import { useNavigate } from "react-router-dom";
import AccountSettings from "./AccountSettings";

const AccountSettingsWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleSettingsUpdate = () => {
    // When settings are updated, navigate back to the dashboard.
    navigate("/dashboard");
  };

  return <AccountSettings onSettingsUpdate={handleSettingsUpdate} />;
};

export default AccountSettingsWrapper;
