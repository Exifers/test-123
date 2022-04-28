import {ChangeEvent, FC} from "react";

interface Props {
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export const AddButton: FC<Props> = ({ onChange }) => {
    return (
        <input type="file" onChange={onChange} accept=".png, .jpg, .jpeg"/>
    )
}