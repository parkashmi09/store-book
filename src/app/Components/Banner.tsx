import Image from "next/image";

interface BannerProps {
    imagePath: string | any;
    action: string;
}

export default function Banner({ imagePath, action }: BannerProps) {
    return (
        <div>
            <Image className="w-full h-full object-cover" src={imagePath} alt="Banner" />
            {/* <a href={action}>
                <button>Shop Now</button>
            </a> */}
        </div>
    )
}