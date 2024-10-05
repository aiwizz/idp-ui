import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Box, Button, Typography, Paper } from '@mui/material';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';

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
                'http://localhost:8000/save-payment-method',
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
            minHeight="80vh"
            bgcolor="#f5f5f5"
            p={2}
        >
            <Box>
                <Box marginBottom={8}>
                    <WarningOutlinedIcon color="error" fontSize="large" />
                    <Typography variant="h6" gutterBottom color={"red"}>
                        You have ran out of FREE uploads.
                        <br/>Please update your payment method to continue uploading and processing files.
                    </Typography>
                </Box>
                <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%', maxHeight: 500, height: '100%' }}>
                    <Box mb={3} >
                        <Typography variant="h5" gutterBottom>
                            {`Update Payment Method`}
                        </Typography>
                        <Typography variant="body1" gutterBottom color="textSecondary">
                            Please enter your payment details below to save them for future use.
                        </Typography>
                    </Box>
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
        </Box>
    );
}

export default PaymentSetup;