import React from 'react';
import './App.css';
import ListItem from './ListItem'
import SearchAddress from './SearchAddress'
import ListHeader from './ListHeader'
import InfiniteScroll from 'react-infinite-scroller'

class Members extends React.Component {

  render() {
    return (<div className="Members">
      <SearchAddress search={this.props.search}/>
      <ListHeader />
      <InfiniteScroll
        pageStart={0}
        loadMore={async (page) => {
          let result = await this.props.loadMore()
        }}
        hasMore={this.props.moreToLoad}
        loader={<div className="loader" key={0}>Loading ...</div>}
        useWindow={true}
      >
        {
          this.props.hodlClub.map((hodler, index) => {
            return (<ListItem hodler={hodler} key={index} />)
          })
        }
      </InfiniteScroll>
    </div>);
  }
}

export default Members;
