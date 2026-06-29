import { WinkButton } from "@/app/_components/wink-button";
import { db } from "../../../../lib/db";

export default async function UsersPage() {
  const users = await db.query.users.findMany();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Команда проекта</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="border-b pb-2">
            <span className="font-medium">{user.email}</span>
            <WinkButton name={user.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}
