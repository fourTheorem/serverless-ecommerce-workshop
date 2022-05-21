import { Link } from "react-router-dom"
import { Gig } from "../types"

function GigCard(props: { gig: Gig }) {
  const { gig } = props

  return <div className="card" style={{ height: "100%" }}>
    <div className="card-image">
      <figure className="image is-3by1">
        <Link to={`/gig/${gig.id}`}>
          <img className="card-img-top" src={`/images/${gig.image}`} alt={gig.bandName} />
        </Link>
      </figure>
    </div>
    <div className="card-content">
      <div className="media-content">
        <p className="title is-4">{gig.bandName}, {gig.city} ({gig.year})</p>
        <p className="subtitle is-6">{gig.date}</p>
        <Link to={`/gig/${gig.id}`} className="btn btn-primary">Get tickets</Link>
      </div>
    </div>
  </div>
}

export default GigCard