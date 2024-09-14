import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Box, Button, Typography, Paper } from '@mui/material';

function PaymentSetup() {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        // Create a payment method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            setError(error.message);
            return;
        }

        try {
            // Save payment method ID to backend
            const token = localStorage.getItem('token');
            await axios.post(
                'http://127.0.0.1:5000/save-payment-method',
                { payment_method_id: paymentMethod.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            navigate('/home'); // Redirect to home or previous page
        } catch (error) {
            console.error('Error saving payment method:', error);
            setError('Failed to save payment method.');
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f5f5f5"
            p={2}
        >
            <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h5" gutterBottom>
                    Payment Setup
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Please enter your payment details below to save them for future use.
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box mb={3}>
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
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        disabled={!stripe}
                    >
                        Save Payment Method
                    </Button>
                    {error && (
                        <Typography color="error" variant="body2" mt={2}>
                            {error}
                        </Typography>
                    )}
                </form>
            </Paper>
        </Box>
    );
}

export default PaymentSetup;