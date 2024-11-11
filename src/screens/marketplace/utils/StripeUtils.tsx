// StripeUtils.js (or similar utility file)

import { getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { doc } from 'firebase/firestore';
import { firestore } from "../../../store/firebase-configNew";
import { useMe } from "../../../hooks/useMe";

  export async function createConnectedAccount(email) {
    const response = await fetch('https://api.stripe.com/v1/accounts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        type: 'express',
        country: 'US',
        email: email
      })
    });
  // simplePassword@1234!!
    const data = await response.json();
    const accountId = data.id;
    return accountId;
  }

  export async function createAccountLink (accountId) {
    const response = await fetch('https://api.stripe.com/v1/account_links', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `account=${accountId}&refresh_url=https://realmapp/reauth&return_url=https://realmapp.com/return&type=account_onboarding`,
    });

    const accountLink = await response.json();
    if (accountLink.error) {
      alert(`Error: ${accountLink.error.message}`);
    } else {
      // Navigate the user to the account link
      const { url } = accountLink;
      console.log("::accountLink::", url);
      return url;
    }
  };

  export const createCustomer = async (email) => {
    try {
        const response = await fetch('https://api.stripe.com/v1/customers', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`, // Use your Stripe Secret Key
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `email=${email}`
        });

        const customer = await response.json();
        if (response.ok) {
            console.log('Customer created:', customer);
            // Save customer.id to Firestore or local storage if needed
            return customer.id;
        } else {
            console.error('Error creating customer:', customer);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};


  