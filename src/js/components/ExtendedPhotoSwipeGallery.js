import React from "react";
//import pick from 'lodash.pick';
//import events from 'react-photoswipe/src/events';
import classnames from 'classnames';

import Portal from "react-overlays/lib/Portal";
import {PhotoSwipeGallery, PhotoSwipe} from "react-photoswipe";

export default class ExtendedPhotoSwipeGallery extends PhotoSwipeGallery {

    constructor(props) {
        super(props);
        this.state.containerWidth = 0;
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        this.setState({containerWidth: Math.floor(this._gallery.clientWidth)});
        window.addEventListener('resize', this.handleResize);
    }

    componentDidUpdate() {
        if (this._gallery.clientWidth !== this.state.containerWidth) {
            this.setState({containerWidth: Math.floor(this._gallery.clientWidth)});
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize, false);
    }

    handleResize(e) {
        this.setState({containerWidth: Math.floor(this._gallery.clientWidth)});
    }

    renderGallery() {
        var rowLimit = 3, photoPreviewNodes = [];

        if (this.state.containerWidth >= 480) {
            rowLimit = 6;
        }

        if (this.state.containerWidth >= 1024) {
            rowLimit = 9;
        }

        var contWidth = this.state.containerWidth - (rowLimit * 4);
        /* 4px for margin around each image*/
        contWidth = Math.floor(contWidth - 2); // add some padding to prevent layout prob
        var remainder = this.props.items.length % rowLimit;
        if (remainder) { // there are fewer than rowLimit photos in last row
            var lastRowWidth = Math.floor(this.state.containerWidth - (remainder * 4) - 2);
            var lastRowIndex = this.props.items.length - remainder;
        }

        let previousHeight = 0;
        for (var i = 0; i < this.props.items.length; i += rowLimit) {
            // loop thru each set of rowLimit num
            // eg. if rowLimit is 3 it will  loop thru 0,1,2, then 3,4,5 to perform calculations for the particular set
            var totalAr = 0, commonHeight = 0;
            for (var j = i; j < i + rowLimit; j++) {
                if (j === this.props.items.length) {
                    break;
                }
                totalAr += this.props.items[j].aspectRatio;
            }
            if (i === lastRowIndex) {
                //commonHeight = lastRowWidth / totalAr;
                commonHeight = previousHeight || lastRowWidth / totalAr;
            } else {
                commonHeight = contWidth / totalAr;
            }
            // run thru the same set of items again to give the common height
            for (var k = i; k < i + rowLimit; k++) {
                if (k === this.props.items.length) {
                    break;
                }
                var src = this.props.items[k].thumbnail;


                photoPreviewNodes.push(<div key={k} ref={'thumbnail' + k} className="Gallery__item" onClick={this.showPhotoSwipe(k)}>
                    <img src={src} height={commonHeight} width={commonHeight * this.props.items[k].aspectRatio} alt=""/>
                </div>);
            }
            previousHeight = commonHeight;
        }

        return photoPreviewNodes;
    }

    render() {
        let {id, className, items} = this.props;
        className = classnames(['pswp-gallery', className]).trim();
        //let eventProps = pick(other, events);
        let {isOpen, options} = this.state;
        return (
            <div id={id} className={className}>
                <div className="Gallery" ref={(c) => this._gallery = c}>
                    {this.renderGallery()}
                </div>
                <Portal>
                    <PhotoSwipe /*{...eventProps}*/
                                isOpen={isOpen}
                                items={items}
                                options={options}
                                onClose={this.handleClose}/>
                </Portal>
            </div>
        );
    }
}

