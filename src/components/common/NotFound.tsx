import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404 - הדף לא נמצא</h1>
      <p>הדף שחיפשת אינו קיים.</p>
      <Link to="/">חזרה לדף הבית</Link>
    </div>
  );
}
