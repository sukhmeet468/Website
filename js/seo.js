/* ═══════════════════════════════════════════════════════════════
   INDUS AUTOMATION — SEO & Structured Data Module
   Generates JSON-LD schema markup for Google, Bing, and AI engines.
   Each page calls injectStructuredData() with its page type.
   ═══════════════════════════════════════════════════════════════ */

const COMPANY = {
  name: 'Indus Automation Inc.',
  url: 'https://www.indusautomation.ca', // ← UPDATE to your real domain
  logo: 'https://www.indusautomation.ca/assets/images/logo.png',
  phone: '+1-204-943-0050',
  email: 'info@indusautomation.ca',
  address: {
    street: '1-442 Higgins Avenue',
    city: 'Winnipeg',
    province: 'MB',
    postal: 'R3A 1S5',
    country: 'CA',
  },
  geo: { lat: 49.8989, lng: -97.1378 },
  hours: ['Mo-Fr 08:00-16:30'],
  social: [
    // Add your social URLs here:
    // 'https://www.linkedin.com/company/indus-automation',
    // 'https://www.facebook.com/indusautomation',
  ],
  description: 'Full-service industrial automation company in Winnipeg, MB. Custom control panel design, PLC/HMI/SCADA programming, commissioning, and 24/7 support.',
};

/* ─── INJECT STRUCTURED DATA ─── */
function injectStructuredData(pageType, pageData = {}) {
  const schemas = [];

  // Always include Organization
  schemas.push(getOrganizationSchema());

  // Always include LocalBusiness
  schemas.push(getLocalBusinessSchema());

  // Page-specific schemas
  switch (pageType) {
    case 'home':
      schemas.push(getWebSiteSchema());
      schemas.push(getBreadcrumbSchema([{ name: 'Home', url: '/' }]));
      break;

    case 'services':
      schemas.push(getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Services', url: '/services.html' },
      ]));
      break;

    case 'service-detail':
      schemas.push(getServiceSchema(pageData));
      schemas.push(getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Services', url: '/services.html' },
        { name: pageData.title, url: pageData.url },
      ]));
      break;

    case 'specialties':
      schemas.push(getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Specialties', url: '/specialties.html' },
      ]));
      break;

    case 'contact':
      schemas.push(getBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Contact Us', url: '/contact.html' },
      ]));
      break;
  }

  // Inject all schemas
  schemas.forEach(schema => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  });
}

/* ─── SCHEMAS ─── */
function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.name,
    url: COMPANY.url,
    logo: COMPANY.logo,
    telephone: COMPANY.phone,
    email: COMPANY.email,
    address: getAddressSchema(),
    sameAs: COMPANY.social,
    description: COMPANY.description,
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: COMPANY.geo.lat, longitude: COMPANY.geo.lng },
      geoRadius: '500000',
    },
  };
}

function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ElectricalContractor',
    name: COMPANY.name,
    url: COMPANY.url,
    image: COMPANY.logo,
    telephone: COMPANY.phone,
    email: COMPANY.email,
    address: getAddressSchema(),
    geo: { '@type': 'GeoCoordinates', latitude: COMPANY.geo.lat, longitude: COMPANY.geo.lng },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '16:30',
    },
    priceRange: '$$',
    description: COMPANY.description,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Industrial Automation Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Control Panel Design & Fabrication' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'PLC/HMI/SCADA Programming' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Commissioning' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Troubleshooting & Maintenance' } },
      ],
    },
  };
}

function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: COMPANY.name,
    url: COMPANY.url,
    description: COMPANY.description,
    publisher: { '@type': 'Organization', name: COMPANY.name },
  };
}

function getServiceSchema(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: data.title,
    description: data.description,
    provider: { '@type': 'Organization', name: COMPANY.name },
    areaServed: { '@type': 'Place', name: 'Manitoba, Canada' },
    url: COMPANY.url + data.url,
  };
}

function getBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: COMPANY.url + item.url,
    })),
  };
}

function getAddressSchema() {
  return {
    '@type': 'PostalAddress',
    streetAddress: COMPANY.address.street,
    addressLocality: COMPANY.address.city,
    addressRegion: COMPANY.address.province,
    postalCode: COMPANY.address.postal,
    addressCountry: COMPANY.address.country,
  };
}
