import React, { useEffect, useState } from "react";
import styles from "./OrderPaymentPage.module.css";
import { replace, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { request } from "../../../helper/AxiosHelper";
import axios from "axios";
import { useTheme } from "../../../context/theme";
import LoadingPage from "../../shopitHelp/loadingPage/LoadingPage";

const OrderPaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  // Get the order id to make payment
  const { orderId } = location.state || {};

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    setLoading(true);
    try {
      // Make an API call to your backend to generate the Payment_order ID
      const response = await request("GET", `/order/${orderId}/payment-request`);
      const paymentDetails = response.data;
      console.log(paymentDetails)
      // Initiate Razorpay payment
      const options = {
        key: paymentDetails.apiKeyId,
        amount: paymentDetails.amountInPaise,
        currency: paymentDetails.currency,
        description: paymentDetails.description,
        order_id: paymentDetails.paymentOrderId,
        handler: function (response) {
          console.log("RZ response  : ",response);
          // Handle the payment success callback
          const data = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };
          axios.post('http://localhost:8080/payment/callback', null, {
            params: data
          }).then((res) => {
            console.log('Payment Success', res);
            navigate('/orders', {replace: true});
            // Reload the page
            window.location.reload();
          }).catch((err) => {
            console.error('Payment Verification Failed:', err);
          })
        },
        prefill: paymentDetails.prefill,
        notes: paymentDetails.notes,
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Payment initiation failed", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If order id null then give error
    if(!orderId) {
      // Redirect the user to orders page
      navigate('/orders', replace);
    } else {
      initiatePayment();
    }
  }, [orderId]);

  if (error) {
    return navigate('/home');
  }
  if(loading) {
    return <LoadingPage />
  }
};

export default OrderPaymentPage;
