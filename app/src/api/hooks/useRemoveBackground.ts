import axios, {AxiosError} from 'axios';
import loadImage from 'blueimp-load-image';
import {useMutation, useQueryClient} from "react-query";
import {PHOTOROOM_API_SEGMENT_URL} from "../constants";
import {Folder, Image} from "../types";
import {FOLDERS} from "../queryKeysConstants";
import * as localforage from "localforage";
import {LS_FOLDERS} from "../localStorageConstants";

const BASE64_IMAGE_HEADER = 'data:image/png;base64,'

const addToFolders = (prev?: Array<Folder>, image: Image) => {
    if (prev === undefined) {
        return [{id: 'unnamed', name: 'unnamed', images: [image]}]
    }

    if (!prev.find(f => f.id === 'unnamed')) {
        return [
            ...prev,
            {id: 'unnamed', name: 'unnamed', images: [image]}
        ]
    }

    return prev.map(f => f.id === 'unnamed' ? {...f, images: [...f.images, image]} : f)
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

        // using localstorage as backend
        const folders = await localforage.getItem<Array<Folder>>(LS_FOLDERS) || undefined
        await localforage.setItem<Array<Folder>>(LS_FOLDERS, addToFolders(folders, noBackground))

        return noBackground
    }, {
        onSuccess: (image: Image) => {
            queryClient.setQueryData(FOLDERS, (prev: Array<Folder> | undefined) => addToFolders(prev, image))
        }
    })
}