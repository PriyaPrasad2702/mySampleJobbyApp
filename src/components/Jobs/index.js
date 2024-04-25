import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobItem from '../JobItem'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class Jobs extends Component {
  state = {
    profile: {},
    searchInput: '',
    jobsList: [],
    salaryRange: '',
    employementType: [],
    profileStatus: apiConstants.initial,
    jobListStatus: apiConstants.initial,
  }
  componentDidMount() {
    this.getProfileDetails()
    this.getJobsList()
  }
  getJobsList = async () => {
    const {searchInput, salaryRange, employementType} = this.state
    const typeofEmployment = employementType.join(',')
    //console.log(typeofEmployment)
    //console.log(typeof(typeofEmployment))
    this.setState({jobListStatus: apiConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${typeofEmployment}&minimum_package=${salaryRange}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const fetchedData = await response.json()
    if (response.ok) {
      const jobsDetails = fetchedData.jobs.map(eachJob => {
        return {
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          packagePerAnnum: eachJob.package_per_annum,
          rating: eachJob.rating,
          title: eachJob.title,
        }
      })
      this.setState({
        jobsList: jobsDetails,
        jobListStatus: apiConstants.success,
      })
    } else {
      this.setState({jobListStatus: apiConstants.failure})
    }
  }
  onRetryJobs = () => {
    this.getJobsList()
  }
  renderJobFailureView = () => {
    return (
      <div className="failure-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button type="button" onClick={this.onRetryJobs}>
          Retry
        </button>
      </div>
    )
  }
  renderJobs = () => {
    const {jobListStatus} = this.state
    switch (jobListStatus) {
      case apiConstants.success:
        return this.renderJobsuccessView()
      case apiConstants.failure:
        return this.renderJobFailureView()
      case apiConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  renderJobsuccessView = () => {
    const {jobsList} = this.state
    console.log(jobsList.length)
    if (jobsList.length == 0) {
      return (
        <div>
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters.</p>
        </div>
      )
    }
    return (
      <div>
        <ul className="list-container">
          {jobsList.map(eachJob => {
            return <JobItem key={eachJob.id} jobDetails={eachJob} />
          })}
        </ul>
      </div>
    )
  }
  getProfileDetails = async () => {
    this.setState({profileStatus: apiConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const profileData = await response.json()
    if (response.ok) {
      const profileDetails = {
        name: profileData.profile_details.name,
        profileImageUrl: profileData.profile_details.profile_image_url,
        shortBio: profileData.profile_details.short_bio,
      }
      this.setState({
        profile: profileDetails,
        profileStatus: apiConstants.success,
      })
    } else {
      this.setState({profileStatus: apiConstants.failure})
    }
  }
  renderProfile = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case apiConstants.success:
        return this.renderProfileSuccessView()
      case apiConstants.failure:
        return this.renderProfileFailureView()
      case apiConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  renderProfileSuccessView = () => {
    const {profile} = this.state
    const {name, profileImageUrl, shortBio} = profile
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="profile-name">{name}</h1>
        <p className="bio">{shortBio}</p>
      </div>
    )
  }
  onRetry = () => {
    this.getProfileDetails()
  }
  renderProfileFailureView = () => {
    return (
      <div className="failure-view">
        <button type="button" className="retry-btn" onClick={this.onRetry}>
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
  changeSearchInput = event => {
    this.setState({searchInput: event.target.value}, this.getJobsList)
  }
  updateCheckboxEmployment = event => {
    if (event.target.checked) {
      this.setState(
        prevState => ({
          employementType: [...prevState.employementType, event.target.value],
        }),
        this.getJobsList,
      )
    } else {
      this.setState(
        prevState => ({
          employementType: prevState.employementType.filter(
            type => type !== event.target.value,
          ),
        }),
        this.getJobsList,
      )
    }
  }
  renderEmployementFilters = () => {
    return (
      <div className="employement-filters-container">
        <h1>Type Of Employment</h1>
        <ul className="list-container">
          {employmentTypesList.map(type => {
            return (
              <li key={type.employmentTypeId} className="list-item">
                <input
                  type="checkbox"
                  name="employment"
                  value={type.employmentTypeId}
                  id={employmentTypesList}
                  onChange={this.updateCheckboxEmployment}
                />
                <label htmlFor={type.employmentTypeId}>{type.label}</label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
  updateSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobsList)
  }
  renderSalaryRangeFilters = () => {
    return (
      <div className="salary-container">
        <h1>Salary Range</h1>
        <ul className="list-container">
          {salaryRangesList.map(range => {
            return (
              <li className="list-item" key={range.salaryRangeId}>
                <input
                  type="radio"
                  id={range.salaryRangeId}
                  name="salary"
                  value={range.salaryRangeId}
                  onChange={this.updateSalaryRange}
                />
                <label htmlFor={range.salaryRangeId}>{range.label}</label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
  getSearchResults = event => {
    this.getJobsList()
  }
  render() {
    const {searchInput, jobsList} = this.state
    console.log(jobsList)
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="container-1">
            {this.renderProfile()}
            {this.renderEmployementFilters()}
            {this.renderSalaryRangeFilters()}
          </div>
          <div className="jobs-container">
            <div className="search-container">
              <input
                type="search"
                value={searchInput}
                onChange={this.changeSearchInput}
                placeholder="Search"
              />
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.getSearchResults}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
