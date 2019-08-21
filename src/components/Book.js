import React, { useRef } from "react";

import PhotoSwipeGallery from "./PhotoSwipeGallery";
import { image } from "../utils";

export default function Book({ pages, read, onRead, isRetina, supportsWebp }) {
  const currentPage = useRef(-1);

  const afterChange = instance => {
    currentPage.current = instance.items.indexOf(instance.currItem);
  };

  const handleClose = () => {
    const count = pages.length;

    // Add + 1 for the 0-indexed list
    // The -3 is to count for the last pages that are generally the
    // back cover, that is often skipped
    if (currentPage.current + 1 > count - 3 && !read) {
      onRead();
    }
  };

  const items = pages.map(page => {
    return {
      src: image(page.src, "big", isRetina, supportsWebp),
      thumbnail: image(page.src, "small", isRetina, supportsWebp),
      w: page.width,
      h: page.height,
      aspectRatio: page.width / page.height
    };
  });

  const options = {
    history: false,
    shareEl: false
  };

  return (
    <div>
      <div className="BookInfo">
        {read ? (
          "You read this book"
        ) : (
          <div>
            You did not read this book{" "}
            <button className="Button" onClick={onRead}>
              Mark as read
            </button>
          </div>
        )}
      </div>
      <PhotoSwipeGallery
        items={items}
        options={options}
        afterChange={afterChange}
        onClose={handleClose}
      />
    </div>
  );
}
