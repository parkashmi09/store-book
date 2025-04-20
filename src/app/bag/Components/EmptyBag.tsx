"use client"
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
// import Lottie from "lottie-react";

import anim from "../../Assets/Animation - 1709991857102.json"
import Link from "next/link";
const EmptyBag = () => {

    return(
        <>
            <div className="hero h-96 bg-white">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <Lottie animationData={anim}  className="text-center w-1/2 ml-auto mr-auto" />
                        <p className="font-semibold">Your bag is empty.</p>
                        <p className="py-6">Lets fill some fantastic products .</p>
                        <Link href="/" className="btn  btn-neutral">Continue Shopping</Link>
                    </div>
                </div>
            </div>
        </>
    )
}
export default EmptyBag;
