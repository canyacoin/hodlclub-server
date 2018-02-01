import React, {Component} from 'react';
import '../App.css';

class ListItem extends Component {
  render() {
    return (<div className="ListItem flexrow">
      <a className="data">{this.props.address}</a>
      <a className="data">{this.props.isOG}</a>
      <a className="data">{this.props.balance}</a>
      <div className="flexrow buttons">
      {
        !this.props.isOG
          ? <button className="resultButton data" onClick={this.props.toggleOG}>
              Make OG
            </button>
          : <button className="resultButton data" onClick={this.props.toggleOG}>
          Remove OG</button>
      }
      <button className="resultButton data" onClick={this.props.blacklist}>
      Blacklist
      </button>
      </div>
    </div>);
  }
}

export default ListItem;
