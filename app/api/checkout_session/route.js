import Stripe from 'stripe';
//Payment Gateway Integration

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    console.log('🔍 Stripe API called');
   
    
    const { plan } = await req.json();
 
    
    const plans = {
      basic: { price: 60, credits: 4, name: 'Basic' }, // ₹60 = ~$0.72 (above $0.50 minimum)
      standard: { price: 120, credits: 10, name: 'Standard' },
      pro: { price: 200, credits: 20, name: 'Pro' }
    };
    
    const selectedPlan = plans[plan];
    console.log('🔍 Selected plan:', selectedPlan);
    
    const session = await stripe.checkout.sessions.create({
      // Enable multiple payment methods (using valid Stripe types)
      payment_method_types: ['card'],
      
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${selectedPlan.name} Plan`,
              description: `${selectedPlan.credits} Interview Credits`,
            },
            unit_amount: selectedPlan.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_HOST_URL}/billings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_HOST_URL}/billings?canceled=true`,
      metadata: {
        plan: plan,
        credits: selectedPlan.credits,
      },
      // Enable card payments with 3D secure
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
    });

    console.log('✅ Stripe session created:', session.id);
    return Response.json({ sessionId: session.id });
  } catch (error) {
 
    console.error('❌ Error message:', error.message);
   
    return Response.json({ 
      error: error.message,
      details: error.toString() 
    }, { status: 500 });
  }
}