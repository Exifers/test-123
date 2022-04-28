import {useQuery} from "react-query";
import {FOLDERS} from "../queryKeysConstants";
import * as localforage from "localforage";
import {LS_FOLDERS} from "../localStorageConstants";
import {Image} from "../types";


export const useImages = () => {
    return useQuery<Array<Image>>(FOLDERS, async () => {
        return await localforage.getItem<Array<Image>>(LS_FOLDERS) || []
    })
}