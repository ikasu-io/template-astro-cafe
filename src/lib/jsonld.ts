// Structured data (schema.org) so search engines can show the opening
// hours, address and events directly in results.
import type { CollectionEntry } from 'astro:content';
import type { Site } from './site';

export function cafeJsonLd(site: Site, base: URL) {
  return {
    '@type': 'CafeOrCoffeeShop',
    name: site.name,
    description: site.description,
    url: base.href,
    telephone: site.phone,
    email: site.email,
    servesCuisine: ['British', 'Bakery', 'Seafood'],
    priceRange: '££',
    hasMenu: new URL('/menu', base).href,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.town,
      addressCountry: 'GB',
    },
    openingHoursSpecification: site.hours.flatMap((d) =>
      'closed' in d ? [] : [{ '@type': 'OpeningHoursSpecification', dayOfWeek: d.day, opens: d.open, closes: d.close }],
    ),
  };
}

export function eventJsonLd(event: CollectionEntry<'events'>, site: Site, base: URL) {
  const { title, date, time, endTime, summary, price } = event.data;
  const day = date.toISOString().slice(0, 10);
  const amount = price.match(/[\d.]+/)?.[0] ?? '0';
  return {
    '@type': 'Event',
    name: title,
    description: summary,
    startDate: `${day}T${time}`,
    ...(endTime && { endDate: `${day}T${endTime}` }),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    url: new URL(`/events/${event.id}`, base).href,
    location: {
      '@type': 'Place',
      name: site.name,
      address: { '@type': 'PostalAddress', streetAddress: site.address.street, addressLocality: site.address.town, addressCountry: 'GB' },
    },
    offers: { '@type': 'Offer', price: amount, priceCurrency: 'GBP' },
    organizer: { '@type': 'Organization', name: site.name, url: base.href },
  };
}
