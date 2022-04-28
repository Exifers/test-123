
export interface Image {
    src: string,
    id: string,
}

export interface Folder {
    id: string,
    name: string,
    images: Array<Image>
}