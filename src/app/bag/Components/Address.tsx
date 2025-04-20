"use client"
import React, {useEffect, useRef, useState} from "react";
import {API_URL} from "@/util/base_url";
import toast, {Toaster} from "react-hot-toast";
import {MdEditLocationAlt, MdOutlineDeleteOutline} from "react-icons/md";
import {closeModal, openModal} from "@/util/modalFunctions";
import Modal from "@/app/Components/Modal";
import {FaEdit} from "react-icons/fa";

interface AddressProps {
    tab: any,
    setTab: any,
    selectedAddressId: any,
    setSelectedAddressId:any
    setSelectedAddress:any
}

const Address = ({ tab, setTab, selectedAddressId ,setSelectedAddressId,setSelectedAddress}: AddressProps) => {

    const [flag,setFlag]=useState<any>()
    const [flagEdit,setFlagEdit]=useState<any>()
    const [addresses,setAddresses]=useState<any>([])
    const [addressId,setAddressId]=useState<any>()
    const [phone,setPhone]=useState<any>()
    const [name,setName]=useState<any>()
    const [pincode,setPincode]=useState<any>()
    const [alternatePhone,setAlternatePhone]=useState<any>()
    const [address,setAddress]=useState<any>()
    const [landmark,setLandmark]=useState<any>()
    const [district,setDistrict]=useState<any>()
    const [city,setCity]=useState<any>()
    const [state,setState]=useState<any>()

    const checkPincode=async (pincode:any)=>{
        const token:any=sessionStorage.getItem('token') || " "
        const response = await fetch(`${API_URL}/check-service/${pincode}`,
            {headers: {
                    'x-access-token': token,
                },
            })
        if (response.status === 201) {
            const data = await response.json();
            setCity(data.data?.city)
            setState(data.data?.state)
            setDistrict(data.data?.district)

        }else if(!response){
        }
    }

    useEffect(() => {
        if(pincode?.length == 6){
            checkPincode(pincode)
        }
    }, [pincode]);


    const ClearData=()=>{
        setDistrict("")
        setAddress("")
        setPincode("")
        setLandmark("")
        setPhone("")
        setAlternatePhone("")
        setCity("")
        setState("")
        setName("")
    }

    const getData = async () => {
        const token:any = sessionStorage.getItem('token') || " ";
        const user = JSON.parse(sessionStorage.getItem('user') || "{}");
        const response = await fetch(`${API_URL}/addresses/${user.id}`, {
            headers: {
                'x-access-token': token
            }
        });
        const data = await response.json();
        if (response.status === 201) {
            setAddresses(data.data)
            if(data.data.length>0){
                setFlag(true)
            }
            if(tab!=0){
                setSelectedAddressId(data.data[0]?.addressId)
                setSelectedAddress(data?.data[0])
            }
        }
    };

    useEffect(() => {
        getData()
    }, []);
    const handleSubmit = async  (e: React.FormEvent) => {
        e.preventDefault();
        let user:any=sessionStorage.getItem('user')
         user=JSON.parse(user)
        const addressData = {
           userId:user.id, phone, name, pincode, alternatePhone, address, landmark, district, city, state,
        };
        const token = sessionStorage.getItem('token');
        const headers:any = {
            'Content-Type': 'application/json',
            'x-access-token': token,
        };

        const response = await fetch(`${API_URL}/addresses/create`, {
            method: 'POST',
            headers,
            body: JSON.stringify(addressData),
        });

        if (response.ok) {
            const result = await response.json();
            toast.success("Address Added")
            ClearData()
            getData()
        } else {
            console.error('Error:', response.statusText);

        }
    };

    const handleEdit = async  (e: React.FormEvent) => {
        e.preventDefault();
        let user:any=sessionStorage.getItem('user')
        user=JSON.parse(user)
        const addressData = {
            userId:user.id,addressId, phone, name, pincode, alternatePhone, address, landmark, district, city, state,
        };
        const token = sessionStorage.getItem('token');
        const headers:any = {
            'Content-Type': 'application/json',
            'x-access-token': token,
        };

        const response = await fetch(`${API_URL}/addresses/update`, {
            method: 'POST',
            headers,
            body: JSON.stringify(addressData),
        });

        if (response.ok) {
            const result = await response.json();
            toast.success("Address Updated")
            ClearData()
            getData()
        } else {
            console.error('Error:', response.statusText);

        }
    };

    const dltRef=useRef<any>()

    const handleDelete=(id:any)=>{
        setSelectedAddressId(id)
        openModal(dltRef)
    }

    const handleUpdate=(item:any)=>{
        setAddressId(item.addressId)
        setAddress(item.address)
        setPincode(item.pincode)
        setName(item.name)
        setCity(item.city)
        setDistrict(item.district)
        setLandmark(item?.landmark)
        setPhone(item.phone)
        setAlternatePhone(item?.alternatePhone)
        setState(item.state)
        setFlag(false)
    }

    async function removeAddress(itemId:any) {
        closeModal(dltRef)
        try {
            const token:any = sessionStorage.getItem('token') || "";
            const response = await fetch(`${API_URL}/remove-address/${itemId}`, {
                method: 'POST',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                },
            });

            const responseData = await response.json();
            if (response.status==201) {
                toast.success("Address removed")
                getData()
            } else {

            }
        } catch (error) {
            console.error('Network error:', error);
        }
    }





    return(
        <>

            {
                selectedAddressId=="profile" ? null: <ul className="timeline w-1/2 max-sm:w-32">
					<li className="w-32 max-sm:w-fit">
						<hr className="bg-primary"/>
						<div onClick={()=>(setTab(1))} className="timeline-start cursor-pointer timeline-box text-xs" title="Back to order details">Order Details</div>
						<div className="timeline-middle">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
						</div>
						<hr className="bg-primary"/>
					</li>
					<li className="w-full">
						<hr className="bg-primary"/>
						<div className="timeline-start timeline-box text-xs">Address</div>
						<div className="timeline-middle">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
						</div>
						<hr />
					</li>

					<li className="w-full">
						<hr/>
						<div className="timeline-start timeline-box text-xs">Payment</div>
						<div className="timeline-middle">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
						</div>
					</li>
				</ul>
            }

            <div className="p-4 pt-0 pb-0">
                {
                    addresses.length>0 && !flag?  <button onClick={()=>(setFlag(true))} className="justify-self-end font-semibold text-md max-sm:text-sm text-blue-600 btn btn-outline btn-sm">Show saved Addresses</button>:null
                }
            </div>

            {
                flag?
                    <>

                        <div className="grid p-4 grid-cols-2 gmax-sm:rid-cols-1">
                            <p className="font-semibold text-xl max-sm:text-sm">Select Address</p>
                            <button onClick={()=>(setFlag(false))} className="justify-self-end font-semibold text-md max-sm:btn-sm text-blue-600 btn btn-outline btn-sm">+ New Address</button>

                        </div>

                        {addresses.map((item:any, key:any) => (
                            <div
                                key={key}
                                className={`flex p-5 m-1 rounded-md items-center gap-2 cursor-pointer border ${selectedAddressId === item.addressId ? 'bg-blue-200' : 'bg-white'}`}
                            >
                                <input
                                    type="radio"
                                    id={`radio-${item.addressId}`}
                                    name="addressRadio"
                                    className={`radio radio-sm checked:bg-blue-300 ${selectedAddressId=="profile"?"hidden":"block"}`}
                                    onChange={() => (setSelectedAddressId(item.addressId), setSelectedAddress(item))}
                                    checked={selectedAddressId === item.addressId}
                                />
                                <label className="flex-grow"  htmlFor={`radio-${item.addressId}`}>
                                    <div>
                                        <p className="font-semibold flex items-center gap-1 max-sm:text-sm">
                                            {item.name}
                                        </p>
                                        <p className="text-xs">{item.address + (item?.landmark ? ', ' + item.landmark : '') + ', ' + item.city + ', ' + item.district + ', ' + item.state + ' - ' + item.pincode}</p>
                                        <p className="font-semibold max-sm:text-sm">+91-{item.phone}</p>
                                        <p className="font-semibold max-sm:text-sm">{item?.alternatePhone ? `Alternate: +91-${item.alternatePhone}` : ''}</p>
                                    </div>
                                </label>
                                <div className="flex-none">
                                    <button  className="btn btn-sm text-md   btn-outline m-1 btn-neutral" onClick={() => (handleUpdate(item),setFlagEdit(true))}><FaEdit/></button>
                                    <button  className="btn btn-sm text-md   m-1 btn-outline btn-error " onClick={() => (handleDelete(item.addressId))}><MdOutlineDeleteOutline/></button>
                                </div>
                            </div>
                        ))}



                    </>
                    :
                    <form className="p-4" onSubmit={flagEdit?handleEdit:handleSubmit}>
                        <div className="form-control">
                            <label className="label">
                                                                    <span className="label-text ">Name*
                                                                    </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Name"
                                className="input border-gray-300 rounded-r-xl w-full !outline-none transition delay-150 "
                                required
                                value={name}
                                onChange={(e) => (setName(e.target.value))}
                            />
                        </div>

                        <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-1">
                            <div className="form-control">
                                <label className="label">
                                                <span className="label-text ">Phone Number*
                                                </span>
                                </label>
                                <div className={"flex items-center"}>
                                    <label className={"btn btn-outline bg-white c-shadow border-gray-300 hover:bg-transparent hover:border-gray-300 hover:text-black rounded-l-xl"}>+91</label>
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        className="input border-gray-300 rounded-r-xl w-full !outline-none transition delay-150 "
                                        required
                                        value={phone}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            if (/^\d*$/.test(input) && input.length <= 10) {
                                                setPhone(input);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                                <span className="label-text ">Alternate Phone Number
                                                </span>
                                </label>
                                <div className={"flex items-center"}>
                                    <label className={"btn btn-outline bg-white c-shadow border-gray-300 hover:bg-transparent hover:border-gray-300 hover:text-black rounded-l-xl"}>+91</label>
                                    <input
                                        type="tel"
                                        placeholder="Alternate Phone Number"
                                        className="input border-gray-300 rounded-r-xl w-full !outline-none transition delay-150 "
                                        value={alternatePhone}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            if (/^\d*$/.test(input) && input.length <= 10) {
                                                setAlternatePhone(input);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                                                    <span className="label-text ">Pincode*
                                                                    </span>
                            </label>
                            <input
                                type="number"
                                placeholder="Pincode"
                                className="input border-gray-300 rounded-r-xl w-full !outline-none transition delay-150 "
                                required
                                value={pincode}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    if (/^\d*$/.test(input) && input.length <= 6) {
                                        setPincode(input)
                                    }
                                }}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                                                    <span className="label-text ">Address (House No and Street or Village)*
                                                                    </span>
                            </label>
                            <textarea
                                placeholder="Address (House No and Street or Village)"
                                className="input border-gray-300 h-32 rounded-r-xl w-full !outline-none transition delay-150 "
                                required
                                value={address}
                                onChange={(e) => (setAddress(e.target.value))}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                                                    <span className="label-text ">Landmark
                                                                    </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Landmark"
                                className="input border-gray-300 rounded-r-xl w-full !outline-none transition delay-150 "
                                value={landmark}
                                onChange={(e) => (setLandmark(e.target.value))}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2 max-sm:grid-cols-1">
                            <div className="form-control">
                                <label className="label">
                                                                    <span className="label-text ">City*
                                                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="City"
                                    className="input border-gray-300 disabled:bg-transparent rounded-r-xl w-full !outline-none transition delay-150 "

                                    value={city}
                                    onChange={(e) => (setCity(e.target.value))}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                                                    <span className="label-text ">District*
                                                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="District"
                                    className="input border-gray-300 disabled:bg-transparent rounded-r-xl w-full !outline-none transition delay-150 "
                                    required

                                    value={district}
                                    onChange={(e) => (setDistrict(e.target.value))}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                                                    <span className="label-text ">State*
                                                                    </span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="State"
                                    className="input border-gray-300 disabled:bg-transparent rounded-r-xl w-full !outline-none transition delay-150 "
                                    required
                                    value={state}
                                    onChange={(e) => (setState(e.target.value))}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn mt-2 ml-auto btn-sm  btn-secondary ">{flagEdit?"Update":"Save"} Address</button>

                    </form>

            }


            <Modal name={"Remove Item?"} modalName={"Delete Address"} refName={dltRef} width={""}>
                <div className="grid grid-cols-2 max-sm:grid-cols-1 items-center mt-4  gap-2">
                    <button className="btn btn-error btn-sm btn-outline w-full" onClick={()=>(removeAddress(selectedAddressId))}>Delete</button>
                    <button className="btn btn-neutral  btn-sm w-full" onClick={()=>(closeModal(dltRef))}>Cancel</button>
                </div>
            </Modal>

            <Toaster/>
        </>
    )
}
export default Address;
