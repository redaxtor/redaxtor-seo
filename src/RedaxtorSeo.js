import React, {Component} from "react"
import Codemirror from 'react-codemirror'
import {html as html_beautify} from 'js-beautify'
import Modal from 'react-modal'
require('codemirror/mode/htmlmixed/htmlmixed');
var shallowEqual = require('fbjs/lib/shallowEqual');

const TITLE_FIELD = "title";
const KEYWORDS_FIELD = "keywords";
const DESCRIPTION_FIELD = "description";
const HEADER_HTML_FIELD = "html";

const VALS = [TITLE_FIELD, KEYWORDS_FIELD, DESCRIPTION_FIELD, HEADER_HTML_FIELD];

export default class RedaxtorSeo extends Component {
    constructor(props) {
        super(props);

        this.onClickBound = this.onClick.bind(this);

        this.beautifyOptions = {
            "wrap_line_length": 140
        };

        this.state = {
            [TITLE_FIELD]: this.props.data[TITLE_FIELD] || "",
            [KEYWORDS_FIELD]: this.props.data[KEYWORDS_FIELD] || "",
            [DESCRIPTION_FIELD]: this.props.data[DESCRIPTION_FIELD] || "",
            [HEADER_HTML_FIELD]: this.props.data[HEADER_HTML_FIELD] || "",
            sourceEditorActive: false
        }
    }

    /**
     * That is a common public method that should activate component editor if it presents
     */
    activateEditor() {
        if(this.props.editorActive && !this.state.sourceEditorActive) {
            this.setEditorActive(true);
        }
    }


    setEditorActive(active) {
        if(active != this.state.sourceEditorActive){
            this.setState({sourceEditorActive: active});
            this.props.onEditorActive && this.props.onEditorActive(this.props.id, active);
        }
    }

    onClick(e) {
        e.preventDefault();
        this.setState({sourceEditorActive: true});
    }

    componentWillUnmount() {
        console.log(`SEO editor ${this.props.id} unmounted`);
    }

    updateCode(newCode) {
        this.updateValue(HEADER_HTML_FIELD, newCode);
    }

    componentWillReceiveProps(nextProps) {

        // Props are always superior to state

        this.setState({
            [TITLE_FIELD]: nextProps.data[TITLE_FIELD] || "",
            [KEYWORDS_FIELD]: nextProps.data[KEYWORDS_FIELD] || "",
            [DESCRIPTION_FIELD]: nextProps.data[DESCRIPTION_FIELD] || "",
            [HEADER_HTML_FIELD]: nextProps.data[HEADER_HTML_FIELD] || "",
        });

        if(nextProps.manualActivation) {
            this.props.onManualActivation(this.props.id);
            this.activateEditor();
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.data) {
            if (nextProps.data != this.props.data) {
                this.props.setPieceMessage && this.props.setPieceMessage(this.props.id, 'Page refresh required', 'warning');
            }
        }
        return !shallowEqual(nextProps.data, this.props.data)
            || this.props.editorActive != nextProps.editorActive
            || !shallowEqual(this.state, nextState);
    }

    /**
     * Update a current value in the temp state
     * @param valueKey
     * @param value
     */
    updateValue(valueKey, value) {
        if (VALS.indexOf(valueKey) == -1) {
            console.error("Unknown field ", valueKey, value);
        } else {
            this.setState({[valueKey]: (value || "").trim()});
        }
    }

    onSave() {
        this.props.updatePiece && this.props.updatePiece(this.props.id,
            {
                data: {
                    [TITLE_FIELD]: this.state[TITLE_FIELD] || "",
                    [KEYWORDS_FIELD]: this.state[KEYWORDS_FIELD] || "",
                    [DESCRIPTION_FIELD]: this.state[DESCRIPTION_FIELD] || "",
                    [HEADER_HTML_FIELD]: this.state[HEADER_HTML_FIELD] || "",
                }
            });
        this.props.savePiece && this.props.savePiece(this.props.id);
       this.setEditorActive(false);
    }

