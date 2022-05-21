import { Link } from "react-router-dom"

function NotFound() {
  return <div className="content">
    <h1>Page not found</h1>
    <Link to="/">Go back to the Homa page</Link>
  </div>
}

export default NotFound