import React, {Component} from 'react';
import '../App.css';
// import SweetAlert from 'sweetalert'
import swal from 'sweetalert'
import ApiService from '../services/Api'
// import 'sweetalert/dist/sweetalert.css'

class ListItem extends Component {

  render() {
    console.log(this.props)
    return (<div className="ListItem flexrow">
      <a className="data">{this.props.ethAddress}</a>
      <a className="data">{this.props.isOG}</a>
      <a className="data">{this.props.balance}</a>
      <div className="flexrow buttons">
      <button className="resultButton data" onClick={() => this.props.toggleOG(this.props.ethAddress)}>
        { !this.props.isOG ? 'Make OG' : 'Remove OG' }
      </button>
      <button className="resultButton data" onClick={() => this.toggleBlacklist(this.props.address)}>
        Blacklist
      </button>
        {
          // <button onClick={() => swal({
          //   title: "Are you sure?",
          //   text: "Once deleted, you will not be able to recover this imaginary file!", icon: "warning",
          //   buttons: true,
          //   dangerMode: true
          // }).then((willDelete) => {
          //     if (willDelete) {
          //       swal("Poof! Your imaginary file has been deleted!", {
          //         icon: "success"});
          //     } else {
          //       swal("Your imaginary file is safe!");
          //     }
          //   }
          // )}/>
        }
      </div>
    </div>);
  }
}

export default ListItem;
