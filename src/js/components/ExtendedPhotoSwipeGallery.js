import React from "react";
import PropTypes from "prop-types";
import debounce from "debounce";
//import pick from 'lodash.pick';
//import events from 'react-photoswipe/src/events';
import classnames from "classnames";

import Portal from "react-overlays/lib/Portal";
import {PhotoSwipe} from "react-photoswipe";

export default class ExtendedPhotoSwipeGallery extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    options: PropTypes.object,
    thumbnailContent: PropTypes.func,
    id: PropTypes.string,
    className: PropTypes.string,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    afterChange: PropTypes.func,
  };

  static defaultProps = {
    options: {},
    thumbnailContent: item => (
      <img src={item.src} width="100" height="100" alt=""/>
    ),
    id: '',
    className: '',
    isOpen: false,
    onClose: () => {
    },
    afterChange: () => {
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: this.props.isOpen,
      options: this.props.options,
      containerWidth: 0
    };

    this.thumbnails = [];
  }

  componentWillReceiveProps = (nextProps) => {
    const {isOpen} = this.state;
    if (nextProps.isOpen) {
      if (!isOpen) {
        this.setState({isOpen: true});
      }
    } else if (isOpen) {
      this.setState({isOpen: false});
    }
  };


  showPhotoSwipe = itemIndex => (e) => {
    e.preventDefault();
    const _this = this;
    const getThumbBoundsFn = ((index) => {
      const thumbnail = _this.thumbnails[index];
      const img = thumbnail.getElementsByTagName('img')[0];
      const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
      const rect = img.getBoundingClientRect();
      return {
        x: rect.left,
        y: rect.top + pageYScroll,
        w: rect.width
      };
    });
    const {options} = this.state;
    options.index = itemIndex;
    options.getThumbBoundsFn = options.getThumbBoundsFn || getThumbBoundsFn;
    this.setState({
                    isOpen: true,
                    options
                  });
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  componentDidUpdate() {
    if (this._gallery.clientWidth !== this.state.containerWidth) {
      this.handleResize();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize, false);
  }

  handleResize = debounce(() => {
    this.resizeGallery(Math.floor(this._gallery.clientWidth));
  }, 10);

  handleClose = () => {
    this.setState({isOpen: false});
    this.props.onClose();
  };

  resizeGallery(containerWidth) {
    let rowLimit = 3, photoPreviewNodes = [];

    if (containerWidth >= 480) {
      rowLimit = 6;
    }

    if (containerWidth >= 1024) {
      rowLimit = 9;
    }

    let contWidth = containerWidth - (rowLimit * 4);
    /* 4px for margin around each image*/
    contWidth = Math.floor(contWidth - 2); // add some padding to prevent layout prob
    let remainder = this.props.items.length % rowLimit;
    let lastRowWidth, lastRowIndex;
    if (remainder) { // there are fewer than rowLimit photos in last row
      lastRowWidth = Math.floor(this.state.containerWidth - (remainder * 4) - 2);
      lastRowIndex = this.props.items.length - remainder;
    }

    let previousHeight = 0;
    for (let i = 0; i < this.props.items.length; i += rowLimit) {
      // loop thru each set of rowLimit num
      // eg. if rowLimit is 3 it will  loop thru 0,1,2, then 3,4,5 to perform calculations for the particular set
      let totalAr = 0, commonHeight = 0;
      for (let j = i; j < i + rowLimit; j++) {
        if (j === this.props.items.length) {
          break;
        }
        totalAr += this.props.items[j].aspectRatio;
      }
      if (i === lastRowIndex) {
        commonHeight = previousHeight || lastRowWidth / totalAr;
      } else {
        commonHeight = contWidth / totalAr;
      }

      // run thru the same set of items again to give the common height
      for (let k = i; k < i + rowLimit; k++) {
        if (k === this.props.items.length) {
          break;
        }

        this.thumbnails[k].firstChild.height = commonHeight;
        this.thumbnails[k].firstChild.width = commonHeight * this.props.items[k].aspectRatio;
      }
      previousHeight = commonHeight;
    }

    return photoPreviewNodes;
  }

  render() {
    let {id, className, items} = this.props;
    className = classnames(['pswp-gallery', className]).trim();
    let {isOpen, options} = this.state;
    return (
      <div id={id} className={className}>
        <div className="Gallery" ref={(c) => this._gallery = c}>
          {this.props.items.map((item, k) => {
            return <div key={k} className="Gallery__item" onClick={this.showPhotoSwipe(k)} data-key={k} ref={node => {
              if (node) this.thumbnails[node.getAttribute("data-key")] = node;
            }}>
              <img src={item.thumbnail} alt={`Page ${k}`}/>
            </div>;
          })}
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

ExtendedPhotoSwipeGallery.displayName = "PhotoSwipe";

