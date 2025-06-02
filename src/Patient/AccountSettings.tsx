import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Alert, Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

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
  const { user, getAccessToken } = useAuth();

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

      const accessToken = getAccessToken();
      if (!accessToken) throw new Error("Authentication required");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
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
      const accessToken = getAccessToken();
      if (!accessToken) throw new Error("Authentication required");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/deletemyaccount`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete account");
      }

      // Clear local storage and redirect
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/", { state: { accountDeleted: true } });

    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Deletion failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ color: 'var(--text)' }}>Account Settings</h1>
        <Button 
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: 'var(--secondary)',
            color: 'var(--text)',
            border: '1px solid var(--primary)',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '500'
          }}
        >
          <i className="fas fa-arrow-left me-2"></i> Back
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="border-0 shadow-sm" style={{ 
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          borderLeft: '4px solid var(--accent)',
          color: 'var(--text)',
          borderRadius: '8px'
        }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="border-0 shadow-sm" style={{ 
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          borderLeft: '4px solid #28a745',
          color: 'var(--text)',
          borderRadius: '8px'
        }}>
          {success}
        </Alert>
      )}

      <Form onSubmit={handlePasswordUpdate}>
        {/* Notification Preferences Section */}
        <div className="mb-4 p-4 border rounded" style={{ 
          backgroundColor: 'var(--background)',
          borderColor: 'var(--secondary)'
        }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '1.5rem' }}>Notification Preferences</h2>
          <Form.Check 
            type="switch"
            id="email-notifications"
            label="Email Notifications"
            checked={emailNotifications}
            onChange={(e) => setEmailNotifications(e.target.checked)}
            disabled
            style={{ color: 'var(--text)', marginBottom: '1rem' }}
          />
          <Form.Check
            type="switch"
            id="sms-notifications"
            label="SMS Notifications"
            checked={smsNotifications}
            onChange={(e) => setSmsNotifications(e.target.checked)}
            disabled
            style={{ color: 'var(--text)' }}
          />
          <small className="text-muted">Notification preferences are currently read-only</small>
        </div>

        {/* Password Change Section */}
        <div className="mb-4 p-4 border rounded" style={{ 
          backgroundColor: 'var(--background)',
          borderColor: 'var(--secondary)'
        }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '1.5rem' }}>Change Password</h2>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: 'var(--text)' }}>Current Password</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              style={{ 
                backgroundColor: 'white',
                borderColor: 'var(--secondary)',
                color: 'var(--text)'
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: 'var(--text)' }}>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ 
                backgroundColor: 'white',
                borderColor: 'var(--secondary)',
                color: 'var(--text)'
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: 'var(--text)' }}>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ 
                backgroundColor: 'white',
                borderColor: 'var(--secondary)',
                color: 'var(--text)'
              }}
            />
          </Form.Group>
          <Button 
            type="submit"
            disabled={loading}
            style={{ 
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: '500'
            }}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </Form>

      {/* Danger Zone */}
      <div className="p-4 border rounded" style={{ 
        borderColor: 'var(--accent)',
        backgroundColor: 'rgba(220, 53, 69, 0.05)'
      }}>
        <h2 style={{ color: 'var(--accent)', marginBottom: '1.5rem' }}>Danger Zone</h2>
        <p style={{ color: 'var(--text)' }}>Permanently delete your account and all associated data.</p>
        <Button
          onClick={() => setShowDeleteModal(true)}
          style={{ 
            backgroundColor: 'rgba(220, 53, 69, 0.1)',
            color: 'var(--accent)',
            borderColor: 'var(--accent)',
            padding: '0.5rem 1.5rem',
            borderRadius: '0.375rem',
            fontWeight: '500'
          }}
        >
          Delete Account
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton style={{ 
          backgroundColor: 'var(--background)',
          borderBottomColor: 'var(--secondary)'
        }}>
          <Modal.Title style={{ color: 'var(--text)' }}>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: 'var(--background)' }}>
          <p className="text-danger">
            <strong>Warning:</strong> This action cannot be undone. All your data will be permanently deleted.
          </p>
          <p style={{ color: 'var(--text)' }}>To confirm, please type <strong>DELETE</strong> below:</p>
          
          <Form.Control
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            placeholder="Type DELETE"
            style={{ 
              backgroundColor: 'white',
              borderColor: 'var(--secondary)',
              color: 'var(--text)'
            }}
          />

          {deleteError && (
            <Alert variant="danger" className="mt-3 border-0 shadow-sm" style={{ 
              backgroundColor: 'rgba(220, 53, 69, 0.1)',
              borderLeft: '4px solid var(--accent)',
              color: 'var(--text)',
              borderRadius: '8px'
            }}>
              {deleteError}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer style={{ 
          backgroundColor: 'var(--background)',
          borderTopColor: 'var(--secondary)'
        }}>
          <Button 
            onClick={() => setShowDeleteModal(false)}
            style={{ 
              backgroundColor: 'var(--secondary)',
              color: 'var(--text)',
              border: '1px solid var(--primary)',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: '500'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAccountDeletion}
            disabled={deleteConfirmation !== "DELETE" || isDeleting}
            style={{ 
              backgroundColor: 'var(--accent)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.375rem',
              fontWeight: '500'
            }}
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