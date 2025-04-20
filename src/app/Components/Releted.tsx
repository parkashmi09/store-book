import {API_URL} from "@/util/base_url";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import ImageShadow from "react-image-shadow";
import {calculateFinalPrice} from "@/util/calculateFinalPrice";
import {FaStar} from "react-icons/fa";
import {IoBagHandleOutline} from "react-icons/io5";
import {useRouter} from "next/navigation";
import {calculateReviewStats} from "@/util/calculateReviewStats";
import product from "@/app/product/[slug]/Components/Product";


interface RecommendationProps {
    ids: any,
    cate: any,
}

const Releted = ({ ids,cate }: RecommendationProps) => {


    const router=useRouter()
    const [data,setData]=useState([])
    let user:any=sessionStorage.getItem('user')
    user=JSON.parse(user)




    const getProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/by-category-product/${encodeURIComponent(cate)}`);
            const data = await response.json();
            if (response.status === 201) {
                const merged:any = data.products;
                const filteredData:any = merged.filter((product:any) => !ids.includes(product.productId));
                setData(filteredData);
            } else {
                console.error('Failed to fetch products:', response.status);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    useEffect(() => {
        getProducts()
    }, [ids]);



    return(
        <>
            <div className=" rounded-xl p-4  ">
                {
                    data.length>0?
                        <p className="font-semibold">Related Items</p>
                    :null
                }
                <div className="flex  mt-4 max-sm:flex gap-4 overflow-x-auto">
                    {
                        data.map((item:any,key:any)=>(
                            <Link href={item.slug}   key={key} className="w-40  border hover:border-blue-500 border-gray-300 rounded-xl bg-base-100  c-shadow2  transition delay-250">
                                {/*<figure className="p-5">*/}
                                    <img src={item.images[0]} className="transition p-5 !w-fit ease-in-out delay-150 hover:scale-110 ml-auto mr-auto" />
                                {/*</figure>*/}
                                <div className=" p-2 pt-2  ">
                                    <h2 className="text-sm text-left  font-semibold truncate">{item.name}</h2>
                                    <div className="grid grid-cols-3 items-center">
                                        <div className="col-span-2">
                                            {
                                                item.discount?
                                                    <p><span className=" font-semibold">&#8377; {calculateFinalPrice(item.price, item.discount).toFixed(0)}</span>
                                                        <span className="text-gray-400 text-xs  line-through"><del> &#8377;{item.price}</del> </span> <span className="text-green-500 text-xs">({item.discount}% OFF)</span></p>
                                                    :
                                                    <p><span className=" font-semibold">&#8377; {item.price}</span></p>

                                            }
                                        </div>
                                        {item?.reviews?.length > 0 ? (
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
export default Releted;
