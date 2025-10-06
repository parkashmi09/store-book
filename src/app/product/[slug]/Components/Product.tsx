"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
// Removed react-image-magnifiers due to compatibility issues
// Removed react-fullscreen-image - using modal instead
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "react-headless-accordion";

import {
  TelegramShareButton,
  TelegramIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
} from "next-share";

import {
  FaArrowRight,
  FaLocationDot,
  FaRegCopy,
  FaShare,
} from "react-icons/fa6";
import { LuDot } from "react-icons/lu";
import Image from "next/image";
import { calculateFinalPrice } from "@/util/calculateFinalPrice";
import { IoBagHandleOutline } from "react-icons/io5";
import { API_URL } from "@/util/base_url";
import { closeModal } from "@/util/modalFunctions";
import toast from "react-hot-toast";
import Link from "next/link";
import { AiOutlineHome } from "react-icons/ai";
import { calculateReviewStats } from "@/util/calculateReviewStats";
import { FaStar } from "react-icons/fa";
import { convertUTCToIST } from "@/util/convertDate";
import Recommendation from "@/app/Components/Recommendation";
import Releted from "@/app/Components/Releted";
import Loading from "@/app/Components/Loading";
import {
  IoIosArrowDropdownCircle,
  IoIosArrowDropupCircle,
} from "react-icons/io";
import Select from "react-select";
const Product = () => {
  const param = useParams();
  const router = useRouter();
  const [imgIndex, setImgIndex] = useState<any>(0);

  const [isLoading, setIsLoading] = useState<any>();
  let user: any = sessionStorage.getItem("user") || null;
  user = JSON.parse(user);
  // Removed magnifier components - using react-fullscreen-image instead

  const [productId, setProductId] = useState<any>();
  const [bookTab, setBookTab] = useState<any>(0);
  const [reviews, setReviews] = useState<any>([]); 
  const [pinCode, setPinCode] = useState<any>();
  const [quantity, setQuantity] = useState<any>(1);
  const [showImageModal, setShowImageModal] = useState<any>(false);
  const [checkBag, setCheckBag] = useState<any>(false);
  const [acc, setAcc] = useState<any>();
  const [size, setSize] = useState<any>();
  const [color, setColor] = useState<any>();
  const [showConfetti, setShowConfetti] = useState<any>(false);

  const [tab, setTab] = useState<number>(0);
  const faqs = [
    {
      question: "Shipping Policy",
      answer:
        'To check the status of your order, refer "My Orders" section. For detailed information please check Shipping Policy',
    },
    {
      question: "Cancellation Policy",
      answer:
        'To cancel the order go to "My orders" section. For detailed information please check Cancellation Policy',
    },
    {
      question: "Return and Refund Policy",
      answer:
        'To cancel the order go to "My orders" section. For detailed information please check Refund Policy',
    },
  ];

  const [product, setProduct] = useState<any>([]);

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
    controlBag(product.productId, quantity + 1, color, size);
  };
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
    controlBag(product.productId, quantity - 1, color, size);
  };

  // /slug/
  const getProduct = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_URL}/single-product/${decodeURIComponent(param.slug as string)}`
      );
      const data = await response.json();
      if (response.status === 201) {
        setProduct(data.data);
        setIsLoading(false);
        setReviews(data.reviews);
        checkBagStatus(data.data.productId);
      }
    } catch (error) {}
  };

  const addToBag = async (flag: any) => {
    if (user) {
      sessionStorage.setItem("settingtab", "1");
      const token: any = sessionStorage.getItem("token") || null;
      const response = await fetch(`${API_URL}/control-bag`, {
        method: "POST",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          productId: product.productId,
          quantity,
          color,
          size,
          price: calculateFinalPrice(product.price, product.discount).toFixed(
            0
          ),
        }),
      });
      if (response) {
        const data = await response.json();
        if (response.status === 201) {
          // @ts-ignore
          let it: any = sessionStorage.getItem("mybag") || null;
          it = parseInt(it) + 1;
          sessionStorage.setItem("mybag", it);
          // window.dispatchEvent(new Event("storage"));
          checkBagStatus(product.productId);
          
          // Trigger confetti animation after successful add to cart
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
        if (flag) {
          router.push("/bag");
        }
      }
    } else {
      const user: any = {
        userId: "guest",
        productId: product.productId,
        quantity,
        size,
        color,
        price: calculateFinalPrice(product.price, product.discount).toFixed(0),
      };

      let guest: any[] = JSON.parse(localStorage.getItem("guest") || "[]");

      const existingProductIndex = guest.findIndex(
        (item) => item?.productId === user?.productId
      );

      if (existingProductIndex !== -1) {
        guest[existingProductIndex].quantity = quantity;
        guest[existingProductIndex].size = size;
        guest[existingProductIndex].color = color;
        guest[existingProductIndex].price = calculateFinalPrice(
          product.price,
          product.discount
        ).toFixed(0);
      } else {
        guest.push(user);
      }

      localStorage.setItem("guest", JSON.stringify(guest));

      let total: number = parseInt(localStorage.getItem("mybag") || "0") + 1;
      localStorage.setItem("mybag", total.toString());

      // Trigger confetti animation after successful add to cart
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);

      if (flag) {
        router.push("/bag");
      }
      checkBagStatus(product.productId);
    }
  };

  const checkBagStatus = async (productId: any) => {
    const token: any = sessionStorage.getItem("token") || null;
    if (user) {
      const response = await fetch(`${API_URL}/check-bag`, {
        method: "POST",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          productId,
        }),
      });
      const data = await response.json();
      if (response) {
        if (response.status === 201 && data.type == "yes") {
          setCheckBag(true);
        }
      }
    } else {
      let guest: any[] = JSON.parse(localStorage.getItem("guest") || "[]");
      const existingProductIndex = guest.findIndex(
        (item: any) => item?.productId === productId
      );
      if (existingProductIndex !== -1 && localStorage.getItem("guest")) {
        setCheckBag(true);
      }
    }
  };

  useEffect(() => {
    getProduct();
  }, [param.slug]);

  const controlBag = async (
    id: any,
    quantity: number,
    color: any,
    size: any
  ) => {
    if (user) {
      const token: any = sessionStorage.getItem("token") || null;
      const response = await fetch(`${API_URL}/control-q`, {
        method: "POST",
        headers: {
          "x-access-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          productId: id,
          quantity,
          size,
          color,
        }),
      });
    } else {
      let guest: any[] = JSON.parse(localStorage.getItem("guest") || "[]");

      const existingProductIndex = guest.findIndex(
        (item) => item?.productId === id
      );
      debugger;
      if (guest.length === 0) {
      } else {
        if (existingProductIndex !== -1) {
          guest[existingProductIndex].quantity = quantity;
          guest[existingProductIndex].size = size;
          guest[existingProductIndex].color = color;
          // guest[existingProductIndex].price = calculateFinalPrice(product.price, product.discount).toFixed(0);
        } else {
          guest.push(user);
        }
        localStorage.setItem("guest", JSON.stringify(guest));
      }
    }
  };

  const [deliveryData, setDeliveryData] = useState<any>([]);
  const checkPincode = async (pincode: any) => {
    const token: any = sessionStorage.getItem("token") || null;
    const response = await fetch(`${API_URL}/check-service/${pincode}`, {
      headers: {
        "x-access-token": token,
      },
    });
    if (response.status === 201) {
      const data = await response.json();
      setDeliveryData(data.data);
    } else if (!response) {
    }
  };

  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };
  const shareUrl: any = window.location.href;

  // Handle keyboard events for image modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showImageModal) {
        if (event.key === 'Escape') {
          setShowImageModal(false);
        } else if (event.key === 'ArrowLeft' && product?.images && product.images.length > 1) {
          setImgIndex(imgIndex > 0 ? imgIndex - 1 : product.images.length - 1);
        } else if (event.key === 'ArrowRight' && product?.images && product.images.length > 1) {
          setImgIndex(imgIndex < product.images.length - 1 ? imgIndex + 1 : 0);
        }
      }
    };

    if (showImageModal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showImageModal, imgIndex, product?.images]);

  return (
    <>
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="confetti" 
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ['#667eea', '#764ba2', '#48bb78', '#ed8936', '#e53e3e'][Math.floor(Math.random() * 5)]
              }}
            />
          ))}
        </div>
      )}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="z-[-10]">
          <div className="!relative">
            <div className="flex gap-1 items-center">
              <div className="text-sm flex-1 breadcrumbs max-sm:grid gap-2 pl-20 pr-20 p-4 max-sm:p-4">
                <ul>
                  <li>
                    <Link href="/">
                      <AiOutlineHome />
                    </Link>
                  </li>
                  <li>
                    {product?.type == "book" ? (
                      <Link href="/product/all/books">Products</Link>
                    ) : (
                      <Link href="/product/all/stationery">Products</Link>
                    )}
                  </li>
                  <li>
                    <a>
                      <span className="ml-1 underline">{product?.name}</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="flex-none justify-self-end mr-10 max-sm:mr-0">
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-sm"
                  >
                    <FaShare /> Share
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] border menu p-2 shadow bg-base-100 rounded-box w-fit"
                  >
                    <li className="m-1">
                      <WhatsappShareButton
                        url={shareUrl}
                        // title={'next-share is a social share buttons for your next React apps.'}
                        separator=":: "
                      >
                        <WhatsappIcon size={24} round /> WhatsApp
                      </WhatsappShareButton>
                    </li>
                    <li className="m-1">
                      <TelegramShareButton url={shareUrl}>
                        <TelegramIcon size={24} round /> Telegram
                      </TelegramShareButton>
                    </li>
                    <li className="m-1">
                      <FacebookShareButton url={shareUrl}>
                        <FacebookIcon size={24} round /> WhatsApp
                      </FacebookShareButton>
                    </li>
                    <li className="m-1">
                      <TwitterShareButton url={shareUrl}>
                        <TwitterIcon size={24} round /> WhatsApp
                      </TwitterShareButton>
                    </li>
                    <li className="m-1">
                      <button
                        className="p-1 w-fit hover:bg-transparent"
                        onClick={copyToClipboard}
                      >
                        <FaRegCopy size={18} />{" "}
                        {copied ? "Copied!" : "Copy Link"}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex h-full max-sm:grid gap-2 pl-20 pr-20 p-4 max-sm:p-4 ">
              <div className=" max-sm:w-full  ">
                <div className="sticky top-20">
                  <div className="card m-auto  w-[30rem] max-sm:w-full  bg-base-400 c-shadow">
                    <figure className="rounded-xl c-aspect1 max-sm:w-auto block ">
                      {product?.images && product?.images[imgIndex] ? (
                        <img
                          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          src={product?.images[imgIndex]}
                          alt={product?.name || "Product image"}
                          onClick={() => setShowImageModal(true)}
                          title="Click to zoom"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">No image available</span>
                        </div>
                      )}
                    </figure>
                  </div>
                  <div
                    className="items-center flex m-4 gap-4 mt-[-50px] max-sm:mt-[-30px] overflow-x-auto"
                  >
                    {product?.images?.map((itm: any, key: any) => (
                      <div
                        key={key}
                        className="avatar"
                      >
                        <div
                          className={`w-24 max-sm:w-14 rounded ${
                            imgIndex === key ? "border-2 border-blue-700" : ""
                          }`}
                        >
                          <Zoom>
                            <img
                              src={itm}
                              className="c-shadow cursor-zoom-in"
                              onClick={() => setImgIndex(key)}
                            />
                          </Zoom>
                        </div>
                      </div>
                    ))}
                  </div>

                  {product?.stock == 0 ? null : (
                    <div
                      className="grid grid-cols-2 items-center gap-2 max-sm:hidden"
                    >
                      {!checkBag ? (
                        <button
                          className="btn btn-neutral border-blue-600 text-blue-600 btn-outline"
                          onClick={() => addToBag(false)}
                        >
                          <IoBagHandleOutline /> Add to Cart
                        </button>
                      ) : (
                        <button
                          className="btn  bg-gray-200 btn-outline"
                          onClick={() => router.push("/bag")}
                        >
                          <IoBagHandleOutline /> Go to Cart
                        </button>
                      )}
                      {!checkBag ? (
                        <button
                          className="btn bg-gradient-to-r from-indigo-500 to-blue-500 text-white  "
                          onClick={() => addToBag(true)}
                        >
                          <IoBagHandleOutline /> Buy Now
                        </button>
                      ) : (
                        <button
                          className="btn bg-gradient-to-r w-full !z-60 from-indigo-500 to-blue-500 text-white "
                          onClick={() => router.push("/bag")}
                        >
                          <IoBagHandleOutline />
                          Buy Now
                        </button>
                      )}
                    </div>
                  )}

                  <div
                    className="fixed   bottom-0  hidden max-sm:block  left-0 right-0 px-3 lg:px-0 py-4
                                        lg:pt-6 lg:pb-0 lg:py-0  shadow-top md:shadow-none rounded-t-lg bg-white !z-[999999] md:rounded-none
                                        "
                  >
                    <div className="grid grid-cols-2 gap-2 md:gap-6 justify-items-center bg-white !z-60 ">
                      {!checkBag ? (
                        <button
                          className="btn btn-neutral !z-60 border-blue-600 w-full text-blue-600 btn-outline"
                          onClick={() => addToBag(false)}
                        >
                          <IoBagHandleOutline /> Add to Cart
                        </button>
                      ) : (
                        <button
                          className="btn w-full !z-60 bg-gray-200 btn-outline"
                          onClick={() => router.push("/bag")}
                        >
                          <IoBagHandleOutline /> Go to Cart
                        </button>
                      )}
                      {!checkBag ? (
                        <button
                          className="btn bg-gradient-to-r w-full !z-60 from-indigo-500 to-blue-500 text-white  "
                          onClick={() => addToBag(true)}
                        >
                          <IoBagHandleOutline /> Buy Now
                        </button>
                      ) : (
                        <button
                          className="btn w-full !z-60 btn-neutral  bg-gradient-to-r  !z-60 from-indigo-500 to-blue-500 text-white "
                          onClick={() => router.push("/bag")}
                        >
                          <IoBagHandleOutline />
                          Buy Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full   p-2 pl-10 max-sm:p-2">
                {/* Zoom functionality now handled by react-fullscreen-image */}
                <div>
                  <p className=" text-xl font-medium max-sm:text-sm ">
                    {product?.name}
                  </p>
                  {reviews.length > 0 ? (
                    <div className="flex items-center mt-1 gap-1">
                      <div
                        className={`justify-self-end  text-white badge max-sm:badge-sm ${
                          parseInt(calculateReviewStats(reviews).avg) >= 4
                            ? "badge-success"
                            : parseInt(calculateReviewStats(reviews).avg) >= 2
                            ? "badge-warning"
                            : "badge-error"
                        } gap-2`}
                      >
                        {calculateReviewStats(reviews).avg} <FaStar />
                      </div>
                      <span className="text-gray-600 text-xs">
                        {calculateReviewStats(reviews).totalRatings} rating and{" "}
                        {calculateReviewStats(reviews).totalComments} reviews
                      </span>
                    </div>
                  ) : null}
                  {product?.discount ? (
                    <p className="mt-1">
                      <span className="text-2xl max-sm:text-sm font-semibold">
                        &#8377;{" "}
                        {calculateFinalPrice(
                          product?.price,
                          product?.discount
                        ).toFixed(0)}
                      </span>
                      {/*<span className="text-gray-500 max-sm:text-xs !z-[-10] opacity-80 line-through">&#8377; {product?.price}</span>*/}
                      <span className="text-gray-400 text-xs  line-through">
                        <del> &#8377;{product?.price}</del>{" "}
                      </span>
                      <span className="text-green-500 max-sm:text-sm">
                        ({product?.discount}% OFF)
                      </span>
                    </p>
                  ) : (
                    <p className="mt-1">
                      <span className="text-2xl max-sm:text-sm font-semibold">
                        &#8377; {product?.price}
                      </span>
                    </p>
                  )}
                  <p>
                    {product?.stock < 10 ? (
                      <span className="text-red-500 text-sm font-semibold">
                        Only {product?.stock} left
                      </span>
                    ) : (
                      <span className="text-green-500 text-sm font-semibold">
                        In Stock
                      </span>
                    )}
                  </p>
                  {
                    <div>
                      <div className="flex mt-4 items-center gap-1">
                        <label>Quantity</label>
                        <button
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 focus:outline-none"
                          onClick={decrementQuantity}
                        >
                          <span>-</span>
                        </button>
                        <span className="mx-4">{quantity}</span>
                        <button
                          className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-700 focus:outline-none"
                          onClick={incrementQuantity}
                        >
                          <span>+</span>
                        </button>
                      </div>

                      {product?.size && product.size.length > 0 && (
                        <div className={`flex mt-4 items-center  gap-1 `}>
                          <label>Size</label>
                          {/*<Select*/}
                          {/*	onChange={(selectedOptions) => setSize(selectedOptions)}*/}
                          {/*    classNamePrefix="select"*/}
                          {/*    isClearable={true}*/}
                          {/*    options={product?.size}*/}
                          {/*/>*/}
                          <select
                            className="select select-sm  w-fit select-bordered"
                            defaultValue={size}
                            // value={size}
                            onChange={(e: any) => {
                              let a = {
                                value: e.target.value,
                                label: e.target.value,
                              };
                              setSize(a);
                              controlBag(
                                product?.productId,
                                quantity,
                                color,
                                a
                              );
                            }}
                          >
                            <option>Select</option>
                            {product?.size.map((option: any, index: any) => (
                              <option key={index} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {product?.color && product.color.length > 0 ? (
                        <div className="flex mt-4 items-center gap-1">
                          <label>Color Variant</label>
                          {/*<Select*/}
                          {/*    onChange={(selectedOptions) => setColor(selectedOptions)}*/}
                          {/*    classNamePrefix="select"*/}
                          {/*    isClearable={true}*/}
                          {/*    options={product?.color}*/}
                          {/*/>*/}
                          <select
                            className="select select-sm  w-fit select-bordered"
                            defaultValue={color}
                            // value={color}
                            onChange={(e: any) => {
                              let a = {
                                value: e.target.value,
                                label: e.target.value,
                              };
                              setColor(a);
                              controlBag(product?.productId, quantity, a, size);
                            }}
                          >
                            <option>Select</option>
                            {product?.color.map((option: any, index: any) => (
                              <option key={index} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : null}
                    </div>
                  }

                  {product.type !== "stationery" ? (
                    <div className="mt-4 flex items-center gap-2">
                      <p className="font-semibold label-text">Language</p>
                      <div className="badge badge-outline p-4 rounded-[2px] hover:bg-secondary hover:text-white hover:border hover:border-blue-500">
                        {product?.language == "eng"
                          ? "English"
                          : product?.language == "hin"
                          ? "Hindi"
                          : null}
                      </div>
                    </div>
                  ) : null}

                  <div className="form-contro mt-4">
                    <label className="label">
                      <span className="font-semibold text-gray-500 max-sm:text-sm">
                        Check Delivery/Cash on Delivery Availability
                      </span>
                    </label>
                    <div
                      className={
                        "flex border w-fit rounded-xl c-shadow border-gray-300 items-center"
                      }
                    >
                      <label
                        className={
                          "p-4 pr-0 bg-white   hover:bg-transparent border-none  hover:text-black text-xl rounded-l-xl"
                        }
                      >
                        <FaLocationDot />
                      </label>
                      <input
                        type="number"
                        placeholder="Pin Code"
                        className="input border-none rounded-r-xl max-sm:input-sm !outline-none transition delay-150 "
                        required
                        value={pinCode}
                        onChange={(e) => {
                          const input = e.target.value;
                          if (/^\d*$/.test(input) && input.length <= 6) {
                            setPinCode(input);
                          }
                        }}
                      />
                      <button
                        onClick={() => checkPincode(pinCode)}
                        disabled={!(pinCode && pinCode.toString().length >= 6)}
                        className="btn  bg-white disabled:text-blue-200 disabled:bg-white text-secondary hover:bg-white hover:text-blue-600 font-semibold border-none"
                      >
                        Check
                      </button>
                    </div>
                    {deliveryData?.serviceable ? (
                      <p className="text-green-500 font-medium text-sm">
                        Delivery by {deliveryData?.expected_delivery.date}
                      </p>
                    ) : null}
                  </div>

                  {product?.type !== "book" ? (
                    <div className={"mt-4"}>
                      <p className="font-semibold ">Product Description</p>
                      {product?.description
                        ?.split("\n")
                        .map((line: any, index: any) => (
                          <p key={index} className="text-sm text-gray-500">
                            {line}
                          </p>
                        ))}
                    </div>
                  ) : null}

                  {product?.type == "book" ? (
                    <div>
                      <div
                        role="tablist"
                        className="tabs !static mt-8 tabs-lifted"
                      >
                        <a
                          role="tab"
                          onClick={() => setBookTab(0)}
                          className={`tab  max-sm:text-xs ${
                            bookTab === 0
                              ? "tab-active !static  font-semibold"
                              : ""
                          }`}
                        >
                          Book Description
                        </a>
                        <a
                          role="tab"
                          onClick={() => setBookTab(1)}
                          className={`tab  max-sm:text-xs ${
                            bookTab === 1
                              ? "tab-active !static font-semibold"
                              : ""
                          }`}
                        >
                          Book Features
                        </a>
                        <a
                          role="tab"
                          onClick={() => setBookTab(2)}
                          className={`tab   max-sm:text-xs ${
                            bookTab === 2
                              ? "tab-active !static  font-semibold"
                              : ""
                          }`}
                        >
                          Why This Book?
                        </a>
                      </div>
                      <div className="border p-4 bg-white rounded-b-box border-gray-300 border-t-0 ">
                        {bookTab == 0 ? (
                          <p className="text-gray-500 text-sm">
                            {product?.description}
                          </p>
                        ) : bookTab === 1 ? (
                          <ol>
                            {product?.features.map((feature: any, key: any) => (
                              <li
                                className="text-gray-500 max-sm:text-sm flex items-center text-sm"
                                key={key}
                              >
                                <LuDot className="text-xl" /> {feature}
                              </li>
                            ))}
                          </ol>
                        ) : bookTab === 2 ? (
                          <p className="text-gray-500 text-sm">
                            {product?.details}
                          </p>
                        ) : null}
                      </div>
                      <div className="mt-8">
                        <p className="font-semibold">Product Details</p>
                        <ol className="mt-4">
                          <li>
                            <span className="font-semibold gap-1">
                              Publication:
                            </span>
                            {product?.publication}
                          </li>
                          <li>
                            <span className="font-semibold gap-1">
                              Publication Year:
                            </span>
                            {product?.publication_year}
                          </li>
                          <li>
                            <span className="font-semibold gap-1">
                              No of Books:
                            </span>
                            1
                          </li>
                          <li>
                            <span className="font-semibold gap-1">
                              Language:
                            </span>
                            {product?.language == "eng"
                              ? "English"
                              : product?.language == "hin"
                              ? "Hindi"
                              : null}
                          </li>
                        </ol>
                      </div>
                    </div>
                  ) : (
                    product?.details && (
                      <div className="mt-8">
                        <p className="font-semibold">Product Details</p>
                        <p>{product?.details}</p>
                      </div>
                    )
                  )}

                  <div className="grid mt-2 grid-cols-3">
                    <div className="border-r border-blue-500">
                      <img
                        src={"/shield.png"}
                        className="w-12 ml-auto mr-auto max-sm:w-10"
                        alt={"secure"}
                      />
                      <p className="text-gray-500 text-sm font-semibold text-center">
                        100% Safe & Secure Payments
                      </p>
                    </div>
                    <div className="border-r border-blue-500">
                      <img
                        src={"/replacement.png"}
                        className="w-12 ml-auto mr-auto max-sm:w-10"
                        alt={"secure"}
                      />
                      <p className="text-gray-500 text-sm font-semibold text-center">
                        Easy return and replacements
                      </p>
                    </div>
                    <div>
                      <img
                        src={"/package.png"}
                        className="w-12 ml-auto mr-auto max-sm:w-10"
                        alt={"secure"}
                      />
                      <p className="text-gray-500 font-semibold text-sm text-center">
                        Trusted Shipping
                      </p>
                    </div>
                  </div>

                  {reviews.length > 0 ? (
                    <div className="border rounded-lg p-5 mt-4 !z-[-10]">
                      <p className="flex items-center gap-1 font-bold">
                        <img
                          className="w-10"
                          src={
                            "https://img.icons8.com/?size=256&id=lD7y37obguHp&format=png"
                          }
                        />
                        Review and Rating
                      </p>
                      <div className="flex  w-full p-4 max-sm:p-0 flex-row">
                        <div className="grid flex-grow max-sm:mt-2 place-items-center">
                          <div className="ml-auto mr-auto ">
                            <div
                              className={`   text-white badge max-sm:badge-sm ${
                                parseInt(calculateReviewStats(reviews).avg) >= 4
                                  ? "badge-success"
                                  : parseInt(
                                      calculateReviewStats(reviews).avg
                                    ) >= 2
                                  ? "badge-warning"
                                  : "badge-error"
                              } gap-2`}
                            >
                              {calculateReviewStats(reviews).avg} <FaStar />
                            </div>
                            <br />
                            <span className="text-gray-600 max-sm:hidden text-center max-sm:text-xs text-sm">
                              {calculateReviewStats(reviews).totalRatings}{" "}
                              rating and{" "}
                              {calculateReviewStats(reviews).totalComments}{" "}
                              reviews
                            </span>
                            <span className="text-gray-600 hidden max-sm:block max-sm:text-xs text-sm">
                              {calculateReviewStats(reviews).totalRatings}{" "}
                              rating <br />
                              and {
                                calculateReviewStats(reviews).totalComments
                              }{" "}
                              reviews
                            </span>
                          </div>
                        </div>
                        <div className="divider lg:divider-horizontal"></div>
                        <div className="grid flex-grow  place-items-center">
                          {calculateReviewStats(reviews).ratingCounts.map(
                            (itm: any, key: any) => (
                              <p
                                key={key}
                                className="flex gap-2 items-center font-semibold"
                              >
                                {itm.rating}{" "}
                                <progress
                                  className={`progress max-sm:progress-sm ${
                                    itm.rating >= 4
                                      ? "progress-primary"
                                      : itm.rating >= 3
                                      ? "progress-warning"
                                      : "progress-error"
                                  } w-56`}
                                  value={itm.count}
                                  max="5"
                                ></progress>{" "}
                                {itm.count}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                      {calculateReviewStats(reviews).data.map(
                        (itm: any, key: any) => (
                          <div key={key} className="border p-4 rounded-md m-1">
                            <div
                              className={`justify-self-end  text-white badge badge-sm !rounded-sm ${
                                itm.rating >= 4
                                  ? "badge-success"
                                  : itm.rating >= 2
                                  ? "badge-warning"
                                  : "badge-error"
                              } gap-2`}
                            >
                              {itm.rating} <FaStar />
                            </div>
                            <p>{itm.comment}</p>
                            {!itm.username || itm.username == "guest" ? null : (
                              <>
                                <p className="text-sm font-semibold">
                                  {itm.username}
                                </p>
                              </>
                            )}
                            <span className="text-xs">
                              {convertUTCToIST(itm.created_at)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  ) : null}

                  <div className="mt-8 ">
                    <Accordion>
                      {faqs.map((faq: any, index: any) => (
                        <AccordionItem key={index}>
                          <AccordionHeader
                            className="w-full flex m-1 justify-between items-center bg-gray-200 rounded-t-box  border-b p-4"
                            onClick={() => setAcc(index)}
                          >
                            <span>{faq.question}</span>
                            {index == acc ? (
                              <IoIosArrowDropupCircle />
                            ) : (
                              <IoIosArrowDropdownCircle />
                            )}
                            {/*<svg className={`w-6 h-6 ${!open ? '' : 'rotate-90'}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>*/}
                          </AccordionHeader>

                          <AccordionBody>
                            <div className="p-5 font-light  bg-gray-100 ">
                              {faq.answer}
                            </div>
                          </AccordionBody>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </div>
            </div>

            {product.length > 0 ? (
              <div className={"pl-20 pr-20 p-4 max-sm:p-4 "}>
                <Releted ids={product?.productId} cate={product?.category} />
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
              onClick={() => setShowImageModal(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Previous/Next buttons */}
            {product?.images && product.images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                  onClick={() => setImgIndex(imgIndex > 0 ? imgIndex - 1 : product.images.length - 1)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
                  onClick={() => setImgIndex(imgIndex < product.images.length - 1 ? imgIndex + 1 : 0)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Main zoomed image with react-medium-image-zoom */}
            <Zoom>
              <img
                className="max-w-full max-h-full object-contain cursor-zoom-in"
                src={product?.images[imgIndex]}
                alt={product?.name || "Product image"}
              />
            </Zoom>

            {/* Image counter */}
            {product?.images && product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 text-sm">
                {imgIndex + 1} / {product.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default Product;
