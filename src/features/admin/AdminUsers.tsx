import { errorMessage } from "../../api/client";
import { ErrorMessage, Loading, PageTitle } from "../../components/common/Common";
import { Icon } from "../../components/common/Icon";
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
      <PageTitle eyebrow="ניהול" title="ניהול משתמשים" />
      {deleteUser.isError && <p role="alert">{errorMessage(deleteUser.error, "המחיקה נכשלה.")}</p>}

      <div className="card table-card">
        <div className="table-wrap">
          <table className="table">
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
                  <td>
                    <span className="user-cell">
                      <span className="avatar" aria-hidden="true">
                        {user.name.trim().charAt(0)}
                      </span>
                      {user.name}
                    </span>
                  </td>
                  <td dir="ltr">{user.email}</td>
                  <td>
                    <span className={`role-pill ${user.role === "ADMIN" ? "role-admin" : ""}`}>
                      {user.role === "ADMIN" ? "מנהל" : "משתמש"}
                    </span>
                  </td>
                  <td>
                    {user.role !== "ADMIN" && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        disabled={deleteUser.isPending}
                        onClick={() => handleDelete(user.id, user.name)}
                      >
                        <Icon name="trash" size={16} />
                        מחיקה
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
