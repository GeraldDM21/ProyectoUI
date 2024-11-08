import { useEffect, useRef } from "react";

const UploadWidget = () => {
    const cloudinaryRef = useRef();
    const widgetRef = useRef();

    useEffect(() => {
        const loadScript = () => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = "https://upload-widget.cloudinary.com/latest/global/all.js";
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        };

        loadScript().then(() => {
            cloudinaryRef.current = window.cloudinary;
            widgetRef.current = cloudinaryRef.current.createUploadWidget({
                cloudName: 'dvdag5roy',
                uploadPreset: 'fcb_pre'
            }, function(error, result) {
                console.log(result);
            });
        }).catch(error => {
            console.error("Failed to load Cloudinary script", error);
        });
    }, []);

    return (
        <button onClick={() => widgetRef.current && widgetRef.current.open()}>
            Subir Foto
        </button>
    );
};

export default UploadWidget;