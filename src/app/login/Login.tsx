"use client"
import Image from "next/image";
import img from "@/app/Assets/Logo/logo.png";
import Link from "next/link";
import React, {useState} from "react";
// import baseUrl from "@/helper/baseUrl";
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
// @ts-ignore
import CryptoJS from 'crypto-js';
import {AiOutlineArrowRight} from "react-icons/ai";
import {API_URL} from "@/util/base_url";
// import secretKey from "@/helper/secretKey";

// @ts-ignore
import AOS from 'aos';
import 'aos/dist/aos.css';
import {useEffect} from "react";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import {auth} from "@/util/auth";
import {closeModal} from "@/util/modalFunctions";

const animatedComponents = makeAnimated();

const Login = () => {

    useEffect(() => {
        AOS.init({
            duration: 600,
            once: false,
        })
    }, [])

    const [tab, setTab] = useState<any>(1);
    const [otplogin, setOtplogin] = useState<any>();
    const [forgotpsw, setForgotpsw] = useState<any>();
    const [otp, setOtp] = useState<any>();
    const [phoneNumber, setPhoneNumber] = useState<any>("");
    const [email, setEmail] = useState<any>("");
    const [password, setPassword] = useState<any>("");
    const [confirmPassword, setConfirmPassword] = useState<any>("");
    const [name, setName] = useState<any>("");
    const [language, setlanguage] = useState<any>([]);
    const [user_class, setUser_class] = useState<any>([]);
    const [exam, setExam] = useState<any>([]);
    const [board, setBoard] = useState<any>([]);
    const [matchPsw, setMatchPsw] = useState<Boolean>();
    const [countdown, setCountdown] = useState(60);
    const [disabled, setDisabled] = useState(false);

    const [login,setLogin]=useState<Boolean>()
    const [createAcc,setCreateAcc]=useState<Boolean>()

    const optionsArray = [
        {
            category: "Language",
            options: [ "English",  "Hindi"]
        },
        {
            category: "Class",
            options: ["6", "7", "8", "9", "10", "11", "12", "12+", "BLOOM_K_8", "EUNEXT", "SPARK_CURRICULUM", "DIGITAL_SIP", "Under Graduation", "Graduation", "Post Graduation", "PhD"]
        },
        {
            category: "Exams",
            options: ["AE/JE", "BFSI", "BOARD_EXAM", "BPSC", "BPSC + BPPSC", "BPSC + UPSC", "BPSC_OFFLINE", "Banking", "Bihar Exams", "CA", "COMMERCE", "CS", "CSIR NET", "CUET UG", "ENGLISH_WALLAH", "ESE + GATE", "FOUNDATION", "GATE", "Humanities", "IELTS", "IGCSE-CIE", "IGCSE-Edexcel", "IIT JAM", "IIT JAM & CSIR NET", "IIT-JEE", "IPMAT", "JAIIB AND CAIIB", "Judiciary", "KVPY", "LAW", "MBA", "MPPSC", "MPSC", "NDA", "NEET", "NSAT", "NTSE", "Nursing Exams", "OLYMPIAD", "PRE_FOUNDATION", "PW_ONLY_IAS", "Railway", "SCHOOL_CURRICULUM", "SCHOOL_PREPARATION", "SSC", "TET", "UGC NET", "UP Exams", "UPPSC", "UPPSC + UPSC", "UPPSC_OFFLINE", "UPSC", "Unigo", "WBPSC", "skills"]
        },
        {
            category: "Board",
            options: ["CBSE", "ICSCE", "STATE BOARD"]
        }
    ];

    const [isLoading,setIsLoading]=useState<any>(false)

    const clearAll=()=>{
        setName("")
        setEmail("")
        setExam([])
        setlanguage([])
        setUser_class([])
        setBoard([])
        setPassword("")
        setConfirmPassword("")
        setPhoneNumber("")
        setTab(1)
        setLogin(false)
        setCreateAcc(false)
    }

    const router = useRouter()
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const response = await fetch(`/api/user/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    phone:phoneNumber,
                    password,
                }),
            })
        if(response.ok){
            const data = await response.json();
            if(data.status===200 || data.success) {
                // const encryptedUserData = CryptoJS.AES.encrypt(JSON.stringify(data.data), "secretKey").toString();
                sessionStorage.setItem('token',data.token)
                sessionStorage.setItem('user', JSON.stringify(data.data));
                // Persist additionally in localStorage for reliability
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.data))

                // auth(data.token,data.data.phone)
                let guest=localStorage.getItem('guest')

                if(guest){
                    guest=JSON.parse(guest)
                    await addGuestBag(data.data.id, guest, data.token)
                }else{
                    router.push('/', { scroll: true })
                    toast.success("Login Success!")
                }

            }
            else if(data.status==404 || data.status==404){
                setIsLoading(false)
                toast.error('Login Failed');
            }
            else if (data.message == "password") {
                setIsLoading(false)
                toast.error("Password does not matched.");
            }
            else if (data.message == "block") {
                setIsLoading(false)
                toast.error("Account is blocked.");
            }
            else{
                setIsLoading(false)
                toast.error('Login Failed');
            }
        }
        else {
            setIsLoading(false)
            toast.error('Login Failed');
        }
    };
    const createAccount = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const response = await fetch(`${API_URL}/create`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone:phoneNumber,
                    password,
                    name,
                    email,
                    language,
                    user_class,
                    exam,
                    board,

                }),
            })
        // const data = await response.json();
        if(response.ok && response.status==201){
            setIsLoading(false)
            toast.success('Account created, Please login to continue');
            clearAll()
        }
        else {
            setIsLoading(false)
            toast.error('Please try again!');
            clearAll()
        }
    };
    const handleUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const response = await fetch(`${API_URL}/user`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone:phoneNumber
                    // password,
                }),
            })
        if(response.ok && response.status==200){
                setCreateAcc(true)
                setIsLoading(false)
        }
        else {
            setLogin(true)
            setIsLoading(false)
        }
    };
    const setCookie = (name:any, value:any, days:any) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    };
    const verifyPhone = async (e: React.FormEvent) => {
        e.preventDefault()
        const response = await fetch(`${API_URL}/verify-otp`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone:phoneNumber,
                    otp:otp,
                    flag:forgotpsw==1
                }),
            })
        const data=await response.json()
        if(response.ok && (response.status===200 || response.status===201)){
            if(forgotpsw==1){
                setForgotpsw(2)
            }else{
                console.log(data.token,"data is like")
                setCookie('token', data.token, 60);
                sessionStorage.setItem('token',data.token)
                sessionStorage.setItem('user', JSON.stringify(data.data));
                // Persist additionally in localStorage for reliability
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data.data))
                toast.success("OTP verified successfully")

                let guest=localStorage.getItem('guest')
                if(guest){
                    guest=JSON.parse(guest)
                    await addGuestBag(data.data.id, guest, data.token)
                }else{
                    router.push('/', { scroll: true })
                }


            }
        }
        else if (data.message == "block") {
            toast.error("Account is blocked.");
        } else{
            toast(data.message)
        }
    };


    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCount) => prevCount - 1);
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [countdown]);

    const handleResendOTP = () => {

        setCountdown(60);
        setDisabled(true);


            sendOtp()

        setTimeout(() => {
            setDisabled(false);
        }, 60000); // Enable the button after 1 minute
    };

    const sendOtp = async () => {
        const response = await fetch(`${API_URL}/send-otp`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone:phoneNumber
                }),
            })
        if(response.ok){
            toast.success("OTP sent successfully")
        }
        else {
            toast.error("OTP sent failed!")
        }
    };

    const handlePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        const response = await fetch(`${API_URL}/reset-password`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone:phoneNumber,
                    newPassword:password,
                }),
            })
        const data = await response.json();
        if(response.status===201) {
            toast.success('Password changed success');
            setLogin(true)
            setForgotpsw(null)
        }
        else{
            toast.error('Failed');
        }
    };

    useEffect(() => {
        password==confirmPassword?setMatchPsw(false):setMatchPsw(true)
    }, [confirmPassword]);


    async function addGuestBag(userId:any, guestItems:any,token:any) {
        try {
            const response = await fetch(`${API_URL}/guest-bag`, {
                method: 'POST',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,
                    guest: guestItems
                })
            });
            if(response.status==201){
                // toast.success('Login success');
                router.push('/bag', { scroll: true })
            }
            // Only remove guest data, keep auth info intact
            localStorage.removeItem('guest')
        } catch (error) {
            // @ts-ignore
            console.error('Error adding guest bag:', error.message);
            throw error;
        }
    }

    // @ts-ignore
    return(
        <>

            <div className="grid h-screen grid-cols-1  bg-gray-100  items-center">
                <div className="ml-auto mr-auto ">
                    <div className="card  ransition-all duration-300 h-auto ease-in-out delay-15 rounded-xl m-4 bg-white  shadow">
                        <div className="card-body ">
                            {
                                createAcc? <>
                                    <div className="flex items-center">
                                        <Image className="ml-auto mr-auto  animate drop-shadow-2xl " src={img} alt={"line"} height={20} width={40} />
                                        {
                                            tab==1? <p className="text-2xl font-semibold ">Create Account</p>: <p className="text-2xl font-semibold ">Almost done</p>
                                        }
                                    </div>
                                        <p className=" opacity-50 ">Please enter all necessary details to Register</p>
                                    </>
                                    :
                                    <>
                                        <div>
                                            <Image className="ml-auto mr-auto  animate drop-shadow-2xl " src={img} alt={"line"} height={80} width={140} />
                                        </div>
                                        <p className="text-2xl font-semibold  text-center">Welcome To Targetboard</p>
                                        <p className=" opacity-50 ">{forgotpsw?"Please enter your new password and change":" Please enter your mobile number to Login/Register"}</p>
                                    </>
                            }

                            <div className="form-control">
                                <label className="label">
                                            <span className="label-text ">Phone Number
                                            </span>
                                </label>
                                <div className={"flex items-center"}>
                                    <label className={"btn btn-outline bg-white c-shadow border-gray-300 hover:bg-transparent hover:border-gray-300 hover:text-black rounded-l-xl"}>+91</label>
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        // disabled={!login || !createAcc}
                                        className="input border-gray-300 rounded-r-xl w-full !outline-none transition delay-150 c-shadow"
                                        required
                                        value={phoneNumber}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            if (/^\d*$/.test(input) && input.length <= 10) {
                                                setPhoneNumber(input);
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                                {
                                    createAcc?
                                        (
                                            tab==1?
                                                <div>
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text ">Name</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Name"
                                                            className="input border-gray-300 rounded-xl !outline-none transition delay-150 c-shadow"
                                                            required
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text ">Email</span>
                                                        </label>
                                                        <input
                                                            type="email"
                                                            placeholder="Email"
                                                            className="input border-gray-300 rounded-xl !outline-none transition delay-150 c-shadow"
                                                            required
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text ">Password</span>
                                                        </label>
                                                        <input
                                                            type="password"
                                                            placeholder="Password"
                                                            className="input border-gray-300 rounded-xl !outline-none transition delay-150 c-shadow"
                                                            required
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text ">Confirm Password</span> {matchPsw?<span className="text-xs text-red-500">Password did not match</span>:null}
                                                        </label>
                                                        <input
                                                            type="password"
                                                            placeholder="Confrm Password"
                                                            className={`input border-gray-300 rounded-xl !outline-none transition delay-150 c-shadow ${matchPsw?"focus:border-red-300":!matchPsw?"focus:border-green-300":null}`}
                                                            required
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                        />
                                                    </div>
                                                </div>:
                                                <>
                                                    <div>
                                                        <label className="label">
                                                            <span className="label-text ">Language <span className="text-xs opacity-40">(Optional)</span></span>
                                                        </label>
                                                        <Select
                                                            className="w-full !border-gray-300 !rounded-xl !outline-none transition delay-150 c-shadow"
                                                            options={optionsArray[0].options.map(item => ({ value: item,label:item }))}
                                                            value={language}
                                                            onChange={(selectedOptions) => setlanguage(selectedOptions)}
                                                            isMulti
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="label">
                                                            <span className="label-text ">Class <span className="text-xs opacity-40">(Optional)</span></span>
                                                        </label>
                                                        <Select
                                                            className="w-full !border-gray-300 !rounded-xl !outline-none transition delay-150 c-shadow"
                                                            options={optionsArray[1].options.map(item => ({ value: item,label:item }))}
                                                            value={user_class}
                                                            onChange={(selectedOptions) => setUser_class(selectedOptions)}
                                                            isMulti
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="label">
                                                            <span className="label-text ">Exams <span className="text-xs opacity-40">(Optional)</span></span>
                                                        </label>
                                                        <Select
                                                            className="basic-multi-select w-full !border-gray-300 !rounded-xl !outline-none transition delay-150 c-shadow"
                                                            options={optionsArray[2].options.map(item => ({ value: item,label:item }))}
                                                            value={exam}
                                                            onChange={(selectedOptions) => setExam(selectedOptions)}
                                                            isMulti
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="label">
                                                            <span className="label-text ">Board <span className="text-xs opacity-40">(Optional)</span> </span>
                                                        </label>
                                                        <Select
                                                            className="basic-multi-select w-full border-gray-300 !rounded-xl !outline-none transition delay-150 c-shadow"
                                                            options={optionsArray[3].options.map(item => ({ value: item,label:item }))}
                                                            value={board}
                                                            onChange={(selectedOptions) => setBoard(selectedOptions)}
                                                            isMulti
                                                        />
                                                    </div>
                                                </>
                                        )
                                        :null
                                }

                                {
                                    login?
                                        <>
                                        {
                                            forgotpsw==1?
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text ">6 Digit OTP
                                                        </span>
                                                        <button onClick={handleResendOTP} className="label-text text-blue-500 font-bold" disabled={disabled}>
                                                            Resend OTP {countdown > 0 && `(${countdown}s)`}
                                                        </button>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        placeholder="6 Digit OTP"
                                                        className="input border-gray-300 rounded-xl !outline-none transition delay-150 c-shadow"
                                                        required
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                    />
                                                </div>:forgotpsw==2?
                                                <>
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text ">New Password</span>
                                                        </label>
                                                        <input
                                                            type="password"
                                                            placeholder="Password"
                                                            className="input border-gray-300 rounded-xl !outline-none transition delay-150 c-shadow"
                                                            required
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="form-control">
                                                        <label className="label">
                                                            <span className="label-text ">Confirm New Password</span>
                                                        </label>
                                                        <input
                                                            type="password"
                                                            placeholder="Confirm Password"
                                                            className={`input border-gray-300 rounded-xl !outline-none transition delay-150 c-shadow ${matchPsw?"focus:border-red-300":!matchPsw?"focus:border-green-300":null}`}
                                                            required
                                                            value={confirmPassword}
                                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                                        />
                                                    </div>
                                                </>:
                                            otplogin?
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text ">6 Digit OTP
                                                        </span>
                                                        <button onClick={handleResendOTP} className="label-text text-blue-500 font-bold" disabled={disabled}>
                                                            Resend OTP {countdown > 0 && `(${countdown}s)`}
                                                        </button>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        placeholder="6 Digit OTP"
                                                        className="input border-gray-300 rounded-xl !outline-none transition delay-150 c-shadow"
                                                        required
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                    />
                                                </div>:
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text ">Password</span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        placeholder="Password"
                                                        className="input border-gray-300 rounded-xl !outline-none transition delay-150 c-shadow"
                                                        required
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                    />
                                                </div>
                                        }
                                        {
                                            !forgotpsw?
                                                <div className="grid grid-cols-2 mt-2">
                                                    <div>
                                                        <div className="form-control">
                                                            <label className="cursor-pointer flex gap-2 items-center">
                                                                {
                                                                    !otplogin?
                                                                        <button onClick={()=>(setOtplogin(true),sendOtp())} className="label-text text-blue-500 font-bold">Login with OTP</button>
                                                                        :
                                                                        <button onClick={()=>(setOtplogin(false))} className="label-text text-blue-500 font-bold">Login with Password</button>

                                                                }
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div className="justify-self-end">
                                                        <button onClick={()=>(setForgotpsw(1),sendOtp())} className="label-text-alt font-bold text-blue-500">
                                                            Forgot Password?
                                                        </button>
                                                    </div>
                                                </div>:null
                                        }
                                        </>:null
                                }

                                <div>
                                    <div className="form-control mt-2">
                                        {
                                            !isLoading?
                                                (
                                                    createAcc?
                                                        (
                                                            tab==1?
                                                                // @ts-ignore
                                                                <button onClick={()=>setTab(2)} disabled={phoneNumber.length < 10 || !name || !email || !password || !confirmPassword || matchPsw} className="btn bg-gradient-to-r disabled:opacity-70 disabled:text-white disabled:!cursor-not-allowed from-slate-500 to-slate-800 border-none rounded-xl text-white c-shadow ">
                                                                    Continue
                                                                </button>:
                                                                <button onClick={createAccount} className="btn bg-gradient-to-r from-slate-500 to-slate-800 border-none rounded-xl text-white c-shadow ">
                                                                    Create
                                                                </button>
                                                        )
                                                        :(
                                                            otplogin || forgotpsw==1?<button onClick={verifyPhone} className="btn bg-gradient-to-r from-slate-500 to-slate-800 border-none rounded-xl text-white c-shadow ">
                                                                    Verify OTP
                                                                </button>: forgotpsw==2?
                                                                    // @ts-ignore
                                                                    <button onClick={handlePassword} disabled={matchPsw} className="btn bg-gradient-to-r from-slate-500 to-slate-800 border-none rounded-xl text-white c-shadow ">
                                                                       Change password
                                                                    </button>:
                                                                login?<button onClick={handleSignIn} className="btn bg-gradient-to-r from-slate-500 to-slate-800 border-none rounded-xl text-white c-shadow ">
                                                                    Login
                                                                </button>:<button onClick={handleUser} disabled={phoneNumber.length < 10} className="btn bg-gradient-to-r disabled:opacity-70 disabled:text-white disabled:!cursor-not-allowed from-slate-500 to-slate-800 border-none rounded-xl text-white c-shadow ">
                                                                    Continue
                                                                </button>
                                                        )
                                                )

                                                :<button className="btn bg-gradient-to-r from-slate-500 to-slate-800 border-none rounded-xl text-white c-shadow capitalize">
                                                    <span className="loading loading-spinner"></span>
                                                    Please wait...
                                                </button>
                                        }
                                    </div>
                                </div>

                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </>
    )
}
export default Login;
