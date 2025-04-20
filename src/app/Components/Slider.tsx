"use client";
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import Image from "next/image";
import { Pagination,Autoplay,Parallax } from 'swiper/modules';
import {useEffect, useState} from "react";
import {API_URL} from "@/util/base_url";

const Slider = () => {

    const [data,setData]=useState<any>([])
    const [dataA,setDataA]=useState<any>([])
    const [banner,setBanner]=useState<any>()
    const [bannerAct,setBannerAct]=useState<any>()
    const getData = async () => {

        try {
            const bannerRes = await fetch(`${API_URL}/get-banner/1`);
            const sliderRed = await fetch(`${API_URL}/get-slider/1`);

            if (bannerRes.ok) {
                const highlightData = await bannerRes.json();

                if (sliderRed.status === 201) {
                    if(highlightData.data.show){
                       setBanner(highlightData.data.img)
                       setBannerAct(highlightData.data.action)
                    }
                }
            } else {
                throw new Error('Failed to fetch highlight');
            }

            if (sliderRed.ok) {
                const highlightData = await sliderRed.json();
                if (sliderRed.status === 201) {
                    setData(highlightData.data.img);
                    setDataA(highlightData.data.act);
                }
            } else {
                throw new Error('Failed to fetch highlight');
            }
        } catch (error) {

        }
    };


    useEffect(() => {
        getData();
    }, []);
    return(
        <>
            <div className="h-full max-sm:h-full">
                <Swiper
                    pagination={{
                        dynamicBullets: true,
                    }}
                    modules={[Pagination,Autoplay,Parallax]}
                    spaceBetween={0}
                    parallax={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    slidesPerView={1}
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                >
                    {
                        data.map((item:any,key:any)=>(
                            <SwiperSlide key={key} >
                               <a target="_blank" href={dataA[key]}>
                                   <img src={item} className="ml-auto mr-auto c-aspect "/>
                               </a>
                            </SwiperSlide>
                        ))
                    }

                </Swiper>


                { banner &&
                    <div className="m-4 max-sm:m-1 ">
                       <a target="_blank" href={bannerAct}>
						   <img  src={banner} alt="" className="w-full max-sm:p-0 h-28 pl-10 pr-10 object-contain" />
                       </a>
                    </div>
                }

            </div>
        </>
    )
}
export default Slider;
