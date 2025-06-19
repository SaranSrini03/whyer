// app/test/[slug]/page.tsx
export default function TestSlugPage({ params }: { params: { slug: string } }) {
  return <div className="text-white text-2xl">Slug: {params.slug}</div>;
}
