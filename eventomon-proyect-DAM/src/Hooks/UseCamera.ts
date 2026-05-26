import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface CameraResult {
    image: string | null;
    error: string | null;
}

export const useCamera = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const takePhoto = async (): Promise<CameraResult> => {
        setLoading(true);
        try {
            const photo = await Camera.getPhoto({
                quality: 90,
                allowEditing: false,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Camera,
            });
            return { image: photo.dataUrl ?? null, error: null };
        } catch (e) {
            return { image: null, error: 'Could not access camera' };
        } finally {
            setLoading(false);
        }
    };

    return { takePhoto, loading };
};