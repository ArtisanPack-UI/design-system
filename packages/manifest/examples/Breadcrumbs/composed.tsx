import { Breadcrumbs, BreadcrumbsItem } from '@artisanpack-ui/react';

export default function ComposedExample({
  folder,
  onRoot,
}: {
  folder: string;
  onRoot: () => void;
}) {
  return (
    <Breadcrumbs>
      <BreadcrumbsItem
        label="All media"
        href="#"
        onClick={(event) => {
          event.preventDefault();
          onRoot();
        }}
      />
      <BreadcrumbsItem label={folder} />
    </Breadcrumbs>
  );
}
