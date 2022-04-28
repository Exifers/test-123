import React, {CSSProperties, FC} from "react";
import {DragDropContext, Draggable, DraggingStyle, Droppable, DropResult, NotDraggingStyle} from "react-beautiful-dnd";
import {Folder, Image} from "../api/types";

// adpated from https://codesandbox.io/s/-w5szl?file=/src/index.js

const grid = 8;

interface Props {
    folders: Array<Folder>,
    setFolders: (folders: Array<Folder>) => Promise<void>,
}

export const Folders: FC<Props> = ({ folders, setFolders }) => {

    const onDragEnd = async (result: DropResult) => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = source.droppableId;
        const dInd = destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(
                folders!.find(f => f.id === sInd)!.images,
                source.index,
                destination.index
            ) as Array<Image>;
            const newState = folders!.map(f => f.id === sInd ? {...f, images: items} : f)
            await setFolders(newState);
        } else {
            const result = move(
                folders!.find(f => f.id === sInd)!.images,
                folders!.find(f => f.id === dInd)!.images,
                source,
                destination,
            );
            const newState = folders!.map(f =>
                f.id === sInd ? {...f, images: result[sInd]}
                    : f.id === dInd ? {...f, images: result[dInd]}
                        : f
            )
            await setFolders(newState);
        }
    }

    const handleRename = async (id: string) => {
        await setFolders(folders.map(f => f.id === id ? {
            ...f,
            name: prompt('folder name') as string,
        } : f))
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {folders?.map(({name, id, images}) => (
                <Droppable key={id} droppableId={id}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            <span>{name}</span>
                            {
                                images.map((image, index) => (
                                    <Draggable
                                        key={image.id}
                                        draggableId={image.id}
                                        index={index}
                                    >
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style,
                                                ) as CSSProperties}
                                            >
                                                <img src={image.src} alt={`img-${image.id}`}/>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                            {provided.placeholder}
                            {id !== 'unnamed' && (
                                <button type="button" onClick={() => handleRename(id)}>Rename</button>
                            )}
                        </div>
                    )}
                </Droppable>
            ))}
        </DragDropContext>
    );
}


const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250
});

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};


const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};
