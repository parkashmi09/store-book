import { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
    title: "Contact us | Service & Education",
    description: "Get in touch with Service & Education. Contact us via phone, email, or visit our office. We're here to help with all your educational needs.",
};

const Page = () => {
    return <ContactPageClient />;
};

export default Page;