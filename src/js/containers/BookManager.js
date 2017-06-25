import React from "react";
import Header from "../components/Header";
import Loading from "../components/Loading";
import Book from "../components/Book";
import {getList} from "../api";

export default class BookManager extends React.Component {
    constructor(props) {
        super(props);

        this.state = {data: null};
        this.unmounting = false;
    }

    loadData(props) {
        getList((props.location && props.location.pathname.replace("/book/", "")) || "").then(v => {

            if (this.unmounting) {
                return;
            }

            this.setState({data: v});
        })
    }

    componentDidMount() {
        this.loadData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({data: null});

        this.loadData(nextProps);
    }

    componentWillUnmount() {
        this.unmounting = true;
    }

    render() {
        if (!this.state.data) {
            return <Loading />;
        }

        return <div>
            <Header url={this.props.location.pathname} title={this.state.data.name} parent={this.state.data.parent} />
            <div className="Content Content--gallery">
                <Book book={this.state.data}/>
            </div>
        </div>;
    }
}

BookManager.displayName = "BookManager";
