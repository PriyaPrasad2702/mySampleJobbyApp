import {Link} from 'react-router-dom'
const JobItem = props => {
  const {jobDetails} = props
  const {
    id,
    companyLogoUrl,
    jobDescription,
    title,
    rating,
    packagePerAnnum,
    location,
    employmentType,
  } = jobDetails
  return (
    <Link to={`/jobs/${id}`}>
      <li className="job-card">
        <div className="top-container">
          <img src={companyLogoUrl} alt="company logo" />
          <div className="head-container">
            <h1>{title}</h1>
            <p>{rating}</p>
          </div>
        </div>
        <div className="middle-container">
          <p>{location}</p>
          <p>{employmentType}</p>
          <p>{packagePerAnnum}</p>
        </div>
        <h1 />
        <div className="bottom-container">
          <h1>Description</h1>
          <p>{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}
export default JobItem
