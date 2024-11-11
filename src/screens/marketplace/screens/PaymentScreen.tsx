import React, { useEffect, useState } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { useMe } from '../../../hooks/useMe';

const PaymentScreen = () => {
  const { createPaymentMethod } = useStripe();
  const me:any = useMe()
  const [cardDetails, setCardDetails] = useState(null);
  const [customerId, setCustomerId] = useState(me?.buyerCustomer?.customerId);
  const [paymentMethodId, setPaymentMethodId] = useState("pm_card_visa"); // pm_card_visa
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(()=>{
    // checkAccountBalance()
    // listBankAccounts("listBankAccounts")
    // fetchPayoutsHistory()
    // fetchPendingPayouts()
  },[])
   
  let seller_customerConnectedId = me?.sellerCustomer?.sellercustomerId
  // Step 1: Create a Customer
  const createCustomer = async () => {
    try {
      const response = await fetch('https://api.stripe.com/v1/customers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer YOUR_SECRET_KEY`, // Replace with your Stripe secret key
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const customer = await response.json();
      if (response.ok) {
        setCustomerId(customer.id);
        console.log('Customer created:', customer.id);
        setErrorMessage(null);
      } else {
        console.error('Error creating customer:', customer);
        setErrorMessage('Error creating customer');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while creating customer.');
    }
  };

  // Step 2: Create Payment Method Using CardField Details
  const handleCreatePaymentMethod = async () => {
    try {
      if (!cardDetails?.complete) {
        setErrorMessage('Please fill out your card details.');
        return;
      }

      const { paymentMethod, error } = await createPaymentMethod({
        paymentMethodType: 'Card',
        card: cardDetails,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }


      if (paymentMethod) {
        setPaymentMethodId(paymentMethod.id);
        console.log('Payment Method ID:', paymentMethod.id);
        setErrorMessage(null);
      }
    } catch (error) {
      console.error('Error creating payment method:', error);
      setErrorMessage('An error occurred while creating payment method.');
    }
  };

  // Step 3: Attach the Payment Method to the Customer
  const attachPaymentMethod = async () => {
    try {
      if (!customerId || !paymentMethodId) {
        setErrorMessage('Customer ID or Payment Method ID is missing.');
        return;
      }

      const response = await fetch(`https://api.stripe.com/v1/payment_methods/${paymentMethodId}/attach`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`, // Replace with your Stripe secret key
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `customer=${customerId}`,
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Payment method attached to customer:', result);
        setErrorMessage(null);
      } else {
        console.error('Error attaching payment method:', result);
        setErrorMessage('Error attaching payment method');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while attaching payment method.');
    }
  };

  // Step 4: Charge the Customer's Card
  const chargeCustomer = async () => {
    try {
      if (!customerId || !paymentMethodId) {
        setErrorMessage('Customer ID or Payment Method ID is missing.');
        return;
      }

      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`, // Replace with your Stripe secret key
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        // body: `amount=90000&currency=usd&customer=${customerId}&payment_method=${paymentMethodId}&confirm=true&automatic_payment_methods[enabled]=true&automatic_payment_methods[allow_redirects]=never`
        body: `amount=90000&currency=usd&customer=${customerId}&payment_method=${paymentMethodId}&confirm=true&automatic_payment_methods[enabled]=true&return_url=https://realmapp.com/return`

      });

      const paymentIntent = await response.json();
      if (response.ok) {
        console.log('Payment successful:', paymentIntent);
        setErrorMessage(null);
      } else {
        console.error('Error charging the card:', paymentIntent);
        setErrorMessage('Failed to charge the card.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while charging the card.');
    }
  };

  // Step 5:  Transfer Funds to the Connected Account
  const transferToConnectedAccount = async (amount, connectedAccountId) => {
    try {
      const response = await fetch('https://api.stripe.com/v1/transfers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`, // Not secure for production
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `amount=${amount*100}&currency=usd&destination=${connectedAccountId}`
      });
  
      const transfer = await response.json();
      if (response.ok) {
        console.log('Transfer to connected account successful:', transfer);
      } else {
        console.error('Error transferring to connected account:', transfer);
        setErrorMessage(transfer?.error?.message)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

    // Step 6: Creating a payout to the seller's bank account.
    const createPayout = async (amount, connectedAccountId) => {
      try {
        const response = await fetch(`https://api.stripe.com/v1/payouts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`, // Not secure for production
            'Content-Type': 'application/x-www-form-urlencoded',
            'Stripe-Account': connectedAccountId, // Payout from the connected account
          },
          body: `amount=${amount}&currency=usd`,
        });
    
        const payout = await response.json();
        if (response.ok) {
          console.log('Payout created:', payout);
        } else {
          console.error('Error creating payout:', payout);
          setErrorMessage(payout?.error?.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const checkAccountBalance = async () => {
      try {
        const response = await fetch('https://api.stripe.com/v1/balance', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`, // Replace with your Stripe secret key
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
    
        const balance = await response.json();
        if (response.ok) {
          console.log('Account Balance:', balance);
          // Handle balance information here
        } else {
          console.error('Error fetching balance:', balance);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const listBankAccounts = async (connectedAccountId) => {
      try {
        const response = await fetch(`https://api.stripe.com/v1/accounts/${connectedAccountId}/external_accounts`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`, // Replace with your Stripe secret key
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
    
        const externalAccounts = await response.json();
        if (response.ok) {
          console.log('Bank Accounts:', externalAccounts);
          // Process the external accounts list here
        } else {
          console.error('Error retrieving external accounts:', externalAccounts);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Fetch Payouts History
  const fetchPayoutsHistory = async () => {
    try {
      const response = await fetch('https://api.stripe.com/v1/payouts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`, // Replace with your Stripe secret key
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Payouts:', result);
        // setPayouts(result.data);
        setErrorMessage(null);
      } else {
        console.error('Error fetching payouts:', result);
        setErrorMessage('Error fetching payouts history.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while fetching payouts history.');
    }
  };

  const fetchPendingPayouts = async () => {
    try {
      const response = await fetch('https://api.stripe.com/v1/payouts?status=pending', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`, // Replace with your Stripe secret key
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Pending Payouts:', result);
        setErrorMessage(null);
      } else {
        console.error('Error fetching pending payouts:', result);
        setErrorMessage('Error fetching pending payouts.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while fetching pending payouts.');
    }
  };


  return (
    <View style={styles.container}>
      {/* Step 1: Collect Card Details */}
      <CardField
        postalCodeEnabled={true}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={(cardDetails) => {
          setCardDetails(cardDetails);
        }}
      />
      <Button title="Create Payment Method" onPress={handleCreatePaymentMethod} />
      <Button title="Attach Payment Method" onPress={attachPaymentMethod} />
      <Button title="Charge Card" onPress={chargeCustomer} />
      {/* me?.sellerCustomer?.sellercustomerId.  acct_1Pze1f2LluKgbaWB */}
      <Button title="Transfer Funds To Seller Connected Account" onPress={()=>transferToConnectedAccount(3,me?.sellerCustomer?.sellercustomerId)} />
      <Button title=" Release Payment to Seller" onPress={()=>createPayout(3,me?.sellerCustomer?.sellercustomerId)} />
      {/* Display Status or Errors */}
      {paymentMethodId && <Text>Payment Method ID: {paymentMethodId}</Text>}
      {customerId && <Text>Customer ID: {customerId}</Text>}
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  cardContainer: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
  card: {
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
  },
  errorText: {
    color: 'red',
    marginTop: 20,
  },
});

export default PaymentScreen;
