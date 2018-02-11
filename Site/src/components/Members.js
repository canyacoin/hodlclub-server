import React from 'react';
import './App.css';
import ListItem from './ListItem'
import SearchAddress from './SearchAddress'
import ListHeader from './ListHeader'
import InfiniteScroll from 'react-infinite-scroller'
import _ from 'lodash'

class Members extends React.Component {

  constructor (props) {
    super(props)
    this.setSort = this.setSort.bind(this)
    this.state = {
      sort: '',
      hodlClub: this.props.hodlClub
    }
  }

  componentWillReceiveProps (props) {
    this.setState({ hodlClub: props.hodlClub })
  }

  setSort (by) {
    if (by === 'days') {
      this.setState({ sort: 'days' })
      this.props.loadMore(0, 'days')
    } else if (by === 'balance') {
      this.setState({ sort: 'balance' })
      this.props.loadMore(0, 'balance')
    }
  }

  render() {
    return (
      <div className="Members">
        <SearchAddress search={this.props.search} />
        {
          <ListHeader sort={this.setSort} />
        }
        <InfiniteScroll
          pageStart={0}
          loadMore={async (page) => {
            await this.props.loadMore()
          }}
          hasMore={this.props.moreToLoad}
          loader={<div className="loader" key={0}>Loading ...</div>}
          useWindow={true}
        >
          { this.state.hodlClub.map((hodler, index) => <ListItem hodler={hodler} key={index} />) }
        </InfiniteScroll>
      </div>
    )
  }
}

export default Members;
