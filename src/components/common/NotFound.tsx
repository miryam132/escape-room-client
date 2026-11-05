import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="not-found-code" aria-hidden="true">
        404
      </p>
      <h1>404 - הדף לא נמצא</h1>
      <p>הדף שחיפשת אינו קיים.</p>
      <Link to="/" className="btn btn-primary">
        חזרה לדף הבית
      </Link>
    </div>
  );
}
