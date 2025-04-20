// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {API_URL} from "@/util/base_url";
// import toast, {Toaster} from "react-hot-toast";
// import {useRouter} from "next/navigation";
// import QRCode from 'qrcode.react';

// interface PaymentProps {
//     productIds: any,
//     address: any,
//     amount: any,
//     selectedAddressId: any,
//     offer: any,
//     shipping_charge: any,
//     discount_payment: any
//     sub_amount:any
// }

// const Payment = ({ productIds, sub_amount,address, offer, amount, selectedAddressId, shipping_charge, discount_payment }: PaymentProps) => {
//     const router = useRouter()
//     const [data,setData] = useState<any>([])
//     const [isModalOpen, setIsModalOpen] = useState(false)
//     const [paymentMethod, setPaymentMethod] = useState<'qr' | 'online' | null>(null)
//     const [qrData, setQrData] = useState('')
//     const [isQRLoading, setIsQRLoading] = useState(false);

//     let user:any = sessionStorage.getItem('user') || {}
//     user = JSON.parse(user)

//     // Existing getProducts function
//     const getProducts = async (para: string[]) => {
//         const token:any = sessionStorage.getItem('token') || " ";
//         let user: any;
//         const userString = sessionStorage.getItem('user');
//         if (userString) {
//             user = JSON.parse(userString);
//         } else {
//             user = {};
//         }
//         if(Object.keys(user).length>0){
//             const response = await fetch(`${API_URL}/get-match-products`, {
//                 method: 'POST',
//                 headers: {
//                     'x-access-token': token,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     productIds: para,
//                     userId: user.id
//                 })
//             });
//             const data = await response.json();
//             if (response.status === 201) {
//                 setData(data.data);
//             }
//         }
//     };

//     // Existing useEffect
//     useEffect(() => {
//         getProducts(productIds)
//     }, []);

