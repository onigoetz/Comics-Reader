import PhotoSwipeGallery from "./PhotoSwipeGallery";
import { image } from "../utils";
import { ImageData, Page } from "../types";

import styles from "../containers/Header.module.css";

interface BookProps extends ImageData {
  pages: Page[];
  read: boolean;
  onRead: () => void;
}

export default function Book({
  pages,
  read,
  onRead,
  isRetina,
  supportsWebp
}: BookProps) {
  const handleClose = (lastPageIndex: number) => {
    const count = pages.length;

    // Add + 1 for the 0-indexed list
    // The -3 is to count for the last pages that are generally the
    // back cover, that is often skipped
    if (lastPageIndex + 1 > count - 3 && !read) {
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

  return (
    <div>
      <div className={styles.BookInfo}>
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
      <PhotoSwipeGallery items={items} onClose={handleClose} />
    </div>
  );
}
