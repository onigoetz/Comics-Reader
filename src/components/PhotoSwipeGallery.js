import React from "react";
import debounce from "debounce";
import { Portal } from "react-portal";
import PhotoSwipe from "react-photoswipe/lib/PhotoSwipe";

import styles from "./PhotoSwipeGallery.module.css";

function getRowLimit(containerWidth) {
  if (containerWidth >= 1024) {
    return 9;
  }

  if (containerWidth >= 480) {
    return 6;
  }

  return 3;
}

function elementInViewport(el) {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight)
  );
}

export default class PhotoSwipeGallery extends React.Component {
  static defaultProps = {
    options: {},
    onClose: () => {},
    afterChange: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      options: this.props.options,
      containerWidth: 0
    };

    this.thumbnails = [];
  }

  showPhotoSwipe = itemIndex => e => {
    e.preventDefault();
    const getThumbBoundsFn = index => {
      const img = this.thumbnails[index];
      const pageYScroll =
        window.pageYOffset || document.documentElement.scrollTop;
      const rect = img.getBoundingClientRect();
      return {
        x: rect.left,
        y: rect.top + pageYScroll,
        w: rect.width
      };
    };
    const { options } = this.state;
    options.index = itemIndex;
    options.getThumbBoundsFn = options.getThumbBoundsFn || getThumbBoundsFn;
    this.setState({
      isOpen: true,
      options
    });
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("scroll", this.handleScroll);
    this.handleResize();
    this.handleScroll();
  }

  componentDidUpdate() {
    if (this._gallery.clientWidth !== this.state.containerWidth) {
      this.handleResize();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize, false);
    window.removeEventListener("scroll", this.handleScroll, false);
  }

  loadImages() {
    this.thumbnails
      .filter(thumb => !thumb.src && elementInViewport(thumb))
      .forEach(thumb => {
        thumb.src = thumb.getAttribute("data-src");
      });
  }

  handleResize = debounce(() => {
    if (!this._gallery) {
      // This could be triggered after an unmount, make sure it doesn't break
      return;
    }
    this.resizeGallery(Math.floor(this._gallery.clientWidth));
    this.loadImages();
  }, 10);

  handleClose = () => {
    this.setState({ isOpen: false });
    this.props.onClose();
  };

  handleScroll = debounce(() => this.loadImages(), 10);

  // eslint-disable-next-line @swissquote/swissquote/sonarjs/cognitive-complexity
  resizeGallery(containerWidth) {
    const photoPreviewNodes = [];
    const rowLimit = getRowLimit(containerWidth);

    let contWidth = containerWidth - rowLimit * 6;
    /* 4px for margin around each image*/
    contWidth = Math.floor(contWidth - 2); // add some padding to prevent layout prob
    const remainder = this.props.items.length % rowLimit;
    let lastRowIndex;
    if (remainder) {
      // there are fewer than rowLimit photos in last row
      lastRowIndex = this.props.items.length - remainder;
    }

    let previousHeight = 0;
    for (let i = 0; i < this.props.items.length; i += rowLimit) {
      // loop thru each set of rowLimit num
      // eg. if rowLimit is 3 it will  loop thru 0,1,2, then 3,4,5 to perform calculations for the particular set
      let totalAr = 0,
        commonHeight = 0;
      for (let j = i; j < i + rowLimit; j++) {
        if (j === this.props.items.length) {
          break;
        }
        totalAr += this.props.items[j].aspectRatio;
      }
      if (i === lastRowIndex) {
        commonHeight = previousHeight || Math.min(200, contWidth / totalAr);
      } else {
        commonHeight = contWidth / totalAr;
      }

      // run thru the same set of items again to give the common height
      for (let k = i; k < i + rowLimit; k++) {
        if (k === this.props.items.length) {
          break;
        }

        this.thumbnails[k].height = commonHeight;
        this.thumbnails[k].width =
          commonHeight * this.props.items[k].aspectRatio;
      }
      previousHeight = commonHeight;
    }

    return photoPreviewNodes;
  }

  getThumbSize(height, width) {
    const finalWidth = 200;
    return {
      width: finalWidth,
      height: height * (finalWidth / width)
    };
  }

  render() {
    const { items } = this.props;
    const { isOpen, options } = this.state;
    return (
      <div className="pswp-gallery">
        <div
          className={styles.Gallery}
          ref={c => {
            this._gallery = c;
          }}
        >
          {this.props.items.map((item, k) => (
            <div
              key={k}
              className={styles.Gallery__item}
              onClick={this.showPhotoSwipe(k)}
            >
              <img
                data-src={item.thumbnail}
                data-key={k}
                alt={`Page ${k}`}
                onLoad={this.handleResize}
                ref={node => {
                  if (node) {
                    this.thumbnails[node.getAttribute("data-key")] = node;
                  }
                }}
                {...this.getThumbSize(item.h, item.w)}
              />
              <div className={styles.Gallery__page}>{k + 1}</div>
            </div>
          ))}
        </div>
        <Portal>
          <PhotoSwipe /*{...eventProps}*/
            isOpen={isOpen}
            items={items}
            options={options}
            onClose={this.handleClose}
            afterChange={this.props.afterChange}
          />
        </Portal>
      </div>
    );
  }
}
