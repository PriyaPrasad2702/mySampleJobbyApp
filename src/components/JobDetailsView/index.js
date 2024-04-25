import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import Loader from 'react-loader-spinner'
const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class JobDetailsView extends Component {
  state = {
    jobDetails: {},
    similarJobDetails: [],
    apiStatus: apiConstants.initial,
  }
  componentDidMount() {
    this.getJobDetails()
  }
  formatjobData = fetchedData => ({
    companyLogoUrl: fetchedData.company_logo_url,
    companyWebSiteUrl: fetchedData.company_website_url,
    employmentType: fetchedData.employment_type,
    id: fetchedData.id,
    jobDescription: fetchedData.job_description,
    skills: fetchedData.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
    lifeAtCompany: {
      description: fetchedData.life_at_company.description,
      imageUrl: fetchedData.life_at_company.image_url,
    },
    location: fetchedData.location,
    packagePerAnnum: fetchedData.package_per_annum,
    rating: fetchedData.rating,
  })
  formatSimilarJob = eachJob => ({
    companyLogoUrl: eachJob.company_logo_url,
    employmentType: eachJob.employment_type,
    id: eachJob.id,
    jobDescription: eachJob.job_description,
    location: eachJob.location,
    rating: eachJob.rating,
    title: eachJob.title,
  })
  getJobDetails = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const fetchedData = await response.json()
    console.log(fetchedData)
    if (response.ok) {
      const updatedJobData = this.formatjobData(fetchedData.job_details)

      const updatedSimilarJobs = fetchedData.similar_jobs.map(eachJob =>
        this.formatSimilarJob(eachJob),
      )

      this.setState({
        jobDetails: updatedJobData,
        similarJobDetails: updatedSimilarJobs,
        apiStatus: apiConstants.success,
      })
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }
  renderSuccessView = () => {
    const {jobDetails, similarJobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebSiteUrl,
      employmentType,
      location,
      packagePerAnnum,
      skills,
      rating,
      jobDescription,
      lifeAtCompany,
    } = jobDetails
    //const {description,imageUrl}=lifeAtCompany
    //console.log(description)
    return (
      <>
        <Header />
        <div className="job-details-container">
          <div className="top-container">
            <img src={companyLogoUrl} alt="job details company logo" />
            <div className="head-container">
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
            <div>
              <h1>Description</h1>
              <a href={companyWebSiteUrl}>Visit</a>
            </div>
            <p>{jobDescription}</p>
          </div>
          <div className="skills-container">
            <h1>Skills</h1>
          </div>
          <h1>Life at Company </h1>
          <div className="similar-jobs-container">
            <h1>Similar Jobs</h1>
            <ul className="outer-container">
              {similarJobDetails.map(job => {
                return (
                  <li key={job.id}>
                    <div className="top-container">
                      <img
                        src={job.companyLogoUrl}
                        alt="similar job company logo"
                      />
                      <div className="head-container">
                        <h1>{job.title}</h1>
                        <p>{job.rating}</p>
                      </div>
                    </div>
                    <h1>Description</h1>
                    <p>{job.jobDescription}</p>
                    <div className="middle-container">
                      <p>{job.location}</p>
                      <p>{job.employmentType}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </>
    )
  }
  onRetry = () => {
    this.getJobDetails()
  }
  renderFailureView = () => {
    return (
      <div className="failure-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button type="button" onClick={this.onRetry}>
          Retry
        </button>
      </div>
    )
  }
  renderLoadingView = () => {
    return (
      <div className="loader-container" data-testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    )
  }
  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return this.renderSuccessView()
      case apiConstants.failure:
        return this.renderFailureView()
      case apiConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}
export default JobDetailsView
