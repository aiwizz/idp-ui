import React, { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentPage() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePayment = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    // Get the payment method from Stripe
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    try {
      // Get the files from state passed via navigation
      const filesToProcess = location.state?.filesToProcess;

      // Make the request to the server to process the payment
      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:5000/process', {
        payment_method_id: paymentMethod.id, // Send the payment method to backend
        confirm: true,
        return_url: 'http://localhost:3000/home'
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.message === 'Request processed successfully, charged $2') {
        setMessage('Payment successful! Redirecting...');
        console.log(paymentMethod.id);
        console.log(response);
        // Redirect back to the file upload page with the files to continue the process
        setTimeout(() => navigate('/home', { state: { filesToProcess } }), 2000);
      } else {
        setError('Payment was successful, but there was an issue processing your request.');
      }
    } catch (error) {
      setError('An error occurred during payment processing.');
      console.error('Error during payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Typography variant="h4" gutterBottom>
        Complete Payment
      </Typography>

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Stripe's CardElement to collect payment details */}
      <Box sx={{ width: '300px', marginBottom: 2 }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handlePayment}
        disabled={!stripe || loading}
        sx={{ width: '200px', mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Confirm Payment'}
      </Button>
    </Box>
  );
}

export default PaymentPage;