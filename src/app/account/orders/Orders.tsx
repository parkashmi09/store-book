"use client"
import Link from "next/link";
import {AiOutlineHome} from "react-icons/ai";
import React, {useEffect, useState} from "react";
import {MdAccountCircle} from "react-icons/md";
import {FaBox} from "react-icons/fa6";
import {API_URL} from "@/util/base_url";
import {convertUTCToIST} from "@/util/convertDate";
import {encryptString} from "@/util/decode";
import Loading from "@/app/Components/Loading";

const Orders = () => {

    // const [search,setSearch]=useState<any>()
    const [data,setData]=useState<any>([])
    const [isLoading,setIsLoading]=useState<any>()

    let user: any;

    if (typeof sessionStorage !== 'undefined') {
        user = sessionStorage.getItem('user');
        user = user ? JSON.parse(user) : null;
    } else {
        user = null;
    }

    const getData = async () => {
        try {
            setIsLoading(true)
            const token:any=sessionStorage.getItem('token') || " "

            const response = await fetch(`${API_URL}/orders/${user.id}`,
                {
                    headers: {
                        'x-access-token': token,
                    }}
            )
            const data1 = await response.json();
            if (response.status === 201) {
                setData(data1.data)
                setIsLoading(false)
            }
        } catch (error) {

        }
    };



    useEffect(() => {
        getData()
    }, []);


    return(
        <>

            <div className="m-4">
                <div className="card  bg-white c-shadow ">
                    <div className="card-body">

                        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-1 items-center">
                            <div className="text-sm breadcrumbs">
                                <ul>
                                    <li>
                                        <Link href="/">
                                            <AiOutlineHome/>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/account">
                                            <MdAccountCircle/>
                                            <span className="ml-1">Account</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <a>
                                            <FaBox/>
                                            <span className="ml-1 underline">Orders</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="justify-self-end">
                                <input type="search" placeholder="Type here" className="input input-sm input-bordered w-full " />
                            </div>
                        </div>


                        <div>

                            {
                                !isLoading?
                                    (
                                        data.length>0?(
                                            data.map((item:any,key:any)=>(
                                                <Link href={`/account/orders/${encodeURIComponent(encryptString(item.orderId))}`} key={key} className="card cursor-pointer card-side bg-base-100 border m-1 rounded-md">
                                                    <figure><img src={item?.products[0].images[0]} alt="Movie" className="w-20"/></figure>
                                                    <div className="card-body !p-2">
                                                        <div className="grid grid-cols-2 gap-2 items-center">
                                                            <div>
                                                                <div className="flex items-center gap-1">
                                                                    <h2 className="truncate w-44 max-sm:w-20 font-semibold">
                                                                        {item?.products[0].name}
                                                                    </h2>{item?.products.length<=1?null:
                                                                    <span className="font-semibold">and more..</span>}
                                                                </div>
                                                                <p className="font-medium">&#8377;{parseInt(item.amount)+parseInt(item.shipping_charge)}</p>
                                                                <p className="text-xs">Order has been placed on {convertUTCToIST(item?.created_at)}</p>
                                                            </div>
                                                            <div className="justify-self-end">

                                                                {
                                                                    item.cancellation?.isCancelled?
                                                                        <p className="text-red-500 font-medium text-sm">Cancelled</p>:<p className="text-green-700 font-medium text-sm">Delivery by {item?.expected_delivery}</p>
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))
                                            )
                                       :<p>
                                                No Orders Found
                                            </p>
                                    )
                                    :<Loading/>
                            }
                        </div>

                    </div>
                </div>
            </div>

        </>
    )
}
export default Orders;
