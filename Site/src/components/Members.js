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
    this.sortList = this.sortList.bind(this)
    this.state = {
      sort: '',
      hodlClub: this.props.hodlClub
    }
  }

  componentWillReceiveProps (props) {
    this.setState({ hodlClub: props.hodlClub })
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevState.sort !== this.state.sort) {
      this.sortList()
    }
  }

  setSort (by) {
    if (by === 'days') {
      this.setState({ sort: 'days' })
    } else if (by === 'balance') {
      this.setState({ sort: 'balance' })
    }
  }

  sortList () {
    let sortBy = this.state.sort
    let currentList = this.state.hodlClub
    let newList = []
    if (sortBy === 'days') {
      newList = _.sortBy(currentList, [(hodler) => hodler.becameHodlerAt])
    } else if (sortBy === 'balance') {
      newList = _.sortBy(currentList, [(hodler) => hodler.balance]).reverse()
    }
    this.setState({ hodlClub: newList })
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
