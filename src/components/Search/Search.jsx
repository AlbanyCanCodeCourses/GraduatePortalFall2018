import React, { Component } from "react";
import { FormGroup, FormControl, Button, Media, Image, Checkbox } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";

import Loading from "../Widgets/Loading";
import ErrorMessage from "../Widgets/ErrorMessage";
import noPic from "../../images/no-profile.svg";
import "./Search.css";

class Search extends Component {
  state = {
    searchInput: "",
    profiles: null, //local state after getting from store
    resumes: [],
    profileData: {
      _id: null,
      firstName: "",
      lastName: "",
      yearOfGrad: null,
      skills: [],
      story: "",
      phone: "",
      email: "",
      linkedin: "",
      github: "",
      website: "",
      image: "",
      resume: "",
      isActive: null
    }
  };

  handleChange = e => {
    this.setState({ searchInput: e.target.value }, () => this.filterProfiles());
  };

  handleCheckbox = (e, resume) => {
    if (e.target.checked) {
      if (!this.state.resumes.includes(resume)) {
        const newResumes = this.state.resumes.concat(resume);
        this.setState({
          resumes: newResumes
        });
      }
    } else {
      if (this.state.resumes.includes(resume)) {
        const newResumes = this.state.resumes.filter(batchResume => batchResume !== resume);
        this.setState({
          resumes: newResumes
        });
      }
    }
  }

  handleBatchDownload = e => {
    e.target.blur();
    this.props.batchDownload(this.state.resumes);
  }

  handleActivation = (e, id) => {
    e.target.blur();

    const newProfiles = this.state.profiles.map(profile => {
      if (profile._id.toString() === id.toString()) {
        profile.isActive = !(profile.isActive);
        return profile;
      }
      return profile;
    });
    const currentProfile = newProfiles.filter(profile => profile._id === id)[0];

    this.setState({
      profiles: newProfiles,
      profileData: {
        _id: currentProfile._id,
        firstName: currentProfile.firstName,
        lastName: currentProfile.lastName,
        yearOfGrad: currentProfile.yearOfGrad,
        skills: currentProfile.skills,
        story: currentProfile.story,
        phone: currentProfile.phone,
        email: currentProfile.links.email,
        linkedin: currentProfile.links.linkedin,
        github: currentProfile.links.github,
        website: currentProfile.links.website,
        image: currentProfile.image,
        resume: currentProfile.resume,
        isActive: currentProfile.isActive
      }
    }, () => {
      console.log(this.state.profileData);
      this.props.profileEdit(this.state.profileData)
    });
  }

  filterProfiles = () => {
    // store search input for use with backward navigation
    this.props.storeSearchInput(this.state.searchInput);

    // convert search input from a string to an array of terms without leading/trailing white space
    let searchTerms = this.state.searchInput
      .toLowerCase()
      .trim()
      .split(" ");

    // filter profiles 
    const profiles = Object.values(this.props.profiles).filter(profile => {
      if (!this.props.isAdmin && !profile.isActive) return false;

      // Process skils to match individual words rather than phrases.
      let profileSkills = profile.skills.reduce((arr, term) => {
        term = term.toLowerCase();
        if (term.includes(" ")) {
          term = term.split(" ");
        }
        return arr.concat(term);
      },[]
      );
      let profileNames = []
        .concat(profile.firstName.toLowerCase())
        .concat(profile.lastName.toLowerCase());
      for (let searchTerm of searchTerms) {
        for (let name of profileNames) {
          // step 1: compare each search term to first/last names for a partial match
          // (the regex escapes special characters so there are no errors when creating new RegExp)
          let nameSearchTerm = searchTerm.replace(/[^\w\s]/g, "\\$&");
          let searchTermRegex = new RegExp(nameSearchTerm, "i");
          if (searchTermRegex.test(name)) return true;
        }
        // step 2: if no name matches, the term MUST exactly match one of the skills
        if (!profileSkills.includes(searchTerm.toLowerCase())) return false;
      }
      return true;
    });

    return this.setState({ profiles });
  };

  addDefaultSrc(e) {
    e.target.src = noPic;
  }

