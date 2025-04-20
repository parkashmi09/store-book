"use client"
import { AiOutlineHome, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { IoBagHandleOutline } from "react-icons/io5";
import React, {useEffect, useRef, useState} from "react";
import { API_URL } from "@/util/base_url";
import Link from "next/link";
import ImageShadow from "react-image-shadow";
import { calculateFinalPrice } from "@/util/calculateFinalPrice";
import { FaStar } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Modal from "@/app/Components/Modal";
import {closeModal, openModal} from "@/util/modalFunctions";
import toast, {Toaster} from "react-hot-toast";
import EmptyBag from "@/app/bag/Components/EmptyBag";
import Loading from "@/app/Components/Loading";
import Address from "@/app/bag/Components/Address";
import Payment from "@/app/bag/Components/Payment";
import Recommendation from "@/app/Components/Recommendation";
import {router} from "next/client";
import {useRouter} from "next/navigation";
import Select from "react-select";

interface Product {
    bagId: any;
    productId: string;
    images: string[];
    name: string;
    original_price: number;
    discount: number;
    price: number;
    stock: number;
    quantity: number;
    size:any,
    color:any,
    colors:any,
    sizes:any
    // Add any other properties here
}

const MyBag = () => {
    const [tab,setTab]=useState<any>()
    const [ids,setIds]=useState<any>()
    const [addToBag,setAddToBag]=useState<any>(false)
    const [bagItems, setBagItems] = useState<Product[]>([]);
    const [itemId, setItemId] = useState<Product[]>();
    const [quantity, setQuantity] = useState<number[]>([]);
    const [loading,setLoading]=useState<any>()
    const [offers,setOffers]=useState<any>([])
    const [selectedAddress,setSelectedAddress]=useState<any>([])
    const dltRef=useRef<any>();
    const drawerOffer=useRef<any>();
    const [selectedAddressId,setSelectedAddressId]=useState<any>(0)
    const [productIds,setProductIds]=useState<any>([])


    let user: any;
    const userString:any = sessionStorage.getItem('user');
    if (userString) {
        user = JSON.parse(userString);
    } else {
        user = {};
    }

    const router=useRouter()

    useEffect(() => {
        getBag();
        const val:any=sessionStorage.getItem('settingtab') || null
        setTab(val?val:1)
    }, [addToBag]);

    const getBag = async () => {
        setLoading(true);
        const token = sessionStorage.getItem('token') || " ";
        let user:any = {};
        const userString = sessionStorage.getItem('user');
        if (userString) {
            user = JSON.parse(userString);
        }

        let IDS:any = [];
        if (Object.keys(user).length > 0) {
            const response = await fetch(`${API_URL}/get-bag/${user.id}`, {
                headers: {
                    'x-access-token': token
                }
            });
            if (response.status === 201) {
                const data = await response.json();
                IDS = data.data.map((item:any) => item.productId);
                sessionStorage.setItem('mybag', data.data.length);
                window.dispatchEvent(new Event("storage"));
                getProducts(IDS);
                getOffers();
                setAddToBag(addToBag ? false : null);
            }
        } else {
            let data:any=localStorage.getItem('guest')
            data=JSON.parse(data)
            if(data){
                IDS = data.map((item:any) => item.productId);
                localStorage.setItem('mybag', data.length);
                window.dispatchEvent(new Event("storage"));
                getProducts(IDS);
                setAddToBag(addToBag ? false : null);
            }
        }

        if (IDS.length > 0) {
            setIds(IDS);
            setProductIds(IDS);
            setLoading(false);
        } else {
            localStorage.clear()
            setLoading(false);
            // router.push("/")
        }
    };


    const getOffers = async () => {
        setLoading(true)
        const token:any = sessionStorage.getItem('token') || " ";
        const response = await fetch(`${API_URL}/offers`, {
            headers: {
                'x-access-token': token,
            },
        });
        if (response.ok) {
            const data = await response.json();
            setOffers(data.data);
        } else {
            throw new Error('Failed to fetch offers');
        }
    };

    const getProducts = async (para: string[]) => {
        const token:any = sessionStorage.getItem('token') || " ";
        let user: any;
        const userString = sessionStorage.getItem('user');
        if (userString) {
            user = JSON.parse(userString);
        } else {
            user = {};
        }

        if(Object.keys(user).length>0){
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
                setBagItems(data.data);
            }
        }
        else{
            let userData:any=localStorage.getItem('guest')
            const response = await fetch(`${API_URL}/get-match-products-n`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productIds: para,
                    userId: JSON.parse(userData)
                })
            });
            const data = await response.json();
            if (response.status === 201) {
                setBagItems(data.data);
            }
        }
    };

    const controlBag = async (id: string, quantity: number) => {
        let user: any;
        const userString = sessionStorage.getItem('user');
        if (userString) {
            user = JSON.parse(userString);
        } else {
            user = {};
        }
        const token:any = sessionStorage.getItem('token') || "";
        if (Object.keys(user).length>0) {
            const response = await fetch(`${API_URL}/control-q`, {
                method: 'POST',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id,
                    productId: id,
                    quantity,
                })
            });
            if(response){
               // await getBag()
                console.log(bagItems)
            }
        }else{
            let guest: any[] = JSON.parse(localStorage.getItem('guest') || '[]');

            const existingProductIndex = guest.findIndex((item) => item.productId === id);

            if (existingProductIndex !== -1) {
                guest[existingProductIndex].quantity = quantity;
                // guest[existingProductIndex].price = calculateFinalPrice(product.price, product.discount).toFixed(0);
            } else {
                guest.push(user);
            }

            localStorage.setItem('guest', JSON.stringify(guest));
        }
    };

    const controlColor = async (id: string,color:any) => {
        let user: any;
        const userString = sessionStorage.getItem('user');
        if (userString) {
            user = JSON.parse(userString);
        } else {
            user = {};
        }
        const token:any = sessionStorage.getItem('token') || "";
        if (Object.keys(user).length>0) {
            const response = await fetch(`${API_URL}/control-c`, {
                method: 'POST',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id,
                    productId: id,
                    color
                })
            });
            if(response){
                // await getBag()
                console.log(bagItems)
            }
        }else{
            let guest: any[] = JSON.parse(localStorage.getItem('guest') || '[]');

            const existingProductIndex = guest.findIndex((item) => item.productId === id);

            if (existingProductIndex !== -1) {
                guest[existingProductIndex].color = color;
            } else {
                guest.push(user);
            }

            localStorage.setItem('guest', JSON.stringify(guest));
        }
    };

    const controlSize = async (id: string, size:any) => {
        let user: any;
        const userString = sessionStorage.getItem('user');
        if (userString) {
            user = JSON.parse(userString);
        } else {
            user = {};
        }
        const token:any = sessionStorage.getItem('token') || "";
        if (Object.keys(user).length>0) {
            const response = await fetch(`${API_URL}/control-s`, {
                method: 'POST',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id,
                    productId: id,
                    size
                })
            });
            if(response){
                // await getBag()
                console.log(bagItems)
            }
        }else{
            let guest: any[] = JSON.parse(localStorage.getItem('guest') || '[]');

            const existingProductIndex = guest.findIndex((item) => item.productId === id);

            if (existingProductIndex !== -1) {
                guest[existingProductIndex].size = size;
            } else {
                guest.push(user);
            }

            localStorage.setItem('guest', JSON.stringify(guest));
        }
    };

    const updateQuantityAtIndex = (index: number, newQuantity: any) => {
        if (index < 0 || index >= bagItems.length) {
            console.error("Index out of range");
            return;
        }
        const updatedItems = bagItems.map((item: any, i: any) => {
            if (i === index) {
                return {
                    ...item,
                    quantity: newQuantity,
                };
            }
            return item;
        });
        setBagItems(updatedItems);
    };

    const updateColorAtIndex = (index: number, newColor: any) => {
        if (index < 0 || index >= bagItems.length) {
            console.error("Index out of range");
            return;
        }
        const updatedItems = bagItems.map((item: any, i: any) => {
            if (i === index) {
                return {
                    ...item,
                    color: newColor,
                };
            }
            return item;
        });
        setBagItems(updatedItems);
    };

    const updateSizeAtIndex = (index: number, newSize: any) => {
        if (index < 0 || index >= bagItems.length) {
            console.error("Index out of range");
            return;
        }
        const updatedItems = bagItems.map((item: any, i: any) => {
            if (i === index) {
                return {
                    ...item,
                    size: newSize,
                };
            }
            return item;
        });
        setBagItems(updatedItems);
    };


    const handleRemove=(id:any)=>{
        setItemId(id)
        openModal(dltRef)
    }

    async function removeBagItem(itemId:any) {
        closeModal(dltRef)
        try {
            if(Object.keys(user).length>0){
                const token:any = sessionStorage.getItem('token') || "";
                const response = await fetch(`${API_URL}/remove-item/${itemId}`, {
                    method: 'POST',
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'application/json'
                    },
                });

                const responseData = await response.json();
                if (response.status==201) {
                    toast.success("Item removed from bag")
                    getBag()
                }
            }else{
                let data:any = localStorage.getItem('guest');
                data = JSON.parse(data);
                data = data.filter((item:any) => item.productId !== itemId);
                const updatedDataString = JSON.stringify(data);
                localStorage.setItem('guest', updatedDataString);
                getBag()

            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }

    const [offer,setOffer]=useState<any>({})
    const totalPrice = bagItems.reduce((total:any, item:any) => {
        const priceAfterDiscount = calculateFinalPrice(item.original_price*item.quantity, item.discount);
        return total + priceAfterDiscount;
    }, 0).toFixed(0);

    const totalShippingCharges = bagItems.reduce((total:any, item:any) => {
        return total + item.delivery_charge;
    }, 0).toFixed(0);



    return (
        <>
            <div className="p-4 pl-20 pr-20 max-sm:p-2">

                <div className="text-sm breadcrumbs">
                    <ul>
                        <li>
                            <Link href="/">
                                <AiOutlineHome />
                            </Link>
                        </li>
                        <li>
                            <a>
                                <IoBagHandleOutline /> <span className="ml-1 underline">MyBag</span>
                            </a>
                        </li>
                    </ul>
                </div>

                {
                    loading?<Loading/>:
                        (
                            bagItems.length<=0?<EmptyBag/>:
                                <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-2">
                                    <div className="col-span-2 max-sm:col-span-1">
                                        {
                                            tab==1?
                                                (
                                                    bagItems.map((item, key) => (
                                                        <div key={key}>
                                                            <div className="grid grid-cols-3 border mt-4 max-sm:grid-cols-1 shadow-md rounded-xl items-center gap-8">
                                                                <div >
                                                                    <img src={item?.images[0]} className="transition h-44 ml-auto mr-auto p-4 "  alt="bag item"/>
                                                                </div>
                                                                <div className="col-span-2 max-sm:p-2">
                                                                    <p className="font-semibold">{item.name}</p>
                                                                    <div className="flex items-center mt-1 gap-2">
                                                                        <div>
                                                                            {
                                                                                item.discount?
                                                                                    <p><span className=" font-semibold">&#8377; {calculateFinalPrice(item.original_price, item.discount).toFixed(0)}</span> <span className="text-gray-500 text-sm opacity-80 line-through">&#8377; {item.original_price}</span> <span className="text-green-500 text-xs">({item.discount}% OFF)</span></p>
                                                                                    :
                                                                                    <p><span className=" font-semibold">&#8377; {item.original_price}</span></p>
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                        <div className="flex items-center flex-col max-sm:items-start lg:flex-row mt-2 gap-2">
                                                                            <div className="flex items-center">
                                                                                <p className="text-xs font-semibold mr-1">Quantity</p>
                                                                                <button
                                                                                    className="flex items-center justify-center w-6 h-6 cursor-pointer rounded-full bg-gray-200 text-gray-700 focus:outline-none"
                                                                                    onClick={() => {
                                                                                        if (item.quantity > 1) {
                                                                                            controlBag(item.productId, item.quantity-1);
                                                                                            updateQuantityAtIndex(key,item.quantity-1)
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <span>-</span>
                                                                                </button>
                                                                                <span className="mx-1">{item.quantity}</span>
                                                                                <button
                                                                                    className="flex items-center justify-center w-6 h-6 cursor-pointer rounded-full bg-gray-200 text-gray-700 focus:outline-none"
                                                                                    onClick={() => {
                                                                                        if (item.quantity < item.stock) {
                                                                                            controlBag(item.productId, item.quantity+1);
                                                                                            updateQuantityAtIndex(key,item.quantity+1)
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <span>+</span>
                                                                                </button>
                                                                            </div>

                                                                            {(item?.sizes && item.sizes.length > 0) && <div className="flex  items-center gap-1">
																				<label className="text-xs font-semibold ">Size</label>
																				<select
																					className="select select-sm  w-fit select-bordered"
                                                                                    // value={item?.size?.value}
																					defaultValue={item?.size?.value}
																					onLoad={()=>{
                                                                                        if(item.sizes.length===1) {
                                                                                            updateSizeAtIndex(key,item.sizes[0])
                                                                                            controlSize(item.productId,item.sizes[0])
                                                                                        }
                                                                                    }}
																					onChange={(e:any) => {
                                                                                        let a={
                                                                                            value:e.target.value,
                                                                                            label:e.target.value,
                                                                                        }
                                                                                        if(item.sizes.length===1) {
                                                                                            updateSizeAtIndex(key,item.sizes[0])
                                                                                            controlSize(item.productId,item.sizes[0])
                                                                                        }
                                                                                        controlSize(item.productId,a)
                                                                                    }}
																				>
                                                                                    {!item.size && <option value="">Select Size</option>}
                                                                                    {item?.sizes.map((option:any, index:any) => (
                                                                                        <option key={index} value={option.value}>
                                                                                            {option.label}
                                                                                        </option>
                                                                                    ))}
																				</select>
																			</div>}

                                                                            {(item?.colors && item.colors.length > 0) && <div className="flex  items-center gap-1">
																				<label className="text-xs font-semibold ">Color Variant</label>
																				<select
																					className="select select-sm  w-fit select-bordered"
																					// value={item?.color?.value}
                                                                                    defaultValue={item?.color?.value}
                                                                                    onLoad={()=>{
                                                                                        if(item.colors.length===1) {
                                                                                            updateColorAtIndex(key,item.colors[0])
                                                                                        controlColor(item.productId,item.colors[0])
                                                                                    }
                                                                                    }}
																					onChange={(e:any) => {
                                                                                        let a={
                                                                                            value:e.target.value,
                                                                                            label:e.target.value,
                                                                                        }
                                                                                        if(item.colors.length===1) {
                                                                                            updateColorAtIndex(key,item.colors[0])
                                                                                            controlColor(item.productId,item.colors[0])
                                                                                        }
                                                                                        controlColor(item.productId,a)
                                                                                    }}
																				>
                                                                                    {!item.color && <option value="">Select Color</option>}
                                                                                    {item?.colors.map((option:any, index:any) => (
                                                                                        <option key={index} value={option.value}>
                                                                                            {option.label}
                                                                                        </option>
                                                                                    ))}
																				</select>
																			</div>}



                                                                        </div>
                                                                    <button className="btn mt-1 btn-outline btn-sm ml-auto" onClick={()=>{
                                                                        if(Object.keys(user).length>0){
                                                                            handleRemove(item.bagId)}else{handleRemove(item.productId)}
                                                                    }}><MdDelete /> Remove</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                )
                                                : tab==2?
                                                    <Address tab={tab} setTab={setTab} selectedAddressId={selectedAddressId} setSelectedAddressId={setSelectedAddressId} setSelectedAddress={setSelectedAddress}/>:null
                                        }
                                        {
                                            tab==1?
                                                <div className="max-sm:hidden">
                                                    <Recommendation  ids={ids} setAddToBag={setAddToBag} />
                                                </div>
                                                :null
                                        }

                                    </div>
                                    <div >
                                        <div className="card mt-4 sticky top-12 bg-white border shadow-md">
                                            <div className="card-body !p-2">
                                                <h2 className="card-title">Order Details</h2>
                                                <hr/>
                                                <div className="grid grid-cols-2">
                                                    <strong>Products Total</strong>
                                                    <p className="justify-self-end">&#8377; {totalPrice}</p>
                                                </div>
                                                <div className="grid grid-cols-2">
                                                    <strong>Shipping Charges</strong>
                                                    {
                                                        totalShippingCharges?
                                                            <p className="justify-self-end ">&#8377; {totalShippingCharges}</p>:
                                                        <p className="justify-self-end text-green-500">Free</p>
                                                    }
                                                </div>

                                                {
                                                    offer.discount?
                                                        <div className="grid grid-cols-2">
                                                            <strong>Discount</strong>
                                                            <p className="justify-self-end">&#8377;{(totalPrice-calculateFinalPrice(totalPrice,offer?.discount)).toFixed(0)}</p>
                                                        </div>
                                                        :null
                                                }

                                                { Object.keys(user).length>0?
                                                    <div className="grid border   p-2 rounded-xl bg-gray-100 grid-cols-2">
                                                        <p className="font-semibold">Hava a promocode?</p>
                                                        <label htmlFor="drawerPromo" className="text-blue-600 justify-self-end">Select</label>
                                                        {offer.discount?<p className="text-blue-600">1 offer applied</p>:null}
                                                        {offer.discount? <button onClick={()=>(setOffer(""))} className="justify-self-end btn btn-xs  btn-outline">Remove code</button>:null}
                                                    </div>:null
                                                }

                                                <hr/>
                                                <div className="grid grid-cols-2">
                                                    <p className="text-lg font-semibold">Total Amount</p>
                                                    <p className="justify-self-end text-xl">&#8377;{offer.discount?parseFloat(calculateFinalPrice(totalPrice,offer?.discount).toFixed(0))+parseFloat(totalShippingCharges):parseFloat(totalPrice)+parseFloat(totalShippingCharges)}</p>
                                                </div>
                                                {
                                                    Object.keys(user).length>0?
                                                        (
                                                            tab==1?
                                                                <button onClick={()=>(setTab(2),sessionStorage.setItem('settingtab',"2"))} className="btn mt-2   bg-gradient-to-r from-violet-600 to-indigo-600 text-white justify-self-end" >Place Order</button>
                                                                :tab==2?
                                                                    // <button  onClick={()=>(setTab(3),sessionStorage.setItem('settingtab',"3"))} className="btn disabled:opacity-50 disabled:bg-blue-500 disabled:text-black mt-2 btn-sm  btn-secondary justify-self-end" >Pay</button>
                                                                    <Payment offer={offer} address={selectedAddress} selectedAddressId={selectedAddressId} productIds={productIds} sub_amount={totalPrice} amount={offer.discount?calculateFinalPrice(totalPrice,offer?.discount).toFixed(0):totalPrice} shipping_charge={totalShippingCharges} discount_payment={(totalPrice-calculateFinalPrice(totalPrice,offer?.discount)).toFixed(0)} />
                                                                    // <button   className="btn disabled:opacity-50 disabled:bg-blue-500 disabled:text-black mt-2 btn-sm  btn-secondary justify-self-end" >Pay</button>
                                                                    :null
                                                        )
                                                        :
                                                        <button onClick={()=>(router.push("/login"))} className="btn mt-2  cursor-pointer bg-gradient-to-r from-violet-600 to-indigo-600 text-white justify-self-end" >Place Order</button>
                                                }
                                            </div>
                                            <hr/>
                                            <div className="grid mt-6  mb-6 grid-cols-3">
                                                <div className="border-r border-blue-500">
                                                    <img src={"/shield.png"} className="w-8 ml-auto mr-auto " alt={"secure"}  />
                                                    <p className="text-gray-500 text-xs font-semibold text-center">100% Safe & Secure Payments</p>
                                                </div>
                                                <div className="border-r border-blue-500">
                                                    <img src={"/replacement.png"} className="w-8 ml-auto mr-auto " alt={"secure"}  />
                                                    <p className="text-gray-500 text-xs font-semibold text-center">Easy return and replacements</p>
                                                </div>
                                                <div>
                                                    <img src={"/package.png"} className="w-8 ml-auto mr-auto " alt={"secure"}  />
                                                    <p className="text-gray-500 font-semibold text-xs text-center">Trusted Shipping</p>
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                    {
                                        tab==1?
                                            <div className="hidden max-sm:block">
                                                <Recommendation  ids={ids} setAddToBag={setAddToBag} />
                                            </div>
                                            :null
                                    }
                                </div>
                        )
                }



            </div>


            <Modal name={"Remove Item?"} modalName={"editModal"} refName={dltRef} width={""}>
                <div className="grid grid-cols-2 max-sm:grid-cols-1 items-center mt-4  gap-2">
                    <button className="btn btn-error btn-sm btn-outline w-full" onClick={()=>(removeBagItem(itemId))}>Remove</button>
                    <button className="btn btn-neutral  btn-sm w-full" onClick={()=>(closeModal(dltRef))}>Cancel</button>
                </div>
            </Modal>


            <div className="drawer !z-40 drawer-end">
                <input id="drawerPromo" type="checkbox" className="drawer-toggle" />
                <div className="drawer-side">
                    <label ref={drawerOffer} htmlFor="drawerPromo" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                        {
                            offers.map((offerItm:any,key:any)=>(
                                <li key={key}>
                                    <div className="card m-1 bg-base-100 c-shadow">
                                        <div className="card-body !p-2">
                                            <h2 className="card-title">{offerItm.name}</h2>
                                            <p>{offerItm.associated}</p>
                                            <strong>{offerItm.promocode}</strong>
                                            <strong>{offerItm.discount}% Off</strong>
                                            <button  onClick={()=>(setOffer(offerItm), drawerOffer.current.click())} disabled={offerItm.offerId===offer.offerId || !offerItm.status} className="btn btn-primary btn-sm">{ !offerItm.status?"Expired":offerItm.offerId===offer.offerId?"Applied":"Apply"}</button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>

            <Toaster/>
        </>
    );
};

export default MyBag;
