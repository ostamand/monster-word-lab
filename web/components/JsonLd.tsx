export default function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Monster Word Lab',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'A fun language learning experiment for kids to learn reading in English, Spanish, and French.',
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      audienceType: 'child',
    },
    inLanguage: ['en', 'es', 'fr'],
    learningResourceType: 'Practice',
    isAccessibleForFree: true,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
