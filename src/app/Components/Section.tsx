"use client"
import CardsLayout from "@/app/Components/CradsLayout";
import { API_URL } from "@/util/base_url";
import { useEffect, useState } from "react";

const Section = () => {


    const [books, setBooks] = useState<any>([])
    const [stationery, setStationery] = useState<any>([])
    const [reviews, setReviews] = useState<any>([])

    const getProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products`)
            const data = await response.json();
            if (response.status === 201) {
                setBooks(data.categorizedProducts.books)
                setStationery(data.categorizedProducts.stationery)
            }
        } catch (error) {

        }
    };

    async function getReviews(id: any) {
        try {
            const response = await fetch(`${API_URL}/review/product/${id}`)
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            if (response.status == 200) {
                // const index = books.findIndex((obj:any) => obj.productId === id);
                // const index1 = stationery.findIndex((obj:any) => obj.productId === id);
                setReviews(data.data)
                // const updatedArray = [...books];
                // const updatedArray1 = [...stationery];
                // updatedArray[index]["reviews"] = data.data;
                // updatedArray1[index1]["reviews"] = data.data;
                // setStationery(updatedArray1);
                // setBooks(updatedArray)
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    useEffect(() => {
        getProducts()
    }, []);

    return (
        <div className="overflow-hidden">
            <CardsLayout data={books} name={"Latest Books"} action={"/product/all/books"} />
            <CardsLayout data={stationery} name={"Stationery"} action={"/product/all/stationery"} />
        </div>
    )
}
export default Section;
