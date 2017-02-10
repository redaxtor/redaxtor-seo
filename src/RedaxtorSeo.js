import React, {Component} from "react"
import Codemirror from 'react-codemirror'
import {html as html_beautify} from 'js-beautify'
import Modal from 'react-modal'
require('codemirror/mode/htmlmixed/htmlmixed');

const TITLE_FIELD = "title";
const KEYWORDS_FIELD = "keywords";
const DESCRIPTION_FIELD = "description";
const HEADER_HTML_FIELD = "html";

export default class RedaxtorSeo extends Component {
    constructor(props) {
        super(props);

        this.onClickBound = this.onClick.bind(this);

        this.beautifyOptions = {
            "wrap_line_length": 140
        };
        if (this.props.node) {
            this.state = {
                sourceEditorActive: false
            };
        } else {
            this.state = {}
        }
        this.tempData = this.props.data;
    }


    onClick(e){
        e.preventDefault();
        this.setState({sourceEditorActive: true});
    }

    componentWillUnmount(){
        console.log(`SEO editor ${this.props.id} unmounted`);
    }

    updateCode(newCode) {
        this.updateValue(HEADER_HTML_FIELD, newCode);
    }

    shouldComponentUpdate(nextProps, nextState){
        if (this.props.data) {
            if (nextProps.data != this.props.data) {
                this.props.setPieceMessage && this.props.setPieceMessage(this.props.id, 'Page refresh required', 'warning');
            }
        }
        return nextProps.data != this.props.data
               || this.props.editorActive != nextProps.editorActive
               || this.state.sourceEditorActive != nextState.sourceEditorActive;
    }

    /**
     * Update a current value in the temp state
     * @param valueKey
     * @param value
     */
    updateValue(valueKey, value) {
        this.tempData[valueKey] = (value || "").trim();
    }

    onSave() {
        this.props.updatePiece && this.props.updatePiece(this.props.id, {data: {...this.tempData}});
        this.props.savePiece && this.props.savePiece(this.props.id);
        this.setState({sourceEditorActive: false})
    }

    onClose() {
        this.props.node ? this.setState({sourceEditorActive: false}) : (this.props.onClose && this.props.onClose())
    }

    createEditor(){
        // this.props.node
        if(this.props.node) {
            this.props.node.addEventListener('click', this.onClickBound);
        }
    }

    destroyEditor(){
        if(this.props.node) {
            this.props.node.removeEventListener('click', this.onClickBound);
        }
    }

    renderNonReactAttributes(){
        if (this.props.editorActive && !this.state.sourceEditorActive) {
            this.createEditor();
            if(this.props.node) {
                this.props.node.classList.add(...this.props.className.split(' '));
            }
        }
        else {
            this.destroyEditor();
            if(this.props.node) {
                this.props.node.classList.remove(...this.props.className.split(' '));
            }
        }
    }


    render() {
        let modalDiv = null;

        if(this.state.sourceEditorActive){

            let options = {
                lineNumbers: true,
                mode: 'htmlmixed'
            };

            const {title, description, keywords} = this.props.data;
            const {id} = this.props;
            const html = html_beautify(this.props.data.html, this.beautifyOptions);

            modalDiv =  <Modal contentLabel="Edit SEO Information" isOpen={true} overlayClassName="r_modal-overlay r_visible"
                                 className="r_modal-content"
                                 onRequestClose={this.onClose.bind(this)}>
                <div className="r_row">
                    <div className="r_col">
                        <div className="item-form">
                            <div><label htmlFor={`r_${id}_title`}>Title</label></div>
                            <input id={`r_${id}_title`} placeholder="Title meta" type="text" defaultValue={title} onChange={(event)=>this.updateValue(TITLE_FIELD, event.target.value)}/>
                        </div>
                        <div className="item-form">
                            <div><label htmlFor={`r_${id}_keywords`}>Keywords</label></div>
                            <input id={`r_${id}_keywords`} placeholder="Keywords list" type="text" defaultValue={keywords} onChange={(event)=>this.updateValue(KEYWORDS_FIELD, event.target.value)}/>
                        </div>
                        <div className="item-form">
                            <div><label htmlFor={`r_${id}_description`}>Description</label></div>
                            <textarea id={`r_${id}_description`} placeholder="Description" type="text" defaultValue={description} onChange={(event)=>this.updateValue(DESCRIPTION_FIELD, event.target.value)}/>
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
RedaxtorSeo.__name = "SEO meta";
