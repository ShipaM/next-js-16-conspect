type UsersPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UsersPage({ params }: UsersPageProps) {
  const { id } = await params;

  return <div>User with id {id}</div>;
}
