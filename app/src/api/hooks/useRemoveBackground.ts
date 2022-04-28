import axios from 'axios';
import loadImage from 'blueimp-load-image';
import {useMutation} from "react-query";
import {PHOTOROOM_API_SEGMENT_URL} from "../constants";

const BASE64_IMAGE_HEADER = 'data:image/png;base64,'

export const useRemoveBackground = () => {
    return useMutation(async (file: File) => {
        const imageData = await loadImage(file, {
            maxWidth: 400,
            maxHeight: 400,
            canvas: true,
        })
        const image = imageData.image as HTMLCanvasElement
        const data = image.toDataURL("image/png").replace(BASE64_IMAGE_HEADER, "")

        alert(data)
        const response = await axios.post(PHOTOROOM_API_SEGMENT_URL, {
            image_file_b64: data
        })

        return BASE64_IMAGE_HEADER + response.data.result_b64
    })
}