import { Link } from "react-router-dom";
import { Eye } from "./Eye";

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="not-found-code" aria-hidden="true">
        4<Eye className="not-found-eye" />4
      </p>
      <h1>404 - הדף לא נמצא</h1>
      <p>הדף שחיפשת אינו קיים.</p>
      <Link to="/" className="btn btn-primary">
        חזרה לדף הבית
      </Link>
    </div>
  );
}
