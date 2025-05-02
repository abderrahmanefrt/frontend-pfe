import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface AccountSettingsProps {
  onSettingsUpdate?: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onSettingsUpdate }) => {
  // State for notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // State for password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate new passwords match
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match!");
      return;
    }

    // Here you would call your backend API to update the settings
    console.log({
      emailNotifications,
      smsNotifications,
      currentPassword,
      newPassword,
    });
    alert("Settings updated successfully!");

    // Call the callback if provided; otherwise navigate as a fallback.
    if (onSettingsUpdate) {
      onSettingsUpdate();
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="container mt-4">
      <h1>Account Settings</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <h2>Notification Preferences</h2>
          <div className="form-check">
            <input
              type="checkbox"
              id="emailNotifications"
              className="form-check-input"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
            />
            <label htmlFor="emailNotifications" className="form-check-label">
              Email Notifications
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              id="smsNotifications"
              className="form-check-input"
              checked={smsNotifications}
              onChange={(e) => setSmsNotifications(e.target.checked)}
            />
            <label htmlFor="smsNotifications" className="form-check-label">
              SMS Notifications
            </label>
          </div>
        </div>

        <hr />

        <div className="mb-4">
          <h2>Change Password</h2>
          <div className="mb-3">
            <label htmlFor="currentPassword" className="form-label">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              className="form-control"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default AccountSettings;
