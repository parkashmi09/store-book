import Link from "next/link";
import {FaStar} from "react-icons/fa";
import {FaArrowRightLong} from "react-icons/fa6";
import ImageShadow from 'react-image-shadow';
import 'react-image-shadow/assets/index.css';
import {calculateFinalPrice} from "@/util/calculateFinalPrice";
import React, {useState} from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import {calculateReviewStats} from "@/util/calculateReviewStats";
interface CardsLayoutProps {
    data: any
    name:any,
    action:any
}



const CardsLayout = ({data,name,action}: CardsLayoutProps) => {
    const [isHovered, setIsHovered] = useState<any>(false);

    let settings:any = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };


    return(
        <>
            <div className="pl-14 pr-14 mt-10  max-sm:p-2">

                <div className="grid grid-cols-2">
                    <p className="text-xl max-sm:text-sm font-semibold">{name}</p>
                    <Link className="text-md text-secondary max-sm:text-sm justify-self-end font-semibold flex items-center gap-1 hover:border-b hover:border-b-blue-600 delay-75 transition" href={action}>See All <FaArrowRightLong/></Link>
                </div>

                <div className="grid grid-cols-5  mt-4 max-sm:grid-cols-2 gap-4 ">
                    {
                        data.map((item:any,key:any)=>(
                            // href={`/product/${item.slug}`}
                            <Link href={`/product/${item.slug}`}  key={key} className="card border hover:border-blue-500 border-gray-300 rounded-xl bg-base-100  c-shadow2  transition delay-250">
                                <div className={`${item.tag.toLowerCase().includes("new")?"ribbon3":item.tag.toLowerCase().includes("best")?"ribbon2":"ribbon"}`}><span>{item.tag}</span></div>
                                <figure className="p-5 " >
                                            <ImageShadow  src={item.images[0]} className="transition  w-20 ease-in-out delay-150 hover:scale-110 ml-auto mr-auto" />
                                        </figure>
                                        {/*<div className="hover:block">*/}
                                        {/*    <Carousel showThumbs={false} showArrows={false} showStatus={false}>*/}
                                        {/*        {*/}
                                        {/*            item.images.map((i:any,k:any)=>(*/}
                                        {/*                <figure key={k} className="p-5" >*/}
                                        {/*                    <img  src={i} className="transition  w-20 ease-in-out delay-150 hover:scale-110 ml-auto mr-auto" />*/}
                                        {/*                </figure>*/}
                                        {/*            ))*/}
                                        {/*        }*/}
                                        {/*    </Carousel>*/}
                                        {/*</div>*/}
                                        <div className="card-body p-2 pt-2  ">
                                            <h2 className="text-lg text-center font-semibold max-sm:text-sm truncate">{item.name}</h2>
                                            <div className="grid grid-cols-3 items-center max-sm:items-baselinem">
                                                <div className="col-span-2">
                                                    {
                                                        item.discount?
                                                            <p><span className=" font-semibold">&#8377; {calculateFinalPrice(item.price, item.discount).toFixed(0)}
                                                            </span>
                                                                <span className="text-gray-500 text-xs opacity-80 line-through"> &#8377; {item.price}</span><br/> <span className="text-green-500 text-xs">({item.discount}% OFF)</span></p>
                                                            :
                                                            <p><span className=" font-semibold">&#8377; {item.price}</span></p>

                                                    }
                                                </div>
                                                {item.reviews.length > 0 ? (
                                                    <div className={`justify-self-end text-white badge !rounded-e-md mr-[-8px] max-sm:badge-sm ${parseInt(calculateReviewStats(item.reviews).avg) >= 4 ? "badge-success" : parseInt(calculateReviewStats(item.reviews).avg) >= 2 ? "badge-warning" : "badge-error"} gap-2`}>
                                                        {calculateReviewStats(item.reviews).avg}      <FaStar />
                                                    </div>
                                                ) : null}
                                            </div>
                                        </div>
                            </Link>
                        ))
                    }
                </div>

            </div>
        </>
    )
}
export default CardsLayout;
