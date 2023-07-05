import Layout from "~/components/Layout/Layout";
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from "@stripe/stripe-js";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import CheckoutForm from "~/components/Checkout/checkoutForm";
import Skeleton from "~/components/skeleton";
import CheckoutItems from "~/components/Checkout/checkoutItems";
import type { Listing } from "~/utils/types";
import { DM_Serif_Display } from "@next/font/google";


const serif = DM_Serif_Display({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export default function Checkout() {

  const router = useRouter()
  const listingId = router.query.id;
  const {data, isSuccess: isSession} = api.stripe.checkoutSession.useQuery({listingId}, {enabled: !!listingId})
  
  const clientSecret = data?.clientSecret
  const listing: Listing = data?.listing as Listing

  const appearance = {
    variables: {
      colorPrimary: '#FF5500',
      colorBackground: '#000000',
      colorText: '#ffffff',
    },
  };

  return (
    <Layout>
        <h1
            className={`text-black ${serif.className} mb-2 mt-2 w-5/6 px-4  text-lg sm:text-lg md:text-xl lg:text-xl xl:text-2xl`}
        >
        <span className="bg-white px-4">CHECKOUT</span>
      </h1>
      <div className="flex flex-col items-center mt-2">
        <div className="flex w-5/6 space-x-2 justify-center"> 
          {isSession && listing  ? (
            <CheckoutItems listing={listing} />
          ) : (
            <Skeleton className=" h-96"/>
          )}
          {isSession && clientSecret ? (
            <Elements options={{
              appearance,
              clientSecret
            }} stripe={stripePromise}>
              <CheckoutForm listing={listing} />
            </Elements>
          ) : (
            <Skeleton className=" h-96"/>
            )}
        </div>
      </div>
    </Layout>
  )
}

