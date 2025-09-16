import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    console.log('🔍 Update credits API called');
    const { sessionId } = await req.json();
    console.log('🔍 Session ID:', sessionId);
    
    // Verify the payment with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('🔍 Stripe session retrieved:', {
      id: session.id,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email,
      metadata: session.metadata
    });
    
    if (session.payment_status === 'paid') {
      const { credits } = session.metadata;
      
      // Get user email from session
      const userEmail = session.customer_details.email;
      console.log('🔍 User email:', userEmail, 'Credits to add:', credits);
      
      // Update user credits in Supabase
      const { data: user, error: fetchError } = await supabase
        .from('Users')
        .select('credits')
        .eq('email', userEmail)
        .single();
      
      if (fetchError) {
        console.error('❌ Error fetching user:', fetchError);
        throw fetchError;
      }
      
      console.log('🔍 Current user credits:', user.credits);
      const newCredits = (user.credits || 0) + parseInt(credits);
      console.log('🔍 New credits will be:', newCredits);
      
      const { error: updateError } = await supabase
        .from('Users')
        .update({ credits: newCredits })
        .eq('email', userEmail);
      
      if (updateError) {
        console.error('❌ Error updating user credits:', updateError);
        throw updateError;
      }
      
      console.log('✅ Credits updated successfully');
      return Response.json({ success: true, newCredits });
    }
    
    return Response.json({ error: 'Payment not completed' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}