import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Target Board Store",
  description:
    "Shop Now on Target Board Store, Get best discounts on books and stationary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id={"googleScript1"}
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=G-516DGJ8HHP`}
        />

        <Script id={"googleScript2"} strategy="lazyOnload">
          {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-NTZY1LKEN1', {
                    page_path: window.location.pathname,
                    });
                `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
      {/*<body className={inter.className}>*/}
      {/*<div className="hero min-h-screen bg-base-200">*/}
      {/*    <div className="hero-content text-center">*/}
      {/*        <div className="max-w-md">*/}
      {/*            <h1 className="text-2xl font-bold">We will back soon!.</h1>*/}
      {/*            <p className="py-6 text-xl text-blue-600">Under Maintenance</p>*/}
      {/*        </div>*/}
      {/*    </div>*/}
      {/*</div>*/}
      {/*</body>*/}
      {/* <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
       */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
      <Script
        type="text/javascript"
        id="hs-script-loader"
        async
        defer
        src="//js-na1.hs-scripts.com/46101493.js"
      ></Script>
    </html>
  );
}
