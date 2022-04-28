import React, {useState} from 'react'
import {AddButton} from "./components/AddButton";
import {useRemoveBackground} from "./api/hooks/useRemoveBackground";

function App() {
    const [file, setFile] = useState<File | undefined>(undefined)
    const removeBackgroundMutation = useRemoveBackground()

    const handleRemoveBackground = () => {
        if (file !== undefined) {
            removeBackgroundMutation.mutate(file!)
        }
    }

    return (
        <div>
            <h1>Image Background Remover</h1>
            <AddButton onChange={(e) => setFile(e.target.files?.[0])}/>
            <button type="button" disabled={!file} onClick={handleRemoveBackground}>Remove background</button>
        </div>
    )
}

export default App
