const Class = new class {
    constructor() {
        this.encodePath = new URL(window.location).searchParams.get('devcss');
        this.decodePath = urlcss => decodeURIComponent(urlcss || this.encodePath || '') || null;
    }

    createLink(data) {
        const {ok, status, url} = data;
        if(ok && status === 200) {
            const d = document;
            const
                tag = 'link',
                rel = 'stylesheet',
                type = 'text/css';
            const some = ![...d.head.children].some((item) => (
                item.tagName === tag.toUpperCase()
                && item.rel === rel
                && item.type === type
                && item.href === url
            ));
            if(some) {
                let ref = d.createElement(tag);
                ref.setAttribute("rel", rel);
                ref.setAttribute("type", type);
                ref.setAttribute("href", url);
                d.head.append(ref);
            }
        }
    }

    loadCssFile(urlcss) {
        const decodePath = this.decodePath(urlcss);
        if(decodePath) {
            fetch(decodePath).then(this.createLink);
        }
        return null;
    }
};

export const setCssFile = (urlcss) => Class.loadCssFile(urlcss);