import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Alert, Container } from "react-bootstrap";

interface AccountSettingsProps {
  onSettingsUpdate?: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onSettingsUpdate }) => {
  // Notification states (UI only)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Password states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Account deletion states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // UI states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handlePasswordUpdate = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Basic confirmation check
      if (newPassword !== confirmPassword) {
        throw new Error("New password and confirmation don't match");
      }

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Authentication required");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: currentPassword,
          newPassword: newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update password");
      }

      setSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    setIsDeleting(true);
    setDeleteError("");

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("Authentication required");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/deletemyaccount`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete account");
      }

      // Clear local storage and redirect
      localStorage.removeItem("accessToken");
      navigate("/", { state: { accountDeleted: true } });

    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Deletion failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Account Settings</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handlePasswordUpdate}>
        {/* Notification Preferences Section */}
        <div className="mb-4 p-3 border rounded">
          <h2>Notification Preferences</h2>
          <Form.Check 
            type="switch"
            id="email-notifications"
            label="Email Notifications"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            disabled
          />
          <Form.Check
            type="switch"
            id="sms-notifications"
            label="SMS Notifications"
            checked={smsNotifications}
            onChange={(e) => setSmsNotifications(e.target.checked)}
            disabled
          />
          <small className="text-muted">Notification preferences are currently read-only</small>
        </div>

        {/* Password Change Section */}
        <div className="mb-4 p-3 border rounded">
          <h2>Change Password</h2>
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <Button 
            variant="primary" 
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </Form>

      {/* Danger Zone */}
      <div className="p-4 border border-danger rounded">
        <h2 className="text-danger">Danger Zone</h2>
        <p>Permanently delete your account and all associated data.</p>
        <Button
          variant="outline-danger"
          onClick={() => setShowDeleteModal(true)}
        >
          Delete Account
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger">
            <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
          </p>
          <p>To confirm, please type <strong>DELETE</strong> below:</p>
          
          <Form.Control
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Type DELETE"
          />

          {deleteError && <Alert variant="danger" className="mt-3">{deleteError}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleAccountDeletion}
            disabled={deleteConfirmation !== "DELETE" || isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Deleting...
              </>
            ) : "Delete Permanently"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AccountSettings;