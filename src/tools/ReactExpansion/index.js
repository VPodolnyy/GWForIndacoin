'React Expansion Component';

import React, {Component} from "react";

export const Expansion = class extends Component {
    setStateUpdate(state = {}, callback) {
        if(typeof state === 'object') {
            let object = {}, update = false;
            
            for(let key in state) {
                if(state[key] !== this.state[key]) {
                    object[key] = state[key];
                    update = true;
                }
            }

            if(update) {
                this.setState(object, callback);
            }
        }
    }

    get(key, value) {
        const url = new URL(window.location);

        switch(value) {
            case undefined:
                value = url.searchParams.get(key);
                return value === null ? null : decodeURIComponent(value);
            case null:
                url.searchParams.delete(key);
                break;
            default:
                url.searchParams.set(key, encodeURIComponent(value));
        }

        if(url.href !== window.location.href) {
            window.history.replaceState(null, document.title, url.href);
        }
    }

    sessionStorage(key, value) {
        const ss = window.sessionStorage;

        switch(value) {
            case undefined:
                return ss.getItem(key)
            case null:
                ss.removeItem(key);
                break;
            default:
                ss.setItem(key, value);
        }
    }
};

export default React;