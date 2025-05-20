import Image from 'next/image';

interface BannerImageProps {
    src: string;
    alt: string;
}

const BannerImage = ({ src, alt}:BannerImageProps) => {
    return (
        <div className="relative w-full h-full">
            <Image
                src={src}
                alt={alt}
                width={576}
                height={1024}
                className='object-contain h-full w-full'
                priority
            />
        </div>
    );
};

export default BannerImage;