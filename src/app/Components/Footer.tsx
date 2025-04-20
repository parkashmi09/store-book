import Link from "next/link";
import img from "@/app/Assets/Logo/logo.png";
import Image from "next/image";
import React from "react";
const Footer = () => {

    return(
        <>
            <footer className="footer p-10 mt-4 bg-gray-200 !z-[-10] text-base-content">
                <aside className="flex gap-1 items-center uppercase font-semibold text-lg">
                    <Image className="animate drop-shadow-2xl " src={img} alt={"line"} height={20} width={40} />
                    <p>Target Board Store</p>
                </aside>
                <nav>
                    <h6 className="footer-title">Company</h6>
                    <Link href="/about" className="link link-hover">About us</Link>
                    <Link href="contact" className="link link-hover">Contact</Link>
                </nav>
                <nav>
                    <h6 className="footer-title">Legal</h6>
                    <Link href="/terms-and-condition" className="link link-hover">Terms & Conditions</Link>
                    <Link href="/privacy-policy" className="link link-hover">Privacy policy</Link>
                    <Link href="/shipping-policy" className="link link-hover">Shipping policy</Link>
                    <Link href="/cancellation-policy" className="link link-hover">Cancellation/Refund policy</Link>
                </nav>
            </footer>
        </>
    )

}
export default Footer;
