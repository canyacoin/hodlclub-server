import React, {Component} from 'react';
import '../App.css';
// import SweetAlert from 'sweetalert'
import swal from 'sweetalert'
// import 'sweetalert/dist/sweetalert.css'

class ListItem extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

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
        <button onClick={() => swal({title: "Are you sure?", text: "Once deleted, you will not be able to recover this imaginary file!", icon: "warning", buttons: true, dangerMode: true}).then((willDelete) => {
            if (willDelete) {
              swal("Poof! Your imaginary file has been deleted!", {icon: "success"});
            } else {
              swal("Your imaginary file is safe!");
            }
          }
        )}/>
      </div>
    </div>);
  }
}

export default ListItem;
