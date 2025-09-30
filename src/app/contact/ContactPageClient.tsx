"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/Components/Navbar";
import Footer from "@/app/Components/Footer";
import { 
    FiPhone, 
    FiMail, 
    FiMapPin, 
    FiClock, 
    FiMessageCircle,
    FiSend,
    FiUser,
    FiMic
} from "react-icons/fi";
import { 
    FaWhatsapp, 
    FaFacebook, 
    FaTwitter, 
    FaInstagram,
    FaTelegram 
} from "react-icons/fa";

const ContactPageClient = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
        // Reset form
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
    };

    const contactInfo = [
        {
            icon: <FiPhone className="text-2xl" />,
            title: "Phone",
            content: "+919798190774",
            description: "Mon-Fri from 8am to 5pm",
            color: "bg-green-100 text-green-600",
            link: "tel:+919798190774"
        },
        {
            icon: <FiMail className="text-2xl" />,
            title: "Email",
            content: "contact@targetboardstore.com",
            description: "Send us your query anytime!",
            color: "bg-blue-100 text-blue-600",
            link: "mailto:contact@targetboardstore.com"
        },
        {
            icon: <FiMapPin className="text-2xl" />,
            title: "Office",
            content: "Aadarsh colony, Road no 4",
            description: "Khemnichak, Patna, Bihar, 800027",
            color: "bg-purple-100 text-purple-600",
            link: "https://maps.google.com/?q=Aadarsh+colony+Road+no+4+khemnichak+Patna+Bihar+800027"
        },
        {
            icon: <FiClock className="text-2xl" />,
            title: "Working Hours",
            content: "Mon - Fri: 9AM - 6PM",
            description: "Sat: 10AM - 4PM",
            color: "bg-orange-100 text-orange-600",
            link: "#"
        }
    ];

    const socialLinks = [
        { icon: <FaWhatsapp />, color: "text-green-500 hover:text-green-600", link: "https://wa.me/919798190774" },
        { icon: <FaTelegram />, color: "text-blue-500 hover:text-blue-600", link: "#" },
        { icon: <FaFacebook />, color: "text-blue-700 hover:text-blue-800", link: "#" },
        { icon: <FaInstagram />, color: "text-pink-500 hover:text-pink-600", link: "#" },
        { icon: <FaTwitter />, color: "text-blue-400 hover:text-blue-500", link: "#" }
    ];

    return(
        <>
            <Navbar/>
            
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-16 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-black opacity-10"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
                    <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-400 opacity-20 rounded-full animate-bounce"></div>
                    <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-400 opacity-15 rounded-full animate-ping"></div>
                </div>
                
                <div className={`relative z-10 max-w-4xl mx-auto text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="mb-6">
                        <FiMessageCircle className="text-6xl mx-auto mb-4 animate-bounce" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                        Contact Us
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-blue-100">
                        Have a question or need assistance? Our friendly and knowledgeable team is here to help!
                    </p>
                    <div className="flex justify-center space-x-4">
                        {socialLinks.map((social, index) => (
                            <a
                                key={index}
                                href={social.link}
                                className={`text-2xl ${social.color} transform hover:scale-110 transition-all duration-300`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Cards Section */}
            <div className="py-16 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Get In Touch
                        </h2>
                        <p className="text-lg text-gray-600">
                            Choose your preferred way to reach us
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => (
                            <div
                                key={index}
                                className={`bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 p-6 border-l-4 border-blue-500 ${isVisible ? 'animate-fade-in-up' : ''}`}
                                style={{animationDelay: `${index * 100}ms`}}
                            >
                                <div className={`w-16 h-16 rounded-full ${info.color} flex items-center justify-center mb-4 mx-auto`}>
                                    {info.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                                    {info.title}
                                </h3>
                                <a 
                                    href={info.link}
                                    className="text-blue-600 hover:text-blue-800 font-medium text-center block mb-2 transition-colors duration-300"
                                    target={info.link.startsWith('http') ? '_blank' : '_self'}
                                    rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                                >
                                    {info.content}
                                </a>
                                <p className="text-gray-600 text-sm text-center">
                                    {info.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Form Section */}
            <div className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            Send Us a Message
                        </h2>
                        <p className="text-lg text-gray-600">
                            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-xl p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Your Name"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Your Email"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="relative">
                                <FiMic className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="Subject"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                    required
                                />
                            </div>
                            
                            <div className="relative">
                                <FiMessageCircle className="absolute left-3 top-3 text-gray-400" />
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Your Message"
                                    rows={6}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                                    required
                                ></textarea>
                            </div>
                            
                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto space-x-2"
                                >
                                    <FiSend className="text-lg" />
                                    <span className="font-semibold">Send Message</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Support Message Section */}
            <div className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-4">
                            <FiMessageCircle className="text-3xl" />
                        </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        We're Here to Help!
                    </h2>
                    <p className="text-xl mb-8 text-indigo-100">
                        We value your feedback and strive to provide prompt and helpful support to all our customers. 
                        Don't hesitate to get in touch with us – we are here to assist you every step of the way.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="tel:+919798190774"
                            className="bg-white text-indigo-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center space-x-2"
                        >
                            <FiPhone />
                            <span>Call Now</span>
                        </a>
                        <a
                            href="https://wa.me/919798190774"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center space-x-2"
                        >
                            <FaWhatsapp />
                            <span>WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>

            <Footer/>
            
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }
            `}</style>
        </>
    )
}

export default ContactPageClient;
