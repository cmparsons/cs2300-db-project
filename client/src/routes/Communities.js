import React, { Component } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';

import CommunityList from '../components/CommunityList';

@inject('communityStore')
@observer
export default class Communities extends Component {
  async componentDidMount() {
    await this.props.communityStore.fetchAllCommunities();
  }

  handleCommunityClick = (id) => {
    this.props.history.push(`/community/${id}`);
  };

  render() {
    const { communityStore } = this.props;

    return (
      <Grid container>
        <Grid.Column width={8}>
          {communityStore.isLoading ? (
            <Loader />
          ) : (
            <CommunityList
              communities={communityStore.communities}
              onCommunityClick={this.handleCommunityClick}
            />
          )}
        </Grid.Column>
        <Grid.Column width={8}>
          {communityStore.isLoading ? (
            <Loader />
          ) : (
            <CommunityList
              communities={communityStore.communities}
              onCommunityClick={this.handleCommunityClick}
            />
          )}
        </Grid.Column>
      </Grid>
    );
  }
}
