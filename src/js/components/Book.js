import React from "react";
import ExtendedPhotoSwipeGallery from "./ExtendedPhotoSwipeGallery";
import {image, toRetina, isRetina} from "../utils";

export default class Book extends React.Component {

    renderThumbnail(item) {
        return <img src={item.thumbnail} alt="Book Page" />;
    }

    render() {

        const items = this.props.book.pages.map(page => {
            return {
                src: isRetina ? toRetina(image("big", page.src)) : image("big", page.src),
                thumbnail: image("small", page.src),
                w: page.width,
                h: page.height,
                aspectRatio: page.width / page.height
            };
        });

        const options = {
            history: false,
            shareEl: false
        };

        return <ExtendedPhotoSwipeGallery items={items} options={options} thumbnailContent={this.renderThumbnail}/>
    }

}

Book.displayName = "Book";
