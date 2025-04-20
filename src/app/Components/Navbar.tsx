"use client"
import {FaSearch, FaShoppingBag, FaStar, FaStore, FaUserCircle} from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import Marquee from "react-fast-marquee";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {AiOutlineSearch} from "react-icons/ai";
import {API_URL} from "@/util/base_url";
import {getToken} from "@/util/getToken";
import toast, {Toaster} from "react-hot-toast";
import {MdDelete, MdLogout} from "react-icons/md";
import {auth} from "@/util/auth";
import {FaUser} from "react-icons/fa6";
import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from "@/util/firease";
import useFcmToken from "@/util/useFcmToken";
import {RiMenu5Line} from "react-icons/ri";
import {CgMenuGridR} from "react-icons/cg";
import {calculateFinalPrice} from "@/util/calculateFinalPrice";
import Image from "next/image";
import img from "@/app/Assets/Logo/logo.png";
import { useHubspotForm } from 'next-hubspot';

const Navbar = () => {

    // const { loaded, error, formCreated } = useHubspotForm({
    //     portalId: 'XXXXXXX',
    //     formId: 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
    //     target: '#hubspot-form-wrapper'
    // });

    const { fcmToken,notificationPermissionStatus } = useFcmToken();
    // Use the token as needed
    fcmToken && console.log('FCM token:', fcmToken);


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            const messaging = getMessaging(firebaseApp);
            const unsubscribe = onMessage(messaging, (payload) => {
                console.log('Foreground push notification received:', payload);
                // Handle the received push notification while the app is in the foreground
                // You can display a notification or update the UI based on the payload
            });
            return () => {
                unsubscribe(); // Unsubscribe from the onMessage event
            };
        }
    }, []);

    const clearCookie = (name:any) => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    };


    const router=useRouter()
    const pathname=usePathname()
    const [marqueeText, setMarqueeText] = useState<any>();
    const [menuItems,setMenuItems]=useState<any>([])
    const [authStatus, setAuthStatus] = useState<any>();
    const [search, setSearch] = useState<any>();

    let user: any;

    if (typeof sessionStorage !== 'undefined') {
        user = sessionStorage.getItem('user');
        user = user ? JSON.parse(user) : null;
    } else {
        user = null;
    }

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setAuthStatus(token);
        }
    }, [authStatus]);

    const [bagCount, setBagCount] = useState<string | null>("0");

    useEffect(() => {
        window.dispatchEvent(new Event("storage"));
    }, );

    useEffect(() => {
        const handleSessionChange = () => {
            const newBagCount = sessionStorage.getItem('mybag');
            if(newBagCount){
                setBagCount(newBagCount);
            }else{
                const newBagCount = localStorage.getItem('mybag');
                setBagCount(newBagCount)
            }

        };

        window.addEventListener('storage', handleSessionChange);

        return () => {
            window.removeEventListener('storage', handleSessionChange);
        };
    }, [pathname]);

    const setCookie = (name:any, value:any, days:any) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    };

    const getCategoriesAndHighlight = async () => {

        try {
            const categoriesResponse = await fetch(`${API_URL}/categories`);
            const highlightResponse = await fetch(`${API_URL}/get-highlight/1`);
            const token:any=sessionStorage.getItem('token')

           if(user){
               const response = await fetch(`${API_URL}/get-bag/${user.id}`,
                   {headers: {
                           'x-access-token': token,
                       },
                   })
               const data = await response.json();

               if (response.status === 201) {
                   sessionStorage.setItem('mybag',data.data.length)
               }else if(!response){
               }
           }

            if (categoriesResponse.ok) {
                const categoriesData = await categoriesResponse.json();
                setMenuItems(categoriesData.data);
                // sessionStorage.setItem('token',categoriesData.token)
                // setCookie('token', categoriesData.token, 60);
            } else {
                throw new Error('Failed to fetch categories');
            }

            if (highlightResponse.ok) {
                const highlightData = await highlightResponse.json();
                if (highlightResponse.status === 201) {
                    if(highlightData.data.show){
                        setMarqueeText(highlightData.data.highlight);

                    }
                }
            } else {
                throw new Error('Failed to fetch highlight');
            }
        } catch (error) {

        }
    };

    useEffect(() => {
        getCategoriesAndHighlight();
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            // @ts-ignore
            const user = JSON.parse(sessionStorage.getItem('user'));
            let token = sessionStorage.getItem('token');
            // if(localStorage.getItem('guest')){
            //     token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjA5ODc2NTQzMjEiLCJpYXQiOjE3MTQzOTcyNjAsImV4cCI6MTcyMjI2ODY2MH0.LOISuXKVwYM6T14y9Ua3eR5D81RNKurJCypUY85GKRE"
            // }
            auth(token, user ? user.phone : null)
                .then(async (isAuthenticated) => {
                    if (isAuthenticated) {

                    } else {
                        const response = await fetch(`/api/user/logout`,)

                        const data = await response.json();
                        if (data.success) {
                            sessionStorage.clear()
                            // localStorage.clear()
                            clearCookie('token')
                            deleteCookies()

                        } else if (data.status == 404 || data.status == 404) {

                        } else {
                        }
                    }
                })
        };

        handleStorageChange();

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    function deleteCookies() {
        var allCookies = document.cookie.split(';');

        for (var i = 0; i < allCookies.length; i++)
            document.cookie = allCookies[i] + "=;expires="
                + new Date(0).toUTCString();


    }
    async function handleLogout() {
        setAuthStatus("")
        const response = await fetch(`/api/user/logout`,)

        const data = await response.json();
        if (data.success) {
            sessionStorage.clear()
            localStorage.clear()
            toast.success("Logout successfully")
            clearCookie('token')
            deleteCookies()
            router.push("/login")

            // setLoginState(false)

        } else if (data.status == 404 || data.status == 404) {
            toast.error('Failed');

        } else {

            toast.error('Failed');
        }

        // setLoginState(false)
    }


    const [result,setResult]=useState<any>([])
    const [loading,setLoading]=useState<any>()

    const handleSearch = async  (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        const search_data = {
           name:search
        };
        const headers:any = {
            'Content-Type': 'application/json',
        };

        const response = await fetch(`${API_URL}/search`, {
            method: 'POST',
            headers,
            body: JSON.stringify(search_data),
        });

        if (response.status===200) {
            const result = await response.json();
            setResult(result.data)
            setLoading(false)
        }
        else {
            setLoading(false)
            console.error('Error:', response.statusText);

        }
    };

    useEffect(() => {
        const handleUnload = () => {
            localStorage.clear();
        };

        window.addEventListener('unload', handleUnload);

        return () => {
            window.removeEventListener('unload', handleUnload);
        };
    }, []);



    return(
        <>
            <div id="hubspot-form-wrapper" />
            {
                pathname==" " || pathname=="/" && marqueeText ?
                    <Marquee
                        pauseOnHover={true}
                        className="bg-secondary !h-4 text-sm text-white p-3"
                    >
                        {marqueeText}
                    </Marquee>:null
            }

            <div className="navbar bg-base-100  shadow-sm rounded-none sticky top-0 z-30 text-base-content   bg-opacity-90 backdrop-blur transition-shadow  duration-100 ">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-gray-200 border w-screen-80">
                            {
                                menuItems.map((item:any,key:any)=>(
                                    <li key={key}>
                                        <details>
                                            <summary>{item.name}</summary>
                                            <ul>
                                                {
                                                    item.sub_category.map((sub:any,keySub:any)=>(
                                                        <Link href={`/product/category/${sub}`} className="border p-2 w-full m-1" key={keySub}>{sub}</Link>
                                                    ))
                                                }
                                            </ul>
                                        </details>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <Link href="/" className="btn btn-ghost uppercase text-md max-sm:text-sm max-sm:hidden p-0 max-sm:btn-sm ">
                        <Image className="animate drop-shadow-2xl " src={img} alt={"line"} height={20} width={40} />
                        Target Board Store</Link>
                    <Link href="/" className=" uppercase text-md max-sm:text-sm max-sm:block hidden p-0 ">
                       <span className="flex gap-1 items-center font-semibold">
                            <Image className="animate drop-shadow-2xl " src={img} alt={"line"} height={20} width={40} />
                        Store
                       </span>
                    </Link>
                </div>
                <div className="navbar-center  hidden lg:flex">
                    <ul className="menu menu-horizontal  px-1 gap-2">
                        {
                            menuItems.map((item:any,key:any)=>(
                                <li key={key}>
                                    <details>
                                        <summary>{item.name}</summary>
                                        <ul className="p-2 rounded-none bg-gray-200 mt-3 w-screen-80">
                                            {
                                                item.sub_category.map((sub:any,keySub:any)=>(
                                                    <Link href={`/product/category/${sub}`} className="border cursor-pointer flex items-center gap-1 p-2 text-black w-full m-1" key={keySub}> {sub}</Link>
                                                ))
                                            }
                                        </ul>
                                    </details>
                                </li>
                            ))
                        }
                    </ul>
                </div>

                <div className="navbar-end  gap-2">
                    <label htmlFor="searchBar" className="btn btn-ghost   shadow-xl btn-sm !cursor-pointer	">
                        <FaSearch />
                    </label>
                    {/*{*/}
                    {/*    authStatus && (*/}
                    {/*       */}
                    {/*    )*/}
                    {/*}*/}
                    <Link href="/bag" className="btn btn-sm  btn-outline cursor-pointer shadow-xl">
                        <FaShoppingBag />
                        {bagCount !== "0" && bagCount}
                    </Link>
                    {/*{!authStatus?null:<Link href="/account" className="btn btn-sm max-sm:btn-xs btn-outline !cursor-pointer shadow-xl"><FaUser/></Link>}*/}
                    {!authStatus?<Link href="/login" className="btn btn-sm btn-neutral shadow-xl  !cursor-pointer">Login</Link>:

                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn text-xl btn-sm  btn-outline border !cursor-pointer shadow-xl"><FaUserCircle/></div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <Link href="/account" className="justify-between">
                                    Account
                                </Link>
                            </li>
                            <li onClick={handleLogout}><a>Logout</a></li>
                        </ul>
                    </div>   }
                </div>
            </div>


            {/* Search Box */}
            <input type="checkbox" id="searchBar" className="modal-toggle" />
            <div className="modal" role="dialog">
                <div className="modal-box p-1">
                    <form onSubmit={handleSearch} className="flex">
                        <input value={search} onChange={(e)=>(setSearch(e.target.value))} required={true} type="text" placeholder="Type here" className="input !outline-none border-none w-full " />
                        <button type="submit" className="btn btn-ghost"><FaSearch /></button>
                    </form>

                    {
                        loading?<div className="flex items-center">
                                <span className="loading ml-auto mr-auto loading-dots loading-md"></span>
                            </div>:
                            <>
                            {
                                result?.map((item:any,key:any)=>(
                                    <Link href={`/product/${item.slug}`} key={key} className="grid grid-cols-3 border m-4 shadow-md rounded-xl items-center gap-8">
                                        <div >
                                            <img src={item?.images[0]} className="transition h-20 ml-auto mr-auto ease-in-out delay-150 hover:scale-110"  alt="bag item"/>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="font-semibold">{item.name}</p>
                                            <div className="flex items-center mt-1 gap-2">
                                                <div>
                                                    <p><span className=" font-semibold">&#8377; {calculateFinalPrice(item.price, item.discount).toFixed(0)}</span> <span className="text-gray-500 text-sm opacity-80 line-through">&#8377; {item.price}</span> <span className="text-green-500 text-xs">({item.discount}% OFF)</span></p>
                                                </div>
                                                {/*<div className="justify-self-end text-white badge badge-success gap-2">*/}
                                                {/*    <FaStar /> 4.2 /!*{item.ratings}*!/*/}
                                                {/*</div>*/}
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            }
                            </>
                    }
                </div>
                <label className="modal-backdrop" htmlFor="searchBar"></label>
            </div>

            <Toaster/>
        </>
    )
}
export default Navbar;
