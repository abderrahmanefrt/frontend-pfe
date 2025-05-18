import React from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUpSelector: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectRole = (role: string) => {
    navigate(`/signup/${role}`);
  };

  return (
    <div className="container py-4" style={{ backgroundColor: '#f5f7f9', minHeight: '100vh' }}>
      <div className="row justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 32px)' }}>
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
            <div className="card-header border-0" style={{ 
              backgroundColor: '#4682B4',
              color: 'white',
              borderRadius: '12px 12px 0 0',
              padding: '1.5rem'
            }}>
              <h1 style={{ 
                margin: 0, 
                fontSize: '1.75rem',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                Join Us
              </h1>
            </div>
            
            <div className="card-body" style={{ padding: '2rem' }}>
              <p style={{ 
                color: '#6c757d',
                textAlign: 'center',
                marginBottom: '2rem',
                fontSize: '1rem'
              }}>
                Select your role to create an account
              </p>
              
              <div className="d-grid gap-3 mb-4">
                {/* Patient Button - Made larger */}
                <button
                  className="btn border-0 d-flex align-items-center justify-content-center"
                  onClick={() => handleSelectRole("patient")}
                  style={{ 
                    backgroundColor: '#4682B4',
                    color: 'white',
                    padding: '1.25rem',
                    borderRadius: '8px',
                    fontWeight: '500',
                    fontSize: '1.1rem',
                    transition: 'all 0.2s',
                    height: '60px'
                  }}
                >
                  <i className="bi bi-person-plus me-3" style={{ fontSize: '1.25rem' }}></i>
                  <span>I am a Patient</span>
                </button>
                
                {/* Doctor Button - Made larger */}
                <button
                  className="btn border-0 d-flex align-items-center justify-content-center"
                  onClick={() => handleSelectRole("doctor")}
                  style={{ 
                    backgroundColor: 'rgba(70, 130, 180, 0.1)',
                    color: '#4682B4',
                    padding: '1.25rem',
                    borderRadius: '8px',
                    fontWeight: '500',
                    fontSize: '1.1rem',
                    transition: 'all 0.2s',
                    border: '1px solid rgba(70, 130, 180, 0.3)',
                    height: '60px'
                  }}
                >
                  <i className="bi bi-heart-pulse me-3" style={{ fontSize: '1.25rem' }}></i>
                  <span>I am a Doctor</span>
                </button>
              </div>
              
              <div className="mt-4 pt-3 border-top" style={{ borderColor: '#e9ecef' }}>
                <p style={{ 
                  color: '#6c757d',
                  textAlign: 'center',
                  marginBottom: 0
                }}>
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    style={{ 
                      color: '#4682B4',
                      fontWeight: '500',
                      textDecoration: 'none'
                    }}
                  >
                    Log in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpSelector;