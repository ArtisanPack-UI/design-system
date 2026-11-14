import { Avatar, Badge, List, ListItem } from '@artisanpack-ui/react';

interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function PeopleExample({ members }: { members: Member[] }) {
  return (
    <List variant="bordered">
      {members.map((member) => (
        <ListItem
          key={member.id}
          title={member.name}
          description={member.email}
          href={`/members/${member.id}`}
          leading={<Avatar name={member.name} />}
          trailing={<Badge>{member.role}</Badge>}
        />
      ))}
    </List>
  );
}