    onClose() {
        this.props.node ?  this.setEditorActive(false) : (this.props.onClose && this.props.onClose());
    }

    createEditor() {
        // this.props.node
        if (this.props.node) {
            this.props.node.addEventListener('click', this.onClickBound);
        }
    }

    destroyEditor() {
        if (this.props.node) {
            this.props.node.removeEventListener('click', this.onClickBound);
        }
    }

    renderNonReactAttributes() {
        if (this.props.editorActive && !this.state.sourceEditorActive) {
            this.createEditor();
            if (this.props.node) {
                this.props.node.classList.add(...this.props.className.split(' '));
            }
        }
        else {
            this.destroyEditor();
            if (this.props.node) {
                this.props.node.classList.remove(...this.props.className.split(' '));
            }
        }
    }


    render() {
        let modalDiv = null;

        if (this.state.sourceEditorActive) {

            let options = {
                lineNumbers: true,
                mode: 'htmlmixed'
            };

            const {title, description, keywords} = this.state;
            const descr = description.length > 156 ? (description.substring(0, 153) + "...") : description;
            const floatRight = {
                float: "right",
                paddingRight: "131px"
            };
            const {id} = this.props;
            const html = html_beautify(this.state.html, this.beautifyOptions);

            modalDiv =
                <Modal contentLabel="Edit SEO Information" isOpen={true} overlayClassName="r_modal-overlay r_visible"
                       className="r_modal-content"
                       onRequestClose={this.onClose.bind(this)}>
                    <div className="r_row">
                        <div className="r_col">
                            <div className="item-form">
                                <div><label htmlFor={`r_${id}_title`}>Title</label><span
                                    style={floatRight}>{title.length}</span></div>
                                <input id={`r_${id}_title`} placeholder="Title meta" type="text" defaultValue={title}
                                       onChange={(event)=>this.updateValue(TITLE_FIELD, event.target.value)}/>
                            </div>
                            <div className="item-form">
                                <div><label htmlFor={`r_${id}_keywords`}>Keywords</label><span
                                    style={floatRight}>{keywords.length}</span></div>
                                <input id={`r_${id}_keywords`} placeholder="Keywords list" type="text"
                                       defaultValue={keywords}
                                       onChange={(event)=>this.updateValue(KEYWORDS_FIELD, event.target.value)}/>
                            </div>
                            <div className="item-form">
                                <div><label htmlFor={`r_${id}_description`}>Description</label><span
                                    style={floatRight}>{description.length}</span></div>
                                <textarea id={`r_${id}_description`} placeholder="Description" type="text"
                                          defaultValue={description}
                                          onChange={(event)=>this.updateValue(DESCRIPTION_FIELD, event.target.value)}/>
                            </div>
                        </div>
                        <div className="r_col">
                            <label htmlFor={`r_${id}_description`}>Page Header</label>
                            <Codemirror
                                value={html}
                                onChange={this.updateCode.bind(this)} options={options}/>
                            <div>This HTML will be inserted in page headers. Use for custom meta tags.</div>
                        </div>
                    </div>

                    <div>
                        <label>Google Search Engine Preview</label>
                        <div className="google-preview-wrapper">
                            <div className="google-preview">
                                <div className="google-header">{title}</div>
                                <div className="google-website">{window.location.href}</div>
                                <div className="google-description">{descr}</div>
                            </div>
                        </div>
                    </div>

                    <div className="actions-bar">
                        <div className="button button-cancel" onClick={this.onClose.bind(this)}>Cancel</div>
                        <div className="button button-save"
                             onClick={()=>this.onSave()}>
                            Save
                        </div>
                    </div>
                </Modal>;
        } else {
            modalDiv = React.createElement(this.props.wrapper, {});
        }

        this.renderNonReactAttributes();
        return modalDiv;
    }
}


/**
 * Specify component should be rendered inside target node and capture all inside html
 * @type {string}
 */
RedaxtorSeo.__renderType = "BEFORE";
RedaxtorSeo.__editLabel = "Edit SEO meta";
