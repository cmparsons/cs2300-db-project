import React from 'react';
import { Button, Feed, Icon, Grid, List, Divider, Header, Segment } from 'semantic-ui-react';

// TODO: Replace with actual component logic. Currently just placeholder.
export default () => (
  <React.Fragment>
    <Grid>
      <Grid.Column width={4}>
        <Header as="h3" attached="top" block>
          <Icon color="red" name="fire" />
          Top Communities
        </Header>
        <Segment attached>
          <List divided verticalAlign="middle">
            <List.Item>
              <List.Content>
                <List.Header as="a">Daniel Louise</List.Header>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Header as="a">Stevie Feliciano</List.Header>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Header as="a">Elliot Fu</List.Header>
              </List.Content>
            </List.Item>
          </List>
        </Segment>
      </Grid.Column>
      <Grid.Column width={8}>
        <Header as="h1" textAlign="center" content="General" />
        <Feed>
          <Feed.Event>
            <Feed.Label />
            <Feed.Content>
              <Feed.Summary>
                <Feed.User>Elliot Fu</Feed.User> added you as a friend
                <Feed.Date>1 Hour Ago</Feed.Date>
              </Feed.Summary>
              <Feed.Meta>
                <Feed.Like>
                  <Icon name="like" />
                  4 Likes
                </Feed.Like>
              </Feed.Meta>
            </Feed.Content>
          </Feed.Event>

          <Divider section />

          <Feed.Event>
            <Feed.Label />
            <Feed.Content>
              <Feed.Summary>
                <Feed.Date>4 days ago</Feed.Date>
              </Feed.Summary>
              <Feed.Extra />
              <Feed.Meta>
                <Feed.Like>
                  <Icon name="like" />
                  1 Like
                </Feed.Like>
              </Feed.Meta>
            </Feed.Content>
          </Feed.Event>

          <Divider section />

          <Feed.Event>
            <Feed.Label />
            <Feed.Content>
              <Feed.Summary date="2 Days Ago" user="Jenny Hess" content=" add you as a friend" />
              <Feed.Meta>
                <Feed.Like>
                  <Icon name="like" />
                  8 Likes
                </Feed.Like>
              </Feed.Meta>
            </Feed.Content>
          </Feed.Event>

          <Divider section />

          <Feed.Event>
            <Feed.Label />
            <Feed.Content>
              <Feed.Summary>
                <a>Joe Henderson</a> posted on his page
                <Feed.Date>3 days ago</Feed.Date>
              </Feed.Summary>
              <Feed.Extra text>
                Ours is a life of constant reruns. We're always circling back to where we'd we
                started, then starting all over again. Even if we don't run extra laps that day, we
                surely will come back for more of the same another day soon.
              </Feed.Extra>
              <Feed.Meta>
                <Feed.Like>
                  <Icon name="like" />
                  5 Likes
                </Feed.Like>
              </Feed.Meta>
            </Feed.Content>
          </Feed.Event>

          <Divider section />

          <Feed.Event>
            <Feed.Label />
            <Feed.Content>
              <Feed.Summary>
                <a>Justen Kitsune</a> added <a>2 new photos</a> of you
                <Feed.Date>4 days ago</Feed.Date>
              </Feed.Summary>
              {/* <Feed.Extra images> */}
              <div>
                <img src="http://hanassets.nd.gov/images/product/test.png" alt="" />
              </div>
              {/* </Feed.Extra> */}
              <Feed.Meta>
                <Feed.Like>
                  <Icon name="like" />
                  41 Likes
                </Feed.Like>
              </Feed.Meta>
            </Feed.Content>
          </Feed.Event>

          <Divider section />
        </Feed>
      </Grid.Column>
      <Grid.Column width={4}>
        <Header as="h3" attached="top" block>
          <Icon color="red" name="fire" />
          Trending
        </Header>
        <Segment attached>
          <List divided verticalAlign="middle">
            <List.Item>
              <List.Content>
                <List.Header as="a">Daniel Louise</List.Header>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Header as="a">Stevie Feliciano</List.Header>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Header as="a">Elliot Fu</List.Header>
              </List.Content>
            </List.Item>
          </List>
        </Segment>
        <Header as="h3" attached="top" block>
          <Icon color="red" name="fire" />
          Trending
        </Header>
        <Segment attached>
          <List divided verticalAlign="middle">
            <List.Item>
              <List.Content>
                <List.Header as="a">Daniel Louise</List.Header>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Header as="a">Stevie Feliciano</List.Header>
              </List.Content>
            </List.Item>
            <List.Item>
              <List.Content>
                <List.Header as="a">Elliot Fu</List.Header>
              </List.Content>
            </List.Item>
          </List>
        </Segment>
        <div style={{ paddingTop: 10 }}>
          <Button primary content="Make Post" />
        </div>
      </Grid.Column>
    </Grid>
  </React.Fragment>
);
