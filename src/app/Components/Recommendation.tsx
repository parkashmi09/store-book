import {API_URL} from "@/util/base_url";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import ImageShadow from "react-image-shadow";
import {calculateFinalPrice} from "@/util/calculateFinalPrice";
import {FaStar} from "react-icons/fa";
import {IoBagHandleOutline} from "react-icons/io5";
import {useRouter} from "next/navigation";


interface RecommendationProps {
    ids: any,
    setAddToBag: any
}

const Recommendation = ({ ids, setAddToBag }: RecommendationProps) => {


    const router=useRouter()
    const [data,setData]=useState([])
    let user:any=sessionStorage.getItem('user')
    user=JSON.parse(user)


    const [quantity,setQuantity]=useState<any>(1)
    const [checkBag,setCheckBag]=useState<any>(false)


    const getProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products`);
            const data = await response.json();

            if (response.status === 201) {
                const a1 = data.categorizedProducts.books;
                const a2 = data.categorizedProducts.stationery;

                const merged = [...a1, ...a2];

                const filteredData:any = merged.filter(product => !ids.includes(product.productId));
                setData(filteredData);
            } else {
                console.error('Failed to fetch products:', response.status);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };


    const addToBag=async (product:any) => {
        if(user){
            sessionStorage.setItem('settingtab',"1")
            const token: any = sessionStorage.getItem('token')
            const response = await fetch(`${API_URL}/control-bag`,
                {
                    method: 'POST',
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: user?.id,
                        productId: product.productId,
                        quantity,
                        price: calculateFinalPrice(product.price,product.discount).toFixed(0)
                    }),
                })
            if(response){
                const data = await response.json();
                if (response.status === 201) {
                    // @ts-ignore
                    let it:any=parseInt(sessionStorage.getItem('mybag')) + 1
                    sessionStorage.setItem('mybag',it)
                    setAddToBag(true)
                }
            }
        }
        else{
            const user: any = {
                userId: "guest",
                productId: product.productId,
                quantity,
                price: calculateFinalPrice(product.price, product.discount).toFixed(0)
            };

            let guest: any[] = JSON.parse(localStorage.getItem('guest') || '[]');

            const existingProductIndex = guest.findIndex((item) => item.productId === user.productId);

            if (existingProductIndex !== -1) {
                guest[existingProductIndex].quantity = quantity;
                guest[existingProductIndex].price = calculateFinalPrice(product.price, product.discount).toFixed(0);
            } else {
                guest.push(user);
            }

            localStorage.setItem('guest', JSON.stringify(guest));

            let total: number = parseInt(localStorage.getItem('mybag') || '0') + 1;
            localStorage.setItem('mybag', total.toString());
            setAddToBag(true)
        }
    }



    useEffect(() => {
        getProducts()
    }, [ids]);

    const controlBag=async (id:any,quantity:number) => {
        if(user){
            const token: any = sessionStorage.getItem('token')
            const response = await fetch(`${API_URL}/control-q`,
                {
                    method: 'POST',
                    headers: {
                        'x-access-token': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userId: user?.id,
                        productId:id,
                        quantity,
                    }),
                })
        }
    }


    return(
        <>
            <div className="shadow-xl rounded-xl p-4 mt-4 border">
                <p className="font-semibold">Popular Add Ons</p>
                <div className="grid grid-cols-5 max-sm:flex mt-4  gap-4 !overflow-x-auto">
                    {
                        data.map((item:any,key:any)=>(
                            <div   key={key} className="card border max-sm:w-40 hover:border-blue-500 border-gray-300 rounded-xl bg-base-100  c-shadow2 w-full transition delay-250">
                                <figure className="p-5">
                                    <ImageShadow src={item.images[0]} className="transition ease-in-out delay-150 hover:scale-110 ml-auto mr-auto" />
                                </figure>
                                <div className="card-body p-4 pt-2  ">
                                    <h2 className="text-xs text-center font-semibold truncate">{item.name}</h2>
                                    <div className="grid grid-cols-3 ">
                                        <div className="col-span-2">
                                            {
                                                item.discount?
                                                <p className="text-xs"><span className=" font-semibold">&#8377; {calculateFinalPrice(item.price, item.discount).toFixed(0)}</span> <span className="text-gray-500 !text-xs opacity-80 line-through">&#8377; {item.price}</span> <span className="text-green-500 !text-xs">({item.discount}% OFF)</span></p>:
                                                    <p className="text-xs"><span className=" font-semibold">&#8377; {item.price}</span></p>
                                            }
                                        </div>
                                    </div>
                                    {
                                        item?.stock==0?null:<div>
                                            {
                                               <button className="btn border-blue-600 text-blue-600 mt-auto w-full flex gap-1 items-center btn-xs text-xs rounded-sm  btn-outline" onClick={()=>(addToBag(item))}><IoBagHandleOutline/> Add to Bag</button>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}
export default Recommendation;
