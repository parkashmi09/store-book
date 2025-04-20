"use client"
import React, {useEffect, useRef, useState} from "react";
import {API_URL} from "@/util/base_url";
import toast, {Toaster} from "react-hot-toast";
import {useParams} from "next/navigation";
import {decryptString} from "@/util/decode";
import {calculateFinalPrice} from "@/util/calculateFinalPrice";
import Modal from "@/app/Components/Modal";
import {closeModal, openModal} from "@/util/modalFunctions";
import Link from "next/link";
import {AiOutlineHome} from "react-icons/ai";
import Loading from "@/app/Components/Loading";

const Order = () => {

    const [data,setData]=useState<any>()
    const [loading,setLoading]=useState<any>()
    const [reason,setReason]=useState<any>()
    const [orderId,serOrderId]=useState<any>()
    const [refund,setRefund]=useState<any>()
    const dltRef=useRef<any>()
    const param:any=useParams()
    let user: any;

    if (typeof sessionStorage !== 'undefined') {
        user = sessionStorage.getItem('user');
        user = user ? JSON.parse(user) : null;
    } else {
        user = null;
    }

    const getData = async () => {
        setLoading(true)
        const token:any=sessionStorage.getItem('token') || " "
        const response = await fetch(`${API_URL}/orders/history`,
            {
                method: 'POST',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId:user.id,
                    orderId:decryptString(decodeURIComponent(param.slug)),
                }),
            })
        const data = await response.json();
        if(response.status===201) {
            setData(data.data)
            checkRefund(data.data.razorpay_payment_id)
            checkPincode(data.data.address.pincode)
            setLoading(false)
        }
    };

    const cancelOrder = async (order_id:any) => {
        debugger
        const token:any=sessionStorage.getItem('token') || " "
        const response = await fetch(`${API_URL}/orders/cancel`,
            {
                method: 'POST',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    orderId:decryptString(decodeURIComponent(param.slug)),
                    order_id:order_id,
                    isCancelled:true,
                    reason:reason
                }),
            })
        // const data = await response.json();
        if(response.status===201) {
            toast.success("Order cancelled")
            getData()
            closeModal(dltRef)
        }
    };

    const [deliveryData,setDeliveryData]=useState<any>([])
    const checkPincode=async (pincode:any)=>{
        const token:any=sessionStorage.getItem('token') || ""
        const response = await fetch(`${API_URL}/check-service/${pincode}`,
            {headers: {
                    'x-access-token': token,
                },
            })
        if (response.status === 201) {
            const data = await response.json();
            setDeliveryData(data.data)
        }else if(!response){
        }
    }
    useEffect(() => {
        getData()
    }, []);

    const checkRefund = async (id:any) => {
        try {
            const token:any=sessionStorage.getItem('token') || " "

            const response = await fetch(`${API_URL}/status/refund/${id}`,
                {
                    headers: {
                        'x-access-token': token,
                    }}
            )
            const data1 = await response.json();
            if (response.status === 200) {
                debugger
                setRefund(data1.refund)
            }
        } catch (error) {

        }
    };

    return(
        <>

            <div className="p-5 pl-20 pr-20 max-sm:p-4">
                <p className="font-semibold">Order Details</p>
                <div className="text-sm breadcrumbs">
                    <ul>
                        <li>
                            <Link href="/">
                                <AiOutlineHome/>
                            </Link>
                        </li>
                        <li>
                            <Link href="/account/orders">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                Orders
                            </Link>
                        </li>
                    </ul>
                </div>

                {
                    loading?
                        <Loading/>: <>
                            <div className="card  bg-base-100 border rounded-sm">
                                <div className="card-body">
                                    <div className="grid grid-cols-2 max-sm:grid-cols-1">
                                        <div>
                                            <h2 className="text-md font-semibold">Delivery Address</h2>
                                            <h2 className="text-sm">{data?.address.name}</h2>
                                            <p className="text-sm">{data?.address.address + data?.address?.landmark + ", " + data?.address?.city + ", " + data?.address?.district + ", " + data?.address.pincode + ", " + data?.address.state }</p>
                                            <p className="text-sm"><strong>Phone Number: </strong>{data?.address?.phone}</p>
                                            <p className="text-sm">{data?.address?.alternate_phone}</p>
                                        </div>
                                        <div className="justify-self-end">
                                            { data?.cancellation?.isCancelled ?null: <button onClick={()=>(openModal(dltRef))} className="btn btn-outline btn-xs ">Cancel</button> }
                                        </div>
                                    </div>

                                </div>
                            </div>


                            <h2 className="text-sm font-semibold p-5 pb-0">Total Order Amount Paid: &#8377; {parseFloat(data?.amount)+parseFloat(data?.shipping_charge)} and {data?.OfferId!="0"?<span className="text-green-600 font-semibold text-sm">1 Offer Applied</span>:null}</h2>
                            <p className="font-semibold p-5 pt-0 text-sm">Expected Delivery by {deliveryData?.expected_delivery?.date}</p>
                            <p className="font-semibold p-5 pt-0 text-sm">Tracking Id (AWB)  <a target="_blank" className="text-blue-600" href={`https://shiprocket.co/tracking/${data?.awb}`}>{data?.awb}</a></p>

                            {
                                data?.products?.map((item:any,key:any)=>(
                                    <div key={key} className="card lg:card-side border rounded-sm">
                                        <figure><img  src={item.images[0]} className="w-40 max-sm:w-full m-4" alt={item.name}/></figure>
                                        <div className="card-body !p-2">
                                            <div className="grid grid-cols-3 items-center max-sm:grid-cols-1 gap-1">
                                                <div>
                                                    <h2 className="truncate w-72 max-sm:w-40 mt-10 max-sm:mt-1 text-sm font-semibold">
                                                        {item?.name}
                                                    </h2>
                                                    {/*{item?.length<=1?null:*/}
                                                    {/*<span className="font-semibold text-sm">and Other Items..</span>}*/}
                                                    <p className="mt-4"><span className="text-sm font-semibold">&#8377; {calculateFinalPrice(item.original_price, item.discount).toFixed(0)}</span> <span className="text-gray-500 text-sm opacity-80 line-through">&#8377; {item.original_price}</span>{item.OfferId!="0"?<span className="text-green-600 text-sm"> Offer Applied</span>:null}</p>
                                                </div>
                                                <div className="col-span-2 items-center">
                                                    {
                                                        data.cancellation?.isCancelled?
                                                            <>
                                                                <p className="font-medium">Reason for cancellation: {data.cancellation?.reason}</p>
                                                                <ul className="timeline w-full mt-10  timeline-vertical lg:timeline-horizontal max-sm:w-full">
                                                                    <li className="w-fit max-sm:w-fit">
                                                                        <hr className="bg-primary"/>
                                                                        <div  className="timeline-start cursor-pointer text-xs timeline-box max-sm:w-36" title="Back to order details">Refund Initiated</div>
                                                                        <div className="timeline-middle">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                                                        </div>
                                                                        <hr />
                                                                    </li>
                                                                    <li className="w-fit">
                                                                        {refund?   <hr className="bg-primary"/>:<hr/>}
                                                                        <div className="timeline-start timeline-box text-xs max-sm:w-36">Refund Issued</div>
                                                                        <div className="timeline-middle">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 "><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                                                        </div>
                                                                        {refund?   <hr className="bg-primary"/>:<hr/>}
                                                                    </li>
                                                                    <li className="w-fit">
                                                                        {refund?   <hr className="bg-primary"/>:<hr/>}
                                                                        <div className="timeline-start timeline-box text-xs max-sm:w-36">Refund Completed</div>
                                                                        <div className="timeline-middle">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 "><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                                                        </div>
                                                                        {/*<hr/>*/}
                                                                    </li>
                                                                </ul>
                                                            </>
                                                            :  <ul className="timeline w-full mt-10  timeline-vertical lg:timeline-horizontal max-sm:w-full">
                                                                <li className="w-fit max-sm:w-fit">
                                                                    <hr className="bg-primary"/>
                                                                    <div  className="timeline-start cursor-pointer text-xs timeline-box max-sm:w-36" title="Back to order details">Processing</div>
                                                                    <div className="timeline-middle">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                                                    </div>
                                                                    <hr className={`${data.status_code==3?"bg-primary":""}`} />
                                                                </li>
                                                                <li className="w-fit">
                                                                    <hr className={`${data.status_code==3?"bg-primary":""}`} />
                                                                    <div className="timeline-start timeline-box text-xs max-sm:w-36">Confirmed</div>
                                                                    <div className="timeline-middle">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"  className={`w-5 h-5  ${data.status_code==3?"text-primary":""}`} ><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                                                    </div>
                                                                    <hr className={`${data.status_code==6?"bg-primary":""}`} />
                                                                </li>
                                                                <li className="w-fit">
                                                                    <hr className={`${data.status_code==6?"bg-primary":""}`} />
                                                                    <div className="timeline-start timeline-box text-xs max-sm:w-36">Shipped</div>
                                                                    <div className="timeline-middle">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5  ${data.status_code==6?"text-primary":""}`}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                                                    </div>
                                                                    <hr className={`${data.status_code==8?"bg-primary":""}`} />
                                                                </li>
                                                                <li className="w-fit">
                                                                    <hr className={`${data.status_code==8?"bg-primary":""}`} />
                                                                    <div className="timeline-start timeline-box text-xs max-sm:w-36">Delivered</div>
                                                                    <div className="timeline-middle">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5  ${data.status_code==8?"text-primary":""}`}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </>
                }


                <Modal name={"Cancel Order?"} modalName={"editModal"} refName={dltRef} width={""}>
                     <textarea
                         placeholder="Reason for cancellation "
                         className="textarea textarea-bordered h-20 w-full"
                         value={reason}
                         onChange={(e) => (setReason(e.target.value))}
                     />
                    <div className="grid grid-cols-2 max-sm:grid-cols-1 items-center mt-4  gap-2">
                        <button className="btn btn-secondary btn-sm btn-outline w-full" onClick={()=>(cancelOrder(data?.order_id))}>Yes</button>
                        <button className="btn btn-neutral  btn-sm w-full" onClick={()=>(closeModal(dltRef))}>No</button>
                    </div>
                </Modal>


            </div>

            <Toaster/>
        </>
    )
}
export default Order
