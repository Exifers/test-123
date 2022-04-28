import React, {useState} from 'react'
import {AddButton} from "./components/AddButton";
import {useRemoveBackground} from "./api/hooks/useRemoveBackground";
import {useImages} from "./api/hooks/useImages";

function App() {
    const [file, setFile] = useState<File | undefined>(undefined)
    const removeBackgroundMutation = useRemoveBackground()
    const { data: images } = useImages()

    const handleRemoveBackground = () => {
        if (file !== undefined) {
            removeBackgroundMutation.mutate(file!)
        }
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
            <ul>
                {images?.map(({ src, id }) => (
                    <li>
                        <img src={src} key={id} alt={`img-${id}`}/>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default App
