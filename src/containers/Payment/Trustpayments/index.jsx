// tools
import React, {Expansion} from "@tools/ReactExpansion"
import styles from "../styles.sass"


/**
 * TEST CARD: 5599 0050 8907 2784
 */
const Trustpayments = class extends Expansion {
    constructor() {
        super();

        this.state = {
            headerPayloadSignature: null,
            animation: false,
        };
        this.form = React.createRef();
    }
    
    componentDidMount() {
        const { token } = this.props,
        { headerPayloadSignature } = this.state;

        if (token && !headerPayloadSignature) {
            this.setState({
                headerPayloadSignature: token,
            }, this.createScript);
        }
    }

    componentDidUpdate() {
        const { token } = this.props,
        { headerPayloadSignature } = this.state;
        if (token && token !== headerPayloadSignature) {
            this.setState({
                headerPayloadSignature: token
            }, this.createScript);
        }
    }

    createScript() {
        const { headerPayloadSignature } = this.state;
        (() => {
            /**
             * https://webservices.securetrading.net (European Gateway)
             * https://webservices.securetrading.us (US Gateway)
             */            
            let script = document.createElement('script');
            script.async = false;
            script.type = 'text/javascript';
            script.src = `https://webservices.securetrading.net/js/v3/st.js`;
            document.body.appendChild(script);
        })();
        /**
         * livestatus: 0 - dev || livestatus: 1 - prod
         * status=
         * errorcode=60107
         * orderreference=138
         * errordata=TRX+failed+fraud+screening
         * errormessage=Invalid+process
         */
        (() => {
            const string = `
            (function SecureTradingStart() {
                if (typeof SecureTrading === 'undefined') { setTimeout(SecureTradingStart, 1000); return null; }
                var st = SecureTrading({
                    jwt: '${headerPayloadSignature}',
                    livestatus: 1,
                    submitFields: ['orderreference', 'errorcode'],
                    submitOnError: true,
                });
                st.Components({ startOnLoad: true });
            })();
            `;
            let script = document.createElement('script');
            script.async = false;
            script.type = 'text/javascript';
            script.text = string;
            document.body.appendChild(script);
        })();
        if (this.state.animation === false) {
            this.setState({ animation: true });
            var secureTradingInterval = null;
            secureTradingInterval = setInterval(() => {
                if (
                    window.secureTrading
                    || this.form.current.querySelector('input') !== null
                ) {
                    clearInterval(secureTradingInterval);
                    this.setState({ animation: false });
                }
            }, 1000);
        }
    }

    render() {
        if ( this.form.current && window.secureTrading ) {
            if (this.form.current) {
                const inputArr = this.form.current.querySelectorAll('input');
                const form = this.form.current.querySelector('form');
                const iframe = this.form.current.querySelector('iframe#st-control-frame-iframe');
                inputArr && inputArr.forEach(item => item.remove());
                form && form.remove();
                iframe && iframe.remove();
            }
        }
        return <>
            <div className={styles.barsLoader}>
                <span /><span /><span /><span /><span /><span />
            </div>
            <div style={{ overflow: 'hidden', width: 0, height: 0 }}>
                <div id={'st-notification-frame'}/>
                <form ref={this.form} id={'st-form'} action={`/status`}></form>
            </div>
        </>;
    }
};

export default Trustpayments;