  componentDidMount() {
    if (!this.state.profiles) {
      this.props.fetchAllProfiles().then(() => {
        this.setState(
          {
            searchInput: this.props.storedSearchInput,
            profiles: this.props.profiles
          },
          () => this.filterProfiles()
        );
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isAdmin !== prevProps.isAdmin) this.filterProfiles();
  }

  render() {
    return (
      <div className="search">
        {/* Header */}
        <div className="header-wrap container-fluid sticky">
          <header className="container grad-header">
            <div className="search-headline">
              <h1>Graduate Portal</h1>

              {/* Batch Download Button */}
                <Button
                  className="grad-btn grad-btn-secondary download-btn"
                  title="Download selected resumes"
                  bsSize="small"
                  onClick={e => this.handleBatchDownload(e)}
                >
                  <i className="fas fa-arrow-down"></i>
                </Button>

              {/* Add Profile Button */}
              {this.props.isAdmin && (
                <LinkContainer to="/profile/add">
                  <Button
                    className="grad-btn grad-btn-admin add-btn"
                    title="Add new graduate profile"
                    bsSize="small"
                  >
                    +
                  </Button>
                </LinkContainer>
              )}
            </div>

            {/* Filter Profiles Input */}
            <div className="search-input">
              <FormGroup>
                <span className="search-icon">
                  <i className="fas fa-search" />
                </span>

                <FormControl
                  type="text"
                  className="login-input"
                  placeholder="Filter graduates by name or skills"
                  aria-label="Search Input"
                  value={this.state.searchInput}
                  onChange={e => this.handleChange(e)}
                />
              </FormGroup>
            </div>
          </header>
        </div>

        {/* Profiles List */}
        <main className="profile-directory">
          <div>
            {this.props.isLoading ? (
              <Loading />
            ) : this.props.hasError ? (
              <ErrorMessage errorData="grad-error">
                Sorry! The Graduate Portal is temporarily down. Our engineers
                are aware of the problem and are hard at work trying to fix it.
                Please come back later.
              </ErrorMessage>
            ) : (
              this.state.profiles &&
              Object.values(this.state.profiles).map(graduate => {
                console.log(graduate._id);
                const key = "graduate-" + graduate._id;

                //If story is longer than 270 char make  it short
                let gradStory, fullBio, isBioLong;
                if (graduate.story) {
                  isBioLong = graduate.story.length > 270;
                  gradStory = isBioLong
                    ? graduate.story.substring(0, 270) + "..."
                    : graduate.story;
                  fullBio = graduate.story;
                } else gradStory = graduate.story;
                const viewLink = "/profile/" + graduate._id;
                return (
                  <div className="card" key={key}>
                    <Media>
                      <Media.Left>
                        <Link
                          to={viewLink}
                          className="profile-thumbnail"
                        >
                          {graduate.image ? (
                            <Image
                              width={100}
                              height={100}
                              src={graduate.image}
                              alt="profile"
                              onError={this.addDefaultSrc}
                            />
                          ) : (
                            <Image
                              width={100}
                              height={100}
                              src={noPic}
                              alt="profile missing"
                            />
                          )}
                        </Link>
                      </Media.Left>
                      <Media.Body>
                        <Media.Heading>
                          <Link to={viewLink}>
                            {graduate.firstName + " " + graduate.lastName}
                          </Link>
                        </Media.Heading>
                        <p>{graduate.yearOfGrad}</p>
                        <p className="skills">{graduate.skills.join(", ")}</p>

                        {/* If Bio is long cut story short*/}
                        {isBioLong ? <p>{gradStory}</p> : <p>{fullBio}</p>}

                        {graduate.links &&
                          Object.keys(graduate.links).map(linkKey => {
                            const icons = {
                              linkedin: "fab fa-linkedin-in",
                              github: "fab fa-github",
                              website: "fas fa-globe",
                              email: "fas fa-envelope"
                            };
                            const titles = {
                              linkedin: `View ${
                                graduate.firstName
                              }'s linkedin profile`,
                              github: `View ${
                                graduate.firstName
                              }'s github profile`,
                              website: `View ${graduate.firstName}'s website`,
                              email: `Contact ${graduate.firstName}`
                            };
                            // test to see if its truthy
                            if (graduate.links[linkKey])
                              return (
                                <Button
                                  key={linkKey}
                                  className="grad-btn grad-btn-primary links"
                                  bsSize="small"
                                  href={
                                    graduate.links[linkKey] ===
                                    graduate.links.email
                                      ? `mailto:${graduate.links.email}`
                                      : graduate.links[linkKey]
                                  }
                                  title={titles[linkKey]}
                                  target={
                                    graduate.links[linkKey] ===
                                    graduate.links.email
                                      ? ""
                                      : "_blank"
                                  }
                                >
                                  <i
                                    className={`${
                                      icons[linkKey]
                                    } fa-lg acc-primary`}
                                  />
                                </Button>
                              );
                            else return null;
                          })}

                        {graduate.resume && (
                          <Button
                            className="grad-btn grad-btn-primary"
                            bsSize="small"
                            href={graduate.resume}
                            target="_blank"
                          >
                            View Resume
                          </Button>
                        )}

                        {/* View Profile Button */}
                        <LinkContainer to={`/profile/${graduate._id}`}>
                          <Button
                            className="grad-btn grad-btn-secondary"
                            bsSize="small"
                          >
                            View Profile
                          </Button>
                        </LinkContainer>

                        {/* Active/Inactive Button */}
                        {this.props.isAdmin && (
                          graduate.isActive ? (
                              <Button
                                className="grad-btn grad-btn-admin-active"
                                bsSize="small"
                                onClick={(e) => this.handleActivation(e, graduate._id)}
                              >
                                <span>Active</span>
                              </Button>
                          ) : (
                              <Button
                                className="grad-btn grad-btn-admin-inactive"
                                bsSize="small"
                                onClick={(e) => this.handleActivation(e, graduate._id)}
                              >
                                <span>InActive</span>
                              </Button>
                          )
                        )}

                        {/* Edit Profile Button */}
                        {this.props.isAdmin && (
                          <LinkContainer to={`/profile/${graduate._id}/edit`}>
                            <Button
                              className="grad-btn grad-btn-admin"
                              bsSize="small"
                            >
                              Edit
                            </Button>
                          </LinkContainer>
                        )}

                        {/* Batch Resume Download Checkbox */}
                        {graduate.resume && (
                          <Checkbox 
                            onChange={e => this.handleCheckbox(e, graduate.resume)}
                            readOnly >
                            Include this graduate's resume in a batch download.
                          </Checkbox>
                        )}
                      </Media.Body>
                    </Media>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    );
  }
}

export default Search;
