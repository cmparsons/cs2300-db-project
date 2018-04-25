import React, { Fragment } from 'react';
import { Header, List, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default function LeaderList({
  header, items, icon, iconColor,
}) {
  return (
    <Fragment>
      <Header as="h3" attached="top" block>
        <Icon color={iconColor} name={icon} />
        {header}
      </Header>
      <Segment attached>
        <List divided verticalAlign="middle" ordered>
          {items.map(item => (
            <List.Item key={item.id}>
              <List.Content>
                <List.Header as={Link} to={item.route} content={item.header} />
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Segment>
    </Fragment>
  );
}
