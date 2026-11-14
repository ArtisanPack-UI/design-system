import { Carousel } from '@artisanpack-ui/react';

const properties = [
  {
    image: '/photos/cedarwood.jpg',
    alt: 'Cedarwood Estates from the street',
    title: 'Cedarwood Estates',
    description: 'United States, New York',
  },
  {
    image: '/photos/lakeview.jpg',
    alt: 'Lakeview Lofts from the lake',
    title: 'Lakeview Lofts',
    description: 'United States, Chicago',
  },
  {
    image: '/photos/oaks.jpg',
    alt: 'Tranquil Oaks garden',
    title: 'Tranquil Oaks',
    description: 'Canada, Toronto',
  },
  {
    image: '/photos/golden.jpg',
    alt: 'Golden Hour at sunset',
    title: 'Golden Hour',
    description: 'United States, Denver',
  },
];

export default function BasicExample() {
  return <Carousel title="Featured properties" perView={3} slides={properties} />;
}
