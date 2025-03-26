import './index.css'
import {Link} from 'react-router-dom'

const JobItem = props => {
  const {jobDataItem} = props
  const {
    employmentType,
    companyLogoUrl,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobDataItem

  return (
    <Link className="link" to={`/jobs/${id}`}>
      <li>
        <div className="job-card">
          <div className="card-title-section">
            <img src={companyLogoUrl} alt="job details company logo" />
            <div>
              <h1>{title}</h1>
              <p>🌟{rating}</p>
            </div>
          </div>
          <div className="location-work-container">
            <div>
              <p>
                🏨
                {location}
              </p>
              <p>⏳{employmentType}</p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <h1>Description</h1>
          <p className="description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobItem
