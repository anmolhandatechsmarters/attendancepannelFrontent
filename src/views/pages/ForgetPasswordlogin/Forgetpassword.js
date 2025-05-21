import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Forgetpassword.css';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
const Forgetpassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email');
  const [notification, setNotification] = useState('');
  const [notificationColor, setNotificationColor] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setNotification('Please wait, sending email...');
    setNotificationColor('blue');
    
    try {
      const result = await axios.post(`${import.meta.env.REACT_APP_BASE_URL}/user/forgetpassword`, { email });
      if (result.data.success) {
        setStep('otp');
        setNotification('Check your email and enter the OTP.');
        setNotificationColor('green');
      } else {
        setNotification(result.data.message);
        setNotificationColor('red');
      }
    } catch (error) {
      setNotification('An error occurred. Please try again.');
      setNotificationColor('red');
    }
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    setNotification('Verifying OTP...');
    setNotificationColor('blue');
    
    try {
      const result = await axios.post(`${import.meta.env.REACT_APP_BASE_URL}/user/verifyotp`, { email, otp });
      if (result.data.success) {
        
        navigate('/confirmpassword', { state: { email } });
      } else {
        setNotification('Your OTP is not valid.');
        setNotificationColor('red');
      }
    } catch (error) {
      setNotification('An error occurred. Please try again.');
      setNotificationColor('red');
    }
  };

  return (
  //   <div className="forgetpassword-container">
  //     <div className="forgetpassword-card">
  //       <h2 className="forgetpassword-title">{step === 'email' ? 'Forgot Password' : 'Verify OTP'}</h2>
  //       {notification && (
  //         <div className={`forgetpassword-notification ${notificationColor}`}>
  //           {notification}
  //         </div>
  //       )}
  //       {step === 'email' ? (
  //         <form onSubmit={handleEmailSubmit}>
  //           <input
  //             type="email"
  //             placeholder="Enter your email"
  //             value={email}
  //             onChange={(e) => setEmail(e.target.value)}
  //             required
  //           />
  //           <button type="submit">Send</button>
  //         </form>
  //       ) : (
  //         <form onSubmit={handleOtpSubmit}>
  //           <input
  //             type="text"
  //             placeholder="Enter your OTP"
  //             value={otp}
  //             onChange={(e) => setOtp(e.target.value)}
  //             required
  //           />
  //           <button type="submit">Verify OTP</button>
  //         </form>
  //       )}
  //     </div>
  //   </div>

<>

<div className='forget-password-page'>
  <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center forget-password-page">
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCardGroup>
            <CCard className="p-4 card-animate">
              <CCardBody>
                {/* Heading for Forgot Password */}
                <h1>{step === 'email' ? 'Forgot Password' : 'Verify OTP'}</h1>
                <p className="text-body-secondary">
                  {step === 'email' ? 'Enter your email to reset your password' : 'Enter the OTP sent to your email'}
                </p>
                
                {/* Notification for errors or success */}
                {notification && (
                  <div className={`forgetpassword-notification ${notificationColor}`}>
                    {notification}
                  </div>
                )}

                {/* Step 1: Email input */}
                {step === 'email' ? (
                  <CForm onSubmit={handleEmailSubmit}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Enter your email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        required
                      />
                    </CInputGroup>
                    <CButton color="primary" className="px-4" type="submit" disabled={loading}>
                      {loading ? 'Sending...' : 'Send'}
                    </CButton>
                  </CForm>
                ) : (
                  // Step 2: OTP input
                  <CForm onSubmit={handleOtpSubmit}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Enter your OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CButton color="primary" className="px-4" type="submit" disabled={loading}>
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </CButton>
                  </CForm>
                )}
              </CCardBody>
            </CCard>
            {windowWidth >= 786 && (
                <CCard className="text-white bg-primary py-5 signup-card">
                  <CCardBody className="text-center">
                    <h2>Smarters Attendance Pannel</h2>
                    <p>Welcome to the Smarters Attendance  Pannel. It is used to handle the Attendance for the Employees.</p>
                  </CCardBody>
                </CCard>
              )}
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</div>



</>

  );




};

export default Forgetpassword;
