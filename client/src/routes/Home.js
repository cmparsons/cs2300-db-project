import React, { Component, Fragment } from 'react';
import { Button, Grid, Loader } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

import PostsList from '../components/PostsList';
import LeaderboardList from '../components/LeaderboardList';

@inject('communityStore', 'postStore')
@observer
export default class Home extends Component {
  async componentDidMount() {
    const communityId =
      this.props.match.params.communityId && parseInt(this.props.match.params.communityId, 10);
    if (communityId) {
      await this.props.postStore.fetchPostsForCommunity(communityId);
    } else {
      await this.props.postStore.fetchAllPosts();
    }
  }

  async componentDidUpdate(prevProps) {
    // If the community route changes, we should load new posts from a different community
    if (this.props.match.params.communityId !== prevProps.match.params.communityId) {
      const communityId =
        this.props.match.params.communityId && parseInt(this.props.match.params.communityId, 10);
      if (communityId) {
        await this.props.postStore.fetchPostsForCommunity(communityId);
      } else {
        await this.props.postStore.fetchAllPosts();
      }
    }
  }

  render() {
    const communityId =
      this.props.match.params.communityId && parseInt(this.props.match.params.communityId, 10);
    const { isFetching, isLoading, topCommunitiesLeaderboard } = this.props.communityStore;

    if (isFetching || isLoading) {
      return <Loader active />;
    }

    return (
      <Fragment>
        <Grid>
          <Grid.Column width={4}>
            <LeaderboardList
              header="Top Communities"
              icon="fire"
              iconColor="red"
              items={topCommunitiesLeaderboard}
            />
            {communityId && (
              <div style={{ paddingTop: 10 }}>
                <Button primary content="Make Post" as={Link} to={`/post-editor/${communityId}`} />
              </div>
            )}
          </Grid.Column>
          <Grid.Column width={8}>
            <PostsList
              posts={this.props.postStore.posts}
              communityName={this.props.communityStore.getCommunityName(communityId)}
            />
          </Grid.Column>
          <Grid.Column width={4} />
        </Grid>
      </Fragment>
    );
  }
}
