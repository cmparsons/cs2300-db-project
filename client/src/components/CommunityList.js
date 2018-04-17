import React from 'react';
import { Icon, List, Segment, Header } from 'semantic-ui-react';

const CommunityList = ({ communities, onCommunityClick }) => (
  <React.Fragment>
    <Header as="h3" attached="top" block>
      <Icon name="users" />
      Top Communities
    </Header>
    <Segment attached>
      <List verticalAlign="middle" selection animated>
        {communities && communities.length
          ? communities.map(c => (
            <List.Item key={c.id} onClick={() => onCommunityClick(c.id)}>
              <List.Content>
                <List.Header>{c.name}</List.Header>
              </List.Content>
            </List.Item>
            ))
          : null}
      </List>
    </Segment>
  </React.Fragment>
);

export default CommunityList;
