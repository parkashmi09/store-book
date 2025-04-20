"use client"
import {useParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import {FaArrowRight} from "react-icons/fa6";
import ImageShadow from "react-image-shadow";
import {FaStar} from "react-icons/fa";
import Link from "next/link";
import {calculateFinalPrice} from "@/util/calculateFinalPrice";
import {API_URL} from "@/util/base_url";
import Loading from "@/app/Components/Loading";
import {AiOutlineHome} from "react-icons/ai";
import {calculateReviewStats} from "@/util/calculateReviewStats";

const Products = () => {

    const param=useParams()
    const check=param.slug

    const [data,setData]=useState<any>([])
    const [copyData,setCopyData]=useState<any>([])
    const [books,setBooks]=useState<any>([])
    const [categoryTab,setCategoryTab]=useState<any>(null)
    const [category,setCategory]=useState<any>([])
    const [sub_category,setSub_Category]=useState<any>([])
    const [sub_categoryTab,setSub_CategoryTab]=useState<any>(null)
    const [edition,setEdition]=useState<any>([])
    const [editionTab,setEditionTab]=useState<any>(null)
    const [stationery,setStationery]=useState<any>([])
    const [isLoading,setIsLoading]=useState<any>()

   const cate:any= decodeURIComponent(param.slug as string)

    const getProducts = async () => {
        try {
            setIsLoading(true)
            const response = await fetch(`${API_URL}/category-product/${cate}`)
            const data = await response.json();
            if (response.status === 201) {
                setData(data.products)
                const mapData =data.products

                if (mapData) {
                    const editions = Array.from(new Set(mapData.map((item: any) => item.publication_year)));
                    const categories = Array.from(new Set(mapData.map((item: any) => item.category)));
                    const sub_categories = Array.from(new Set(mapData.map((item: any) => item.sub_category)));
                    setEdition(editions);
                    setCategory(categories);
                    setSub_Category(sub_categories);
                }

                setIsLoading(false)
            }
        } catch (error) {

        }
    };

    useEffect(() => {
        getProducts()
    }, []);

    const [sorting,setSorting]=useState<any>('latest');

    const filteredItems: any =

        (categoryTab || sub_categoryTab || editionTab) ?
            data.filter((item: any) => {
                debugger
                if (categoryTab && sub_categoryTab && editionTab) {
                    return (
                        item.category == categoryTab &&
                        item.sub_category == sub_categoryTab &&
                        item.publication_year == editionTab
                    );
                } else if (categoryTab && sub_categoryTab) {
                    return (
                        item.category == categoryTab &&
                        item.sub_category == sub_categoryTab
                    );
                } else if (categoryTab && editionTab) {
                    return (
                        item.category == categoryTab &&
                        item.publication_year == editionTab
                    );
                } else if (sub_categoryTab && editionTab) {
                    return (
                        item.sub_category == sub_categoryTab &&
                        item.publication_year === editionTab
                    );
                } else if (categoryTab) {
                    return item.category == categoryTab
                } else if (sub_categoryTab) {
                    return item.sub_category == sub_categoryTab
                } else if (editionTab) {
                    return item.publication_year == editionTab;
                }
            })
            : data;

    const filterAndSortData = () => {
        // debugger
        let filteredAndSortedData = [...filteredItems];

        switch (sorting) {
            case "latest":
                // Your logic to sort by latest
                filteredAndSortedData.sort((a, b) => (a.created_at > b.created_at ? -1 : 1));
                break;
            case "popular":
                // Your logic to sort by popularity
                filteredAndSortedData.sort((a, b) => (a.sale_count > b.sale_count ? -1 : 1));
                break;
            case "high":
                // Your logic to sort by price high to low
                filteredAndSortedData.sort((a, b) => (a.price > b.price ? -1 : 1));
                break;
            case "low":
                // Your logic to sort by price low to high
                filteredAndSortedData.sort((a, b) => (a.price < b.price ? -1 : 1));
                break;
            default:
                break;
        }
        // Return the filtered and sorted data
        return filteredAndSortedData;
    };

    const filteredData = filterAndSortData();



    return(
        <>
           <div className="p-10 pl-20 pr-20 max-sm:p-4">
               {
                   isLoading? <Loading/>
                       :  <>
                           <div className="grid grid-cols-2">
                               <div>
                                   <div className="text-sm breadcrumbs">
                                       <ul>
                                           <li>
                                               <Link href="/">
                                                   <AiOutlineHome/>
                                               </Link>
                                           </li>
                                           <li>
                                               <a>
                                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                                   <span className="ml-1 underline">Category:{decodeURIComponent(param.slug as string)}</span>
                                               </a>
                                           </li>
                                       </ul>
                                   </div>
                               </div>
                               <div className="justify-self-end">
                                   <div className="flex gap-2 items-center">
                                       <label className="label">
                                           <span className="label-text">Tags</span>
                                       </label>
                                       <select className="select select-sm text-xs border-gray-300 rounded-r-xl w-full !outline-none transition delay-150 "
                                               value={sorting}
                                               onChange={(e:any) => setSorting(e.target.value)}>
                                           <option value={"latest"}>Latest</option>
                                           <option value={"popular"}>Popularity</option>
                                           <option value={"high"}>Price High to Low</option>
                                           <option value={"low"}>Price Low to High</option>
                                       </select>
                                   </div>
                               </div>
                           </div>

                           <div className="flex p-2 gap-2 max-sm:grid">
                               <div className="flex-none ">
                                   <div className="drawer !z-40 hidden max-sm:block">
                                       <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                                       <div className="drawer-content">
                                           <label htmlFor="my-drawer" className="btn btn-sm btn-outline drawer-button">Filters</label>
                                       </div>
                                       <div className="drawer-side">
                                           <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                                           <ul className="menu p-4 w-80 min-h-full bg-base-100 ">
                                               <div className="card sticky  z-30 bg-base-100 border !rounded-[4px] shadow-sm">
                                                   <div className="card-body !p-4 ">
                                                       <h2 className="text-lg font-semibold">Filters</h2>
                                                       <div className="p-4 border-b ">
                                                           <p className="text-md font-semibold mb-2">Category</p>
                                                           <ol>
                                                               {
                                                                   category?.map((item: string, key: number) => (
                                                                       <li
                                                                           key={key}
                                                                           onClick={() => setCategoryTab(categoryTab === item ? '' : item)}

                                                                           className={`flex items-center gap-1 btn btn-sm w-fit btn-ghost ${categoryTab === item ? 'bg-gray-300' : ''}`}
                                                                       >
                                                                           <FaArrowRight className="text-gray-400"/>
                                                                           {item}
                                                                       </li>
                                                                   ))
                                                               }
                                                           </ol>

                                                       </div>
                                                       <div className="p-4 border-b ">
                                                           <p className="text-md font-semibold mb-2">More</p>
                                                           {
                                                               sub_category?.map((item: string, index: number) => (
                                                                   <div key={index} className="flex gap-2 mb-2 items-center">
                                                                       <input
                                                                           type="checkbox"
                                                                           checked={sub_categoryTab === item}
                                                                           className="checkbox checkbox-sm"
                                                                           onChange={() => {
                                                                               setSub_CategoryTab(sub_categoryTab === item ? '' : item);
                                                                           }}
                                                                       />
                                                                       <span className="label-text">{item}</span>
                                                                   </div>
                                                               ))
                                                           }


                                                       </div>
                                                       {
                                                           edition?
                                                               <div className="p-4 border-b ">
                                                                   <p className="text-md font-semibold mb-2">Edition</p>
                                                                   {
                                                                       edition?.map((item: string, index: number) => (
                                                                           <div key={index} className="flex gap-2 mb-2 items-center">
                                                                               <input
                                                                                   type="checkbox"
                                                                                   checked={editionTab === item}
                                                                                   className="checkbox checkbox-sm"
                                                                                   onChange={() => {
                                                                                       setEditionTab(editionTab === item ? '' : item);
                                                                                   }}
                                                                               />
                                                                               <span className="label-text">{item}</span>
                                                                           </div>
                                                                       ))
                                                                   }

                                                               </div>:null
                                                       }
                                                   </div>

                                               </div>
                                           </ul>
                                       </div>
                                   </div>
                                   <div className="card w-72  max-sm:hidden sticky top-20 bg-base-100 border !rounded-[4px] shadow-sm">
                                       <div className="card-body !p-4 ">
                                           <h2 className="text-lg font-semibold">Filters</h2>
                                           <div className="p-4 border-b ">
                                               <p className="text-md font-semibold mb-2">Category</p>
                                               <ol>
                                                   {
                                                       category?.map((item: string, key: number) => (
                                                           <li
                                                               key={key}
                                                               onClick={() => setCategoryTab(categoryTab === item ? '' : item)}

                                                               className={`flex items-center gap-1 btn btn-sm w-fit btn-ghost ${categoryTab === item ? 'bg-gray-300' : ''}`}
                                                           >
                                                               <FaArrowRight className="text-gray-400"/>
                                                               {item}
                                                           </li>
                                                       ))
                                                   }
                                               </ol>

                                           </div>
                                           <div className="p-4 border-b ">
                                               <p className="text-md font-semibold mb-2">More</p>
                                               {
                                                   sub_category?.map((item: string, index: number) => (
                                                       <div key={index} className="flex gap-2 mb-2 items-center">
                                                           <input
                                                               type="checkbox"
                                                               checked={sub_categoryTab === item}
                                                               className="checkbox checkbox-sm"
                                                               onChange={() => {
                                                                   setSub_CategoryTab(sub_categoryTab === item ? '' : item);
                                                               }}
                                                           />
                                                           <span className="label-text">{item}</span>
                                                       </div>
                                                   ))
                                               }


                                           </div>
                                           {
                                               edition?
                                                   <div className="p-4 border-b ">
                                                       <p className="text-md font-semibold mb-2">Edition</p>
                                                       {
                                                           edition?.map((item: string, index: number) => (
                                                               <div key={index} className="flex gap-2 mb-2 items-center">
                                                                   <input
                                                                       type="checkbox"
                                                                       checked={editionTab === item}
                                                                       className="checkbox checkbox-sm"
                                                                       onChange={() => {
                                                                           setEditionTab(editionTab === item ? '' : item);
                                                                       }}
                                                                   />
                                                                   <span className="label-text">{item}</span>
                                                               </div>
                                                           ))
                                                       }

                                                   </div>:null
                                           }
                                       </div>

                                   </div>
                               </div>
                               <div className="flex-initial">
                                   <div className="grid grid-cols-4  max-sm:grid-cols-2 gap-4 ">
                                       {
                                           filteredData?.map((item:any,key:any)=>(
                                               <Link href={`/product/${item.slug}`} key={key} className="card border hover:border-blue-500 border-gray-300 rounded-xl bg-base-100    transition delay-250">
                                                   <div className={`${item.tag.toLowerCase().includes("new")?"ribbon3":item.tag.toLowerCase().includes("best")?"ribbon2":"ribbon"}`}><span>{item.tag}</span></div>
                                                   <figure className="p-5">
                                                       <ImageShadow src={item.images[0]} className="transition ease-in-out delay-150 hover:scale-110 ml-auto mr-auto" />
                                                       {/*<img src={item.images[0]} className="object-contain  rounded transition ease-in-out delay-150 hover:scale-110 ml-auto mr-auto" alt="Tailwind CSS Carousel component" />*/}
                                                   </figure>
                                                   <div className="card-body p-4 pt-2  ">
                                                       <h2 className="text-lg text-center font-semibold truncate">{item.name}</h2>
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
                                                           {item.reviews?.length > 0 ? (
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
                           </div>
                       </>
               }
           </div>
        </>
    )
}
export default Products;
