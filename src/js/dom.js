(function() {
    'use strict';

    function setAttributes(element, attributes){
        for(var i in attributes) {
            if(attributes.hasOwnProperty(i)){

                var attributeName = i;
                if (attributeName == "className") {
                    attributeName = "class";
                }

                element.setAttribute(attributeName, attributes[i]);
            }
        }
    }

    function appendChild(element, child) {
        if (typeof child == "string" || typeof child == "number") {
            child = document.createTextNode(child);
        }

        element.appendChild(child);
    }

    function appendChildren(element, children){

        if (!Array.isArray(children)) {
            return appendChild(element, children);
        }

        for (var i in children) {
            if(children.hasOwnProperty(i)) {
                appendChild(element, children[i]);
            }
        }
    }

    function createElement(node, attributes, children) {
        var element = document.createElement(node);

        if (attributes) {
            setAttributes(element, attributes);
        }

        // Children can be more than one argument.
        var childrenLength = arguments.length - 2;
        if (childrenLength === 1) {
            appendChildren(element, children);
        } else if (childrenLength > 1) {
            var childArray = Array(childrenLength);
            for (var i = 0; i < childrenLength; i++) {
                childArray[i] = arguments[i + 2];
            }
            appendChildren(element, childArray);
        }

        return element;
    }

    self.React = {
        createElement: createElement
    };
})();
