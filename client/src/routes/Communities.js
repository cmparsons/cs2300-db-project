import React, { Component } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';

import CommunityList from '../components/CommunityList';

@inject('communityStore')
@observer
export default class Communities extends Component {
  /**
   * React lifecycle method called when the component is mounted onto the DOM
   * Fetch all communities from server and save the data in the community store
   */
  async componentDidMount() {
    await this.props.communityStore.fetchAllCommunities();
  }

  /**
   * Navigate to page of community's posts when user clicks on community
   * @param id community id
   */
  handleCommunityClick = (id) => {
    this.props.history.push(`/community/${id}`);
  };

  render() {
    const { communityStore } = this.props;

    // We are currently fetching data from server, so show loader in the meantime
    if (communityStore.isLoading) {
      return <Loader />;
    }

    return (
      <Grid container>
        <Grid.Column width={8}>
          <CommunityList
            header="Top Communities"
            communities={communityStore.communities}
            onCommunityClick={this.handleCommunityClick}
          />
        </Grid.Column>
        <Grid.Column width={8}>
          <CommunityList
            header="My Communities"
            communities={communityStore.myCommunities}
            onCommunityClick={this.handleCommunityClick}
          />
        </Grid.Column>
      </Grid>
    );
  }
}
