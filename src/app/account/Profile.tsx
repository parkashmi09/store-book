"use client"
import {FiBox} from "react-icons/fi";
import {MdOutlinePassword, MdRecommend} from "react-icons/md";
import Modal from "@/app/Components/Modal";
import React, {useEffect, useRef, useState} from "react";
import {closeModal, openModal} from "@/util/modalFunctions";
import toast from "react-hot-toast";
import {API_URL} from "@/util/base_url";
import {FaBagShopping} from "react-icons/fa6";
import Link from "next/link";
import Address from "@/app/bag/Components/Address";

const Profile = () => {

    let user: any;

    if (typeof sessionStorage !== 'undefined') {
        user = sessionStorage.getItem('user');
        user = user ? JSON.parse(user) : null;
    } else {
        user = null;
    }
    const passRef=useRef<any>()
    const [currentPassword,setCurrentPassword]=useState<any>()
    const [newPassword,setNewPassword]=useState<any>()
    const [confirmPassword,setConfirmPassword]=useState<any>()
    const [matchPsw, setMatchPsw] = useState<Boolean>();

    const handlePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        const token:any=sessionStorage.getItem('token') || " "
        const response = await fetch(`${API_URL}/change-password`,
            {
                method: 'POST',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone:user.phone,
                    password:currentPassword,
                    newPassword
                }),
            })
            closeModal(passRef)
            const data = await response.json();
            debugger
            if(response.status===201) {
                toast.success('Password changed success');
            }
            else if(data.status==404){
                toast.error('Change Failed');
            }
            else if (data.type == "password") {
                toast.error("Current password is wrong");
            }
            else{
                toast.error('Failed');
            }
    };

    useEffect(() => {
        newPassword==confirmPassword?setMatchPsw(false):setMatchPsw(true)
    }, [confirmPassword]);

    return(
        <>
            <div className="m-4">
                <div className="card  bg-white c-shadow ">
                    <div className="card-body">
                        <p className="text-xl font-semibold">Profile</p>
                        <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-2 ml-auto mr-auto">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="avatar online placeholder">
                                        <div className="bg-neutral text-neutral-content rounded-full w-16">
                                            <span className="text-xl uppercase">{user?.name.slice(0,2)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-semibold">{user?.name}</p>
                                        <p className="text-xs opacity-80">{user?.phone}</p>
                                        <p className="text-xs opacity-80">{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className=" border-l pl-2">
                                <p className="font-semibold mb-2">Academic Details</p>
                                {
                                    user?.user_class.length!==0 && user?.board.length!==0 && user?.exam.length!==0 && user?.language.length!==0?
                                        <>
                                            <div className="flex w-fit gap-2 m-1 items-center">
                                                <p className="font-semibold text-sm">Class</p>
                                                {
                                                    user?.user_class.map((cl:any,k:any)=>(
                                                        <div key={k} className="badge badge-outline ">{cl.label}</div>
                                                    ))
                                                }
                                            </div>
                                            <div className="flex w-fit gap-2 m-1 items-center">
                                                <p className="font-semibold text-sm">Board</p>
                                                {
                                                    user?.board.map((cl:any,k:any)=>(
                                                        <div key={k} className="badge badge-outline ">{cl.label}</div>
                                                    ))
                                                }
                                            </div>
                                            <div className="flex w-fit gap-2 m-1 items-center">
                                                <p className="font-semibold text-sm">Exam</p>
                                                {
                                                    user?.exam.map((cl:any,k:any)=>(
                                                        <div key={k} className="badge badge-outline ">{cl.label}</div>
                                                    ))
                                                }
                                            </div>
                                            <div className="flex w-fit gap-2 m-1 items-center">
                                                <p className="font-semibold text-sm">Language</p>
                                                {
                                                    user?.language.map((cl:any,k:any)=>(
                                                        <div key={k} className="badge badge-outline ">{cl.label}</div>
                                                    ))
                                                }
                                            </div>
                                        </>:<p>Details not found</p>
                                }

                            </div>
                            <div className="border-l pl-2 gap-2">
                                <Link href="/account/orders" className="btn  btn-neutral btn-outline btn-wide btn-sm m-1"><FiBox className="text-md"/> My Orders</Link>
                                <Link href="/bag" className="btn  btn-neutral btn-outline btn-wide btn-sm m-1"><FaBagShopping className="text-md"/> My Bag</Link>
                                <button className="btn  btn-neutral btn-outline btn-wide btn-sm m-1" onClick={()=>(openModal(passRef))}><MdOutlinePassword className="text-md"/> Change Password</button>
                            </div>
                        </div>

                        <Address tab={0} setTab={0} selectedAddressId={"profile"} setSelectedAddressId={"profile"} setSelectedAddress={0}/>
                    </div>
                </div>
            </div>

            <Modal name={"Change password"} modalName={"chgModal"} refName={passRef} width={""} >
                <form onSubmit={handlePassword}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Current Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Current password"
                            className="input input-sm border-gray-300 rounded-r-xl w-full !outline-none transition delay-150 "
                            required
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">New Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="New password"
                            className="input input-sm border-gray-300 rounded-r-xl w-full !outline-none transition delay-150 "
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>


                    <div className="form-control">
                        <label className="label">
                            <span className="label-text ">Confirm New Password</span> {matchPsw?<span className="text-xs text-red-500">Password did not match</span>:null}
                        </label>
                        <input
                            type="text"
                            placeholder="Confirm new password"
                            className="input input-sm border-gray-300 rounded-r-xl w-full !outline-none transition delay-150 "
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-sm btn-neutral w-full mt-2">Change</button>
                </form>
            </Modal>
        </>
    )
}
export default Profile;
