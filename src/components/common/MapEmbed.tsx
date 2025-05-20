import { CONFIG } from "@/config/config";

const MapEmbed = () => {
    const { GOOGLE_MAPS_API_KEY, contactAddress } = CONFIG
    const src = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(contactAddress)}`;

    return (
        <iframe
            title="Our Location"
            width="100%"
            height="400"
            loading="lazy"
            allowFullScreen
            src={src}
        ></iframe>
    );
};

export default MapEmbed;
