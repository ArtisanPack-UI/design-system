import { Card, Carousel, Text } from '@artisanpack-ui/react';

const quotes = [
  { text: 'Weekly digests replaced three spreadsheets for our team.', author: 'Property manager' },
  { text: 'Tenants find what they need without calling us.', author: 'Leasing lead' },
  { text: 'Setup took an afternoon.', author: 'Operations director' },
];

export default function CustomExample() {
  return (
    <Carousel
      label="Customer notes"
      slides={quotes}
      autoplay
      loop
      renderSlide={(quote) => (
        <Card>
          <Text size="lg">{quote.text}</Text>
          <Text size="sm" tone="muted">
            {quote.author}
          </Text>
        </Card>
      )}
    />
  );
}
