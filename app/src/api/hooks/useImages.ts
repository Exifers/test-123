import {useQuery} from "react-query";
import {IMAGES} from "../queryKeysConstants";
import * as localforage from "localforage";
import {LS_IMAGES} from "../localStorageConstants";
import {Image} from "../types";


export const useImages = () => {
    return useQuery<Array<Image>>(IMAGES, async () => {
        return await localforage.getItem<Array<Image>>(LS_IMAGES) || []
    })
}