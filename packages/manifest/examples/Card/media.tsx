import { Card } from '@artisanpack-ui/react';

export default function MediaExample() {
  return (
    <Card
      media="/images/listing.jpg"
      mediaAlt="The front of a brick townhouse"
      title="24 Harbor Street"
      description="3 bedrooms · 2 baths"
    >
      Listed this week. Open house on Saturday.
    </Card>
  );
}