//     // Existing createOrder function
//     async function createOrder(razorpay_order_id:any,razorpay_payment_id:any,razorpay_signature:any,payment_status:any) {
//         try {
//             if(data.length>0){
//                 const token:any = sessionStorage.getItem('token') || "";
//                 const response = await fetch(`${API_URL}/orders/create`, {
//                     method: 'POST',
//                     headers: {
//                         'x-access-token': token,
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(
//                         {
//                             userId:user.id,
//                             products:data,
//                             addressId:selectedAddressId,
//                             razorpay_order_id,
//                             razorpay_payment_id,
//                             razorpay_signature,
//                             amount,
//                             shipping_charge,
//                             discount_price:parseInt(discount_payment),
//                             offerId:offer.offerId || 0,
//                             sub_amount,
//                             payment_status
//                         }
//                     )
//                 });
//                 if (response.status==200) {
//                     // Handle successful order creation
//                 }else{
//                     // Handle order creation failure
//                 }
//             }
//         } catch (error:any) {
//             console.error('Error:', error.message);
//             throw error;
//         }
//     }

//     // Existing updateOrder function
//     async function updateOrder(razorpay_order_id:any,razorpay_payment_id:any,razorpay_signature:any) {
//         try {
//             if(data.length>0){
//                 const token:any = sessionStorage.getItem('token') || "";
//                 const response = await fetch(`${API_URL}/orders/update`, {
//                     method: 'POST',
//                     headers: {
//                         'x-access-token': token,
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(
//                         {
//                             razorpay_order_id,
//                             razorpay_payment_id,
//                             razorpay_signature,
//                             payment_status:true
//                         }
//                     )
//                 });
//                 if (response.status==201) {
//                     // Handle successful update
//                 }else{
//                     // Handle update failure
//                 }
//             }
//         } catch (error:any) {
//             console.error('Error:', error.message);
//             throw error;
//         }
//     }

//     // Existing checkoutHandler function
//     const checkoutHandler = async (amount:any) => {
//         const key = "rzp_live_5FnnvEf6D23aU2";
//         const token:any =sessionStorage.getItem('token')
//         const response = await fetch(`${API_URL}/checkout`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-access-token': token
//             },
//             body: JSON.stringify({
//                 amount:parseFloat(amount)+parseFloat(shipping_charge)
//             }),
//         });

//         const { order } = await response.json();

//         await createOrder(order.id, null, null, false)

//         const options = {
//             key,
//             amount: order.amount,
//             currency: "INR",
//             name: "Target Board Store",
//             order_id: order.id,
//             handler: async function (response: any) {
//                 const response1: any = await fetch(`${API_URL}/payment-verification`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'x-access-token': token,
//                     },
//                     body: JSON.stringify({
//                         razorpay_order_id: response.razorpay_order_id,
//                         razorpay_payment_id: response.razorpay_payment_id,
//                         razorpay_signature: response.razorpay_signature
//                     })
//                 });

//                 const result = await response1.json();
//                 if (result.success) {
//                     await updateOrder(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature)
//                     toast.success("Order Processed")
//                     sessionStorage.setItem("settingtab","1")
//                     sessionStorage.setItem("mybag","0")
//                     router.push("/account/orders")
//                 } else {
//                     toast.error("Payment Failed")
//                 }
//             },
//             prefill: {
//                 name: user.name,
//                 email: user.email,
//                 contact: user.phone
//             },
//             notes: {
//                 "address": "Razorpay Corporate Office"
//             },
//             theme: {
//                 "color": "#121212"
//             }
//         };

//         // @ts-ignore
//         const razor = new window.Razorpay(options);
//         razor.open();
//     }

//     // Generate QR Code for payment
//     const generateQRCode = () => {
//         setIsQRLoading(true);
//         const totalAmount = parseFloat(amount) + parseFloat(shipping_charge);
//         const upiString = `upi://pay?pa=targetboardstore@ybl&pn=TargetBoardStore&am=${totalAmount}&cu=INR&tn=Order_${Date.now()}`;
//         setQrData(upiString);
//         setIsQRLoading(false);
//     }

//     // Handle QR Code Payment
//     const handleQRCodePayment = () => {
//         // Implement QR code payment verification logic
//         // This would typically involve calling a backend endpoint to verify the payment
//         toast.success("QR Code Payment Processed")
//         router.push("/account/orders")
//     }

//     return(
//         <>
//             {/* Payment Button to Open Modal */}
//             <button 
//                 className="btn btn-secondary disabled:bg-blue-400" 
//                 disabled={!selectedAddressId} 
//                 onClick={() => {
//                     setIsModalOpen(true)
//                     setPaymentMethod(null)
//                 }}
//             >
//                 Pay
//             </button>

//             {/* Payment Options Modal */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//                     <div className="bg-white rounded-lg p-6 w-96">
//                         <h2 className="text-xl font-bold mb-4">Choose Payment Option</h2>
                        
//                         {/* Payment Method Selection */}
//                         {!paymentMethod && (
//                             <div className="space-y-4">
//                                 {/* QR Code Option */}
//                                 <button 
//                                     className="w-full border p-4 rounded-lg flex items-center justify-between hover:bg-gray-100"
//                                     onClick={() => {
//                                         setPaymentMethod('qr')
//                                         generateQRCode()
//                                     }}
//                                 >
//                                     <div>
//                                         <h3 className="font-semibold text-left">Scanner</h3>
//                                         <p className="text-sm text-gray-600">Pay via QR Code</p>
//                                     </div>
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-qr-code"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h.01"/><path d="M12 12v.01"/></svg>
//                                 </button>

//                                 {/* Online Payment Option */}
//                                 <button 
//                                     className="w-full border p-4 rounded-lg flex items-center justify-between hover:bg-gray-100"
//                                     onClick={() => {
//                                         setIsModalOpen(false) // Close modal first
//                                         setPaymentMethod('online')
//                                         checkoutHandler(amount)
//                                     }}
//                                 >
//                                     <div>
//                                         <h3 className="font-semibold text-left">Online</h3>
//                                         <p className="text-sm text-gray-600">Pay via Online Payment</p>
//                                     </div>
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
//                                 </button>
//                             </div>
//                         )}

//                         {/* QR Code Display */}
//                         {paymentMethod === 'qr' && (
//                             <div className="text-center p-4">
//                                 <div className="flex items-center justify-between mb-4">
//                                     <h3 className="text-lg font-semibold">Scan to Pay</h3>
//                                     <button 
//                                         className="text-blue-600 text-sm"
//                                         onClick={generateQRCode}
//                                     >
//                                         Refresh QR
//                                     </button>
//                                 </div>
                                
//                                 <div className="bg-gray-50 p-6 rounded-lg">
//                                     {isQRLoading ? (
//                                         <div className="flex justify-center items-center h-[256px]">
//                                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
//                                         </div>
//                                     ) : (
//                                         <>
//                                             <QRCode 
//                                                 value={qrData} 
//                                                 size={256}
//                                                 level="H"
//                                                 includeMargin={true}
//                                             />
//                                             <div className="mt-4">
//                                                 <p className="font-semibold">Amount: ₹{parseFloat(amount) + parseFloat(shipping_charge)}</p>
//                                                 <p className="text-sm text-gray-600 mt-2">Scan with any UPI app</p>
//                                             </div>
//                                         </>
//                                     )}
//                                 </div>

//                                 <div className="mt-6 space-y-3">
//                                     <button 
//                                         className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
//                                         onClick={handleQRCodePayment}
//                                     >
//                                         I have completed the payment
//                                     </button>
//                                     <button 
//                                         className="w-full text-blue-600 py-2 px-4"
//                                         onClick={() => setPaymentMethod(null)}
//                                     >
//                                         Back to Payment Options
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         {/* Close Modal Button */}
//                         <button 
//                             className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
//                             onClick={() => setIsModalOpen(false)}
//                         >
//                             ✕
//                         </button>
//                     </div>
//                 </div>
//             )}

//             <Toaster/>
//         </>
//     )
// }

// export default Payment;



// import axios from "axios";
// import {API_URL} from "@/util/base_url";
// import Product from "@/app/bag/Components/MyBag";
// import toast, {Toaster} from "react-hot-toast";
// import {useRouter} from "next/navigation";
// import {useEffect, useState} from "react";

// interface PaymentProps {
//     productIds: any,
//     address: any,
//     amount: any,
//     selectedAddressId: any,
//     offer: any,
//     shipping_charge: any,
//     discount_payment: any
//     sub_amount:any
// }

// const Payment = ({ productIds, sub_amount,address, offer, amount, selectedAddressId, shipping_charge, discount_payment }: PaymentProps) => {
//     // succuss@razorpay

//     const router=useRouter()

//     const [data,setData]=useState<any>([])

//     let user:any=sessionStorage.getItem('user') || {}
//     user=JSON.parse(user)

//     const getProducts = async (para: string[]) => {
//         const token:any = sessionStorage.getItem('token') || " ";
//         let user: any;
//         const userString = sessionStorage.getItem('user');
//         if (userString) {
//             user = JSON.parse(userString);
//         } else {
//             user = {};
//         }
//         if(Object.keys(user).length>0){
//             const response = await fetch(`${API_URL}/get-match-products`, {
//                 method: 'POST',
//                 headers: {
//                     'x-access-token': token,
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({
//                     productIds: para,
//                     userId: user.id
//                 })
//             });
//             const data = await response.json();
//             if (response.status === 201) {
//                 setData(data.data);
//             }
//         }
//     };

//     useEffect(() => {
//         getProducts(productIds)
//     }, []);


//     async function createOrder(razorpay_order_id:any,razorpay_payment_id:any,razorpay_signature:any,payment_status:any) {
//         try {
//             if(data.length>0){
//                 const token:any = sessionStorage.getItem('token') || "";
//                 const response = await fetch(`${API_URL}/orders/create`, {
//                     method: 'POST',
//                     headers: {
//                         'x-access-token': token,
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(
//                         {
//                             userId:user.id,
//                             products:data,
//                             addressId:selectedAddressId,
//                             razorpay_order_id,
//                             razorpay_payment_id,
//                             razorpay_signature,
//                             amount,
//                             shipping_charge,
//                             discount_price:parseInt(discount_payment),
//                             offerId:offer.offerId || 0,
//                             sub_amount,
//                             payment_status
//                         }
//                     )
//                 });
//                 if (response.status==200) {

//                 }else{
//                     // toast.error("Payment Failed, Try Again")
//                 }
//             }

//         } catch (error:any) {
//             console.error('Error:', error.message);
//             throw error;
//         }
//     }
//     async function updateOrder(razorpay_order_id:any,razorpay_payment_id:any,razorpay_signature:any) {
//         try {
//             if(data.length>0){
//                 const token:any = sessionStorage.getItem('token') || "";
//                 const response = await fetch(`${API_URL}/orders/update`, {
//                     method: 'POST',
//                     headers: {
//                         'x-access-token': token,
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(
//                         {
//                             razorpay_order_id,
//                             razorpay_payment_id,
//                             razorpay_signature,
//                             payment_status:true
//                         }
//                     )
//                 });
//                 if (response.status==201) {

//                 }else{

//                 }
//             }

//         } catch (error:any) {
//             console.error('Error:', error.message);
//             throw error;
//         }
//     }

//     const checkoutHandler = async (amount:any) => {


//         const key = "rzp_live_5FnnvEf6D23aU2";
//         const token:any =sessionStorage.getItem('token')
//         const response = await fetch(`${API_URL}/checkout`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-access-token': token
//             },
//             body: JSON.stringify({
//                 amount:parseFloat(amount)+parseFloat(shipping_charge)
//             }),
//         });

//         const { order } = await response.json();

//         await createOrder(order.id, null, null, false)


//         const options = {
//             key,
//             amount: order.amount,
//             currency: "INR",
//             name: "Target Board Store",
//             order_id: order.id,
//             handler: async function (response: any) {
//                 const response1: any = await fetch(`${API_URL}/payment-verification`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'x-access-token': token,
//                     },
//                     body: JSON.stringify({
//                         razorpay_order_id: response.razorpay_order_id,
//                         razorpay_payment_id: response.razorpay_payment_id,
//                         razorpay_signature: response.razorpay_signature
//                     })
//                 });

//                 const result = await response1.json();
//                 if (result.success) {
//                     await updateOrder(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature)
//                     toast.success("Order Processed")
//                     sessionStorage.setItem("settingtab","1")
//                     sessionStorage.setItem("mybag","0")
//                     router.push("/account/orders")
//                 } else {
//                     toast.error("Payment Failed")
//                 }
//             },
//             prefill: {
//                 name: user.name,
//                 email: user.email,
//                 contact: user.phone
//             },
//             notes: {
//                 "address": "Razorpay Corporate Office"
//             },
//             theme: {
//                 "color": "#121212"
//             }
//         };

//         // @ts-ignore
//         const razor = new window.Razorpay(options);
//         // razor.on('payment.failed', function (response:any){
//         //     createOrder(order.id,response.razorpay_payment_id,response.razorpay_signature)
//         // });
//         razor.open();
//     }


//     return(
//         <>
//             <button className="btn btn-secondary disabled:bg-blue-400 " disabled={selectedAddressId?false:true} onClick={()=>checkoutHandler(amount)}>Pay</button>

//             <Toaster/>
//         </>
//     )
// }
// export default Payment;






import axios from "axios";
import {API_URL} from "@/util/base_url";
import Product from "@/app/bag/Components/MyBag";
import toast, {Toaster} from "react-hot-toast";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

interface PaymentProps {
    productIds: any,
    address: any,
    amount: any,
    selectedAddressId: any,
    offer: any,
    shipping_charge: any,
    discount_payment: any
    sub_amount: any
}

const Payment = ({ productIds, sub_amount, address, offer, amount, selectedAddressId, shipping_charge, discount_payment }: PaymentProps) => {
    const router = useRouter();
    const [data, setData] = useState<any>([]);
    const [isMobile, setIsMobile] = useState(false);

    let user: any = sessionStorage.getItem('user') || '{}';
    user = JSON.parse(user);

    useEffect(() => {
        // Check if device is mobile
        setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
        getProducts(productIds);
    }, [productIds]);

    const getProducts = async (para: string[]) => {
        const token: any = sessionStorage.getItem('token') || " ";
        let user: any;
        const userString = sessionStorage.getItem('user');
        if (userString) {
            user = JSON.parse(userString);
        } else {
            user = {};
        }
        
        if (Object.keys(user).length > 0) {
            try {
                const response = await fetch(`${API_URL}/get-match-products`, {
                    method: 'POST',
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productIds: para,
                        userId: user.id
                    })
                });
                
                const data = await response.json();
                if (response.status === 201) {
                    setData(data.data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error("Failed to fetch products");
            }
        }
    };

    async function createOrder(razorpay_order_id: any, razorpay_payment_id: any, razorpay_signature: any, payment_status: any) {
        try {
            if (data.length > 0) {
                const token: any = sessionStorage.getItem('token') || "";
                const response = await fetch(`${API_URL}/orders/create`, {
                    method: 'POST',
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: user.id,
                        products: data,
                        addressId: selectedAddressId,
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                        amount,
                        shipping_charge,
                        discount_price: parseInt(discount_payment),
                        offerId: offer.offerId || 0,
                        sub_amount,
                        payment_status
                    })
                });

                if (response.status !== 200) {
                    throw new Error('Failed to create order');
                }
            }
        } catch (error: any) {
            console.error('Error creating order:', error.message);
            toast.error("Failed to create order");
            throw error;
        }
    }

    async function updateOrder(razorpay_order_id: any, razorpay_payment_id: any, razorpay_signature: any) {
        try {
            if (data.length > 0) {
                const token: any = sessionStorage.getItem('token') || "";
                const response = await fetch(`${API_URL}/orders/update`, {
                    method: 'POST',
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                        payment_status: true
                    })
                });

                if (response.status !== 201) {
                    throw new Error('Failed to update order');
                }
            }
        } catch (error: any) {
            console.error('Error updating order:', error.message);
            toast.error("Failed to update order");
            throw error;
        }
    }

    const checkoutHandler = async (amount: any) => {
        try {
            const key = "rzp_live_5FnnvEf6D23aU2";
            const token: any = sessionStorage.getItem('token');
            
            // Create Razorpay order
            const response = await fetch(`${API_URL}/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({
                    amount: parseFloat(amount) + parseFloat(shipping_charge)
                }),
            });

            const { order } = await response.json();

            // Create initial order record
            await createOrder(order.id, null, null, false);

            const options = {
                key,
                amount: order.amount,
                currency: "INR",
                name: "Target Board Store",
                description: "Purchase Payment",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const response1: any = await fetch(`${API_URL}/payment-verification`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-access-token': token,
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const result = await response1.json();
                        if (result.success) {
                            await updateOrder(
                                response.razorpay_order_id,
                                response.razorpay_payment_id,
                                response.razorpay_signature
                            );
                            toast.success("Order Processed Successfully");
                            sessionStorage.setItem("settingtab", "1");
                            sessionStorage.setItem("mybag", "0");
                            router.push("/account/orders");
                        } else {
                            toast.error("Payment Verification Failed");
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        toast.error("Payment Processing Failed");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone
                },
                config: {
                    display: {
                        blocks: {
                            utib: {
                                name: "Pay using QR",
                                instruments: [
                                    {
                                        method: "upi",
                                        flows: ["qr"]  // Explicitly enable both QR and intent flows
                                    },
                                ]
                            },
                            other: {
                                name: "Other Payment Methods",
                                instruments: [
                                    {
                                        method: "card"
                                    },
                                    {
                                        method: "netbanking"
                                    },
                                    {
                                        method: "wallet"
                                    }
                                ]
                            }
                        },
                        sequence: ["block.banks"],
                        preferences: {
                            show_default_blocks: true  // Enable default display blocks
                        }
                    }
                },
                modal: {
                    confirm_close: true,
                    handleback: true,
                    escape: false,
                    animation: true,
                    backdropClose: false
                },
                retry: {
                    enabled: true,
                    max_count: 3
                },
                timeout: 300,
                notes: {
                    address: "Target Board Store"
                },
                theme: {
                    color: "#121212",
                    backdrop_color: "rgba(0, 0, 0, 0.7)"
                }
            };
//@ts-ignore
            const razor = new window.Razorpay(options);
            
            // Add specific event handlers for QR code
            razor.on('payment.failed', function (response: any) {
                toast.error("Payment Failed. Please try again.");
            });

            razor.on('ready', function(response: any) {
                // Force QR refresh when payment screen is ready
                if (isMobile) {
                    const qrButton = document.querySelector('[data-test-id="qr-button"]');
                    if (qrButton) {
                        (qrButton as HTMLElement).click();
                    }
                }
            });

            razor.open();
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error("Failed to initialize payment");
        }
    };

    return (
        <div className="w-full">
            <button 
                className="w-full btn btn-secondary disabled:bg-blue-400 disabled:cursor-not-allowed py-3 px-6 rounded-lg font-semibold"
                disabled={!selectedAddressId}
                onClick={() => checkoutHandler(amount)}
            >
                Pay ₹{parseFloat(amount) + parseFloat(shipping_charge)}
            </button>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />
        </div>
    );
};

export default Payment;