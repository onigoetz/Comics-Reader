import React from "react";

import ExtendedPhotoSwipeGallery from "./ExtendedPhotoSwipeGallery";
import {image, toRetina, isRetina} from "../utils";

export default class Book extends React.Component {
    currentPage = -1;

    renderThumbnail(item) {
      return <img src={item.thumbnail} alt="Book Page" />;
    }

    afterChange = (instance) => {
      this.currentPage = instance.items.indexOf(instance.currItem);
    }

    handleClose = () => {
      const count = this.props.book.pages.length;

      // Add + 1 for the 0-indexed list
      // The -3 is to count for the last pages that are generally the
      // back cover, that is often skipped
      if (this.currentPage + 1 > count - 3 && !this.props.book.read) {
        this.props.onRead();
      }
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

      return <div>
        <div className="BookInfo">
          {this.props.book.read && "You read this book"}
          {this.props.book.read || <div>You did not read this book <button className="Button" onClick={this.props.onRead}>Mark as read</button></div>}
        </div>
        <ExtendedPhotoSwipeGallery items={items} options={options} thumbnailContent={this.renderThumbnail} afterChange={this.afterChange} onClose={this.handleClose} />
      </div>;
    }
}

Book.displayName = "Book";
