import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <DropdownMenu label="Options" onSelect={(value) => console.log(value)}>
      <DropdownMenuGroup label="Listing">
        <DropdownMenuItem value="edit" icon="pencil" shortcut="E">
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem value="duplicate" icon="copy">
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem value="archive" disabled>
          Archive
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem value="delete" icon="trash" color="error">
        Delete
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
