import stripePackage from 'stripe';

const stripeSecretKey = 'sk_test_51P4NCqP8rsVxfVQ5P8SJoVXTwYsdQoMyVsz6ZVLshm97FB2P0gNu3SOot9JTSMByNBvNfWckVUBBvdn1pvdeotOW00HU5ROC0l';
const stripe = stripePackage(stripeSecretKey);

export const paymentGateway=async(req,res)=>{
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: 'Your Product Name',
                  },
                  unit_amount: req.body.amount,
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: 'https://yourwebsite.com/success',
            cancel_url: 'https://yourwebsite.com/cancel',
          });
      
          res.json({ sessionId: session.id });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
    }
