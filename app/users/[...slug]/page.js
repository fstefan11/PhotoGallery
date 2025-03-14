export default async function UserPage({ params }) {
  const slug = (await params).slug;
  return <div>Aceasta este pagina lui {slug} </div>;
}
