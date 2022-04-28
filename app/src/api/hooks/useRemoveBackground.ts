import axios, {AxiosError} from 'axios';
import loadImage from 'blueimp-load-image';
import {useMutation, useQueryClient} from "react-query";
import {PHOTOROOM_API_SEGMENT_URL} from "../constants";
import localforage from "localforage";
import {LS_IMAGES} from "../localStorageConstants";
import {Image} from "../types";
import {IMAGES} from "../queryKeysConstants";

const BASE64_IMAGE_HEADER = 'data:image/png;base64,'

const saveToLocalStorage = async (image: Image) => {
    const images = await localforage.getItem<Array<Image>>(LS_IMAGES) || []
    await localforage.setItem<Array<Image>>(LS_IMAGES, [
        ...images,
        image,
    ])
}

export const useRemoveBackground = () => {
    const queryClient = useQueryClient()

    return useMutation<Image, AxiosError, File>(async (file: File) => {
        const imageData = await loadImage(file, {
            maxWidth: 400,
            maxHeight: 400,
            canvas: true,
        })
        const image = imageData.image as HTMLCanvasElement
        const data = image.toDataURL("image/png").replace(BASE64_IMAGE_HEADER, "")

        const response = await axios.post(PHOTOROOM_API_SEGMENT_URL, {
            image_file_b64: data
        })

        const noBackground: Image = {
            src: BASE64_IMAGE_HEADER + response.data,
            id: (Math.random() * 100000).toString(),
        }

        // using the localstorage as a backend here
        await saveToLocalStorage(noBackground)

        return noBackground
    }, {
        onSuccess: (image: Image) => {
            // optimistic update
            queryClient.setQueryData(IMAGES, (prev: Array<Image> | undefined) => [
                image,
                ...prev || [],
            ])
        }
    })
}