import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming auth context might be needed later or for token
import { Alert, Button, Card, Form, Spinner } from 'react-bootstrap';

const OTPVerificationPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  // We don't rely on user from useAuth here as they are not yet logged in after signup
  // const { user } = useAuth(); 

  // State to hold user info for verification
  const [verificationInfo, setVerificationInfo] = useState<{ userId?: string; email?: string; role?: string } | null>(null);

  // Log initial verificationInfo state
  console.log('Initial verificationInfo state:', verificationInfo);

  useEffect(() => {
    // Try to get info from navigation state first
    const stateInfo = location.state as { userId?: string; email?: string; role?: string } | undefined;
    
    if (stateInfo?.email || stateInfo?.userId) {
      setVerificationInfo(stateInfo);
      console.log('Verification info set from state:', stateInfo);
    } else {
      // If not in state, try sessionStorage
      const storedInfo = sessionStorage.getItem('verificationInfo');
      if (storedInfo) {
        try {
          const parsedInfo = JSON.parse(storedInfo);
          if (parsedInfo.email || parsedInfo.userId) {
             setVerificationInfo(parsedInfo);
             console.log('Verification info set from sessionStorage:', parsedInfo);
          } else {
            // Stored data is incomplete, redirect
            console.log('Incomplete verification info in sessionStorage, redirecting.');
            navigate('/signup', { replace: true });
          }
        } catch (e) {
          // Error parsing stored data, redirect
          console.error('Error parsing verification info from sessionStorage:', e);
          navigate('/signup', { replace: true });
        }
      } else {
        // No info in state or sessionStorage, redirect
        console.log('No verification info found, redirecting.');
        navigate('/signup', { replace: true });
      }
    }
  }, [location.state, navigate]); // Dependencies: location.state and navigate

  // If verification info is not yet loaded, show loading or null
  if (!verificationInfo) {
      return <div>Loading verification information...</div>; // Or null, depending on desired behavior
  }

  // Destructure email and role from verificationInfo
  const { userId, email: userEmail, role: userRole } = verificationInfo;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Log verification info at the start of handleSubmit
    console.log('Verification info at handleSubmit:', { userEmail, userRole });

    // The email and role should be available from verificationInfo state now
    if (!userEmail || !userRole) {
       setError('User information missing for verification.');
       console.log('handleSubmit check failed: userEmail or userRole missing.');
       setLoading(false);
       return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send email, otp, and role as expected by the backend
        body: JSON.stringify({ email: userEmail, otp, role: userRole }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed.');
      }

      setSuccess(data.message || 'OTP verified successfully!');

      // Clear sessionStorage ONLY on successful verification
      sessionStorage.removeItem('verificationInfo');

      // Redirect on success - maybe to login page
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: 'var(--background)' }}>
      <Card className="p-4 shadow-sm" style={{ maxWidth: '500px', width: '100%', borderRadius: '12px' }}>
        <Card.Body>
          <h2 className="text-center mb-4" style={{ color: 'var(--primary)' }}>Verify Your Email</h2>
          <p className="text-center text-muted mb-4">
            A verification code has been sent to your email address. Please enter the code below.
          </p>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="otp">
              <Form.Label>OTP Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6} // Assuming a 6-digit OTP
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : 'Verify Code'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OTPVerificationPage; 