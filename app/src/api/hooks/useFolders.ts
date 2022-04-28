import {useMutation, useQuery, useQueryClient, UseQueryResult} from "react-query";
import {Folder} from "../types";
import {FOLDERS} from "../queryKeysConstants";
import localforage from "localforage";
import {LS_FOLDERS} from "../localStorageConstants";

export const useFolders = (): [UseQueryResult<Array<Folder>>, (folders: Array<Folder>) => Promise<void>]  => {
    const foldersQuery = useQuery<Array<Folder>>(FOLDERS, async () => {
        return await localforage.getItem<Array<Folder>>(LS_FOLDERS) || []
    })

    const queryClient = useQueryClient()
    const foldersMutation = useMutation(async (folders: Array<Folder>) => {
        return await localforage.setItem<Array<Folder>>(LS_FOLDERS, folders)
    }, {
        onMutate: (folders: Array<Folder>) => {
            // optimitic update
            queryClient.setQueryData(FOLDERS, folders)
        }
    })

    const setFolders = async (folders: Array<Folder>) => {
        await foldersMutation.mutate(folders)
    }

    return [
        foldersQuery,
        setFolders,
    ]
}