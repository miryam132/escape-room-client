import { errorMessage } from "../../api/client";
import { ErrorMessage, Loading } from "../../components/common/Common";
import { useDeleteUser, useUsers } from "../../hooks/users";

export default function AdminUsers() {
  const { data, isPending, isError, error } = useUsers();
  const deleteUser = useDeleteUser();

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage errorMessage={errorMessage(error, "שגיאה בטעינת המשתמשים.")} />;

  function handleDelete(id: string, name: string) {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את המשתמש "${name}"?`)) deleteUser.mutate(id);
  }

  return (
    <>
      <h1>ניהול משתמשים</h1>
      {deleteUser.isError && <p role="alert">{errorMessage(deleteUser.error, "המחיקה נכשלה.")}</p>}

      <table>
        <thead>
          <tr>
            <th>שם</th>
            <th>אימייל</th>
            <th>תפקיד</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data.items.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td dir="ltr">{user.email}</td>
              <td>{user.role === "ADMIN" ? "מנהל" : "משתמש"}</td>
              <td>
                {user.role !== "ADMIN" && (
                  <button
                    type="button"
                    disabled={deleteUser.isPending}
                    onClick={() => handleDelete(user.id, user.name)}
                  >
                    מחיקה
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
