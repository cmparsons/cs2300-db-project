import React, { Component } from 'react';
import { Button, Grid, Loader } from 'semantic-ui-react';
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
   * Navigate to the CreateCommunity page when user clicks on Create Community button
   */
  handleCreateCommunityClick = () => {
    this.props.history.push('/create-community');
  };

  /**
   * Deletes community based on community id when user clicks on X
   * @param id id of community to delete
   */
  handleDeleteCommunityClick = (id) => {
    this.props.communityStore.deleteCommunity(id);
  };

  render() {
    const { communityStore } = this.props;

    // We are currently fetching data from server, so show loader in the meantime
    if (communityStore.isFetching) {
      return <Loader active />;
    }

    return (
      <React.Fragment>
        <Grid container>
          <Grid.Column width={8}>
            <CommunityList
              header="Communities"
              communities={communityStore.communities}
              onCommunityClick={this.handleCommunityClick}
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <CommunityList
              header="My Communities"
              communities={communityStore.myCommunities}
              onDeleteClick={this.handleDeleteCommunityClick}
              showDeleteIcon
            />
            <div style={{ paddingTop: 10 }}>
              <Button
                primary
                content="Create Community"
                onClick={this.handleCreateCommunityClick}
              />
            </div>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    );
  }
}
