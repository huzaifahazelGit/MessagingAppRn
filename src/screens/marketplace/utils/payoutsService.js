
export const fetchPayoutsHistory = async (stripeAccountId) => {
    const response = await fetch('https://api.stripe.com/v1/payouts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`, // Secret key for your platform account
        'Stripe-Account': stripeAccountId, // Seller's connected account ID
      },
    });
  
    const data = await response.json();
  
    if (response.ok) {
      return data.data;  // Payouts array
    } else {
      console.error('Error fetching payouts:', data.error.message);
      return [];
    }
  };
  
export const fetchPendingPayouts = async (stripeAccountId, secretKey) => {
    const response = await fetch('https://api.stripe.com/v1/payouts?status=pending', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer sk_test_51PgBMu2KNc0yhsApuSzpb8lCHTwMJkfOp8zoJiEf4thE8touaD7UCw4zyadDsWHVzqR0hW7tMtwgapKRMr4NxzHi006IhilsRK`,
        'Stripe-Account': stripeAccountId,
      },
    });
  
    const data = await response.json();
  
    if (response.ok) {
      return data.data;  // Return only pending payouts
    } else {
      console.error('Error fetching pending payouts:', data.error.message);
      return [];
    }
  };
  