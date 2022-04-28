import React, {useState} from 'react'
import {AddButton} from "./components/AddButton";
import {useRemoveBackground} from "./api/hooks/useRemoveBackground";
import {useFolders} from "./api/hooks/useFolders";
import {Folders} from "./components/Folders";


function App() {
    // current file in form
    const [file, setFile] = useState<File | undefined>(undefined)
    const removeBackgroundMutation = useRemoveBackground()

    const [{data: folders}, setFolders] = useFolders()

    const handleRemoveBackground = () => {
        if (file !== undefined) {
            removeBackgroundMutation.mutate(file!)
        }
    }

    const handleAddFolder = async () => {
        await setFolders([
            ...folders!,
            {
                name: prompt('folder name') as string,
                id: (Math.random() * 10000).toString(),
                images: []
            }
        ])
    }

    return (
        <div>
            <h1>Image Background Remover</h1>
            <AddButton onChange={(e) => setFile(e.target.files?.[0])}/>
            <button
                type="button" disabled={!file || removeBackgroundMutation.isLoading}
                onClick={handleRemoveBackground}>
                Remove background
            </button>
            {removeBackgroundMutation.isLoading && <span>Loading ...</span>}
            {folders?.length && folders?.length > 0 && (
                <button type="button" onClick={handleAddFolder}>Add folder</button>
            )}
            {!!folders && <Folders folders={folders!} setFolders={setFolders}/>}
        </div>
    )
}

export default App
