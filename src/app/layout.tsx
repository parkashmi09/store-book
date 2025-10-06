// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import Script from "next/script";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Target Board Store",
//   description:
//     "Shop Now on Target Board Store, Get best discounts on books and stationary",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <head>
//         <Script
//           id={"googleScript1"}
//           strategy="lazyOnload"
//           src={`https://www.googletagmanager.com/gtag/js?id=G-516DGJ8HHP`}
//         />

//         <Script id={"googleScript2"} strategy="lazyOnload">
//           {`
//                     window.dataLayer = window.dataLayer || [];
//                     function gtag(){dataLayer.push(arguments);}
//                     gtag('js', new Date());
//                     gtag('config', 'G-NTZY1LKEN1', {
//                     page_path: window.location.pathname,
//                     });
//                 `}
//         </Script>
//       </head>
//       <body className={inter.className}>{children}</body>
//       {/*<body className={inter.className}>*/}
//       {/*<div className="hero min-h-screen bg-base-200">*/}
//       {/*    <div className="hero-content text-center">*/}
//       {/*        <div className="max-w-md">*/}
//       {/*            <h1 className="text-2xl font-bold">We will back soon!.</h1>*/}
//       {/*            <p className="py-6 text-xl text-blue-600">Under Maintenance</p>*/}
//       {/*        </div>*/}
//       {/*    </div>*/}
//       {/*</div>*/}
//       {/*</body>*/}
//       {/* <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
//        */}
//       {/* <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script> */}
//       <Script
//         src="https://checkout.razorpay.com/v1/checkout.js"
//         strategy="beforeInteractive"
//       />
//       <Script
//         type="text/javascript"
//         id="hs-script-loader"
//         async
//         defer
//         src="//js-na1.hs-scripts.com/46101493.js"
//       ></Script>
//     </html>
//   );
// }
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Target Board Store",
  description:
    "Shop Now on Target Board Store, Get best discounts on books and stationery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-516DGJ8HHP"
        />
        <Script id="google-analytics-config" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-516DGJ8HHP', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {children}

        {/* Cashfree - Hosted/SDK script (sandbox/production compatible) */}
        <Script
          id="cashfree-sdk"
          src="https://sdk.cashfree.com/js/v3/cashfree.js"
          strategy="beforeInteractive"
        />

        {/* Hotjar */}
        <Script
          id="hotjar-analytics"
          strategy="lazyOnload"
          src="//js-na1.hs-scripts.com/46101493.js"
        />

        {/* Zoho SalesIQ */}
        <Script id="zoho-init" strategy="lazyOnload">
          {`
            window.$zoho = window.$zoho || {};
            $zoho.salesiq = $zoho.salesiq || { ready: function() {} };
          `}
        </Script>
        <Script
          id="zoho-widget"
          strategy="lazyOnload"
          src="https://salesiq.zohopublic.in/widget?wc=siq938277fc08b42ecbbb8bd8c59accc9f4608c941b1bff1d9cd4ef9dc6db5c45f7"
          defer
        />
      </body>
    </html>
  );
}
