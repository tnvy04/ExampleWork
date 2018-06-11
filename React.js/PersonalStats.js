/*//////////////////////////////////////////// INFORMATION ////////////////////////////////////////////
import PersonalStats from './PersonalStats'

    <PersonalStats userId=*INT* />  --> Route: None. Should be used as a subcomponent.
_______________________________________________________________________________________________________
        Property                |            Description
________________________________|______________________________________________________________________      
        PersonalStats           |  React component that will display/edit statistics of profile user.
                                |  Statistcs varies based on the 5 profile user types.   
                                |  
                                |  There are also three types of possible view modes based on loggedin user. 
                                |    1) Visitors has view-only privilege.     
                                |    2) Profile owner has editing rights.
                                |    3) <PerformanceStatsValidation> allows advocates to validate 
                                |       connected athletes' stats.  Advocates can delete thier own
                                |       validation as well. 
                                |
________________________________|______________________________________________________________________
        userId                  |  Integer - UserId of profile for which statistics will be display.
_______________________________________________________________________________________________________ 
*/ /////////////////////////////////////////////////////////////////////////////////////////////////////

//TODO: Add Julianna's properties to AD

import React from "react";
// import "./personalStats.css";
import {
  personalStats_GetByUserId,
  personalStats_Update,
  personalStats_Create,
  baseballPositions_GetAll
} from "../../server";
import { connect } from "react-redux";
import { moment } from "moment";
import { ValidationMessage } from "../../Validation";
import PerformanceStatsValidation from "../../PerformanceStatsValidation";
import ConferenceChooser from "../../ConferenceChooser";

class PersonalStats extends React.Component {
  componentDidMount() {
    this.getPersonalStats();
    this.getBaseballPositions();
  }

  getPersonalStats = () => {
    personalStats_GetByUserId({ UserId: parseInt(this.props.userId) })
      .then(data => {
        let newData = data.data.item;
        if (!newData.statsJson) {
          this.setState({
            createStat: true,
            loading: false,
            userId: this.props.userId
          });
        } else {
          let personalStats = JSON.parse(newData.statsJson);
          this.setState({
            ...this.state,
            userId: personalStats.UserId
              ? personalStats.UserId
              : this.props.userId,
            education: personalStats.Education
              ? personalStats.Education
              : this.state.education,
            hitter: personalStats.Hitter
              ? personalStats.Hitter
              : this.state.hitter,
            pitcher: personalStats.Pitcher
              ? personalStats.Pitcher
              : this.state.pitcher,
            collegeStats: personalStats.CollegeStats
              ? personalStats.CollegeStats
              : this.state.collegeStats,
            advocates: personalStats.Advocates
              ? personalStats.Advocates
              : this.state.advocates,
            coachesStats: personalStats.CoachesStats
              ? personalStats.CoachesStats
              : this.state.coachesStats,
            baseballPositions: personalStats.BaseballPosition
              ? personalStats.BaseballPosition
              : this.state.baseballPositions,
            dateCreatedUTC: newData.dateCreated,
            dateModifiedUTC: newData.dateModified,
            id: newData.id,
            userTypeId: newData.userTypeId,
            loading: false,
            createStat: false
          });
        }
      })
      .catch(error => {
        this.setState({
          ...this.state,
          catchError: true,
          loading: false
        });
        console.log(error);
      });
  };

  getBaseballPositions = () => {
    baseballPositions_GetAll().then(data =>
      this.setState({ baseballPositionsList: data.data.items }, () =>
        console.log(this.state.baseballPositionsList)
      )
    );
  };
  //compares current user against profile to determine isPrivate
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentUser) {
      if (nextProps.currentUser.id == nextProps.userId) {
        return {
          isPrivate: true
        };
      } else if (nextProps.currentUser.id !== nextProps.userId) {
        return {
          isPrivate: false
        };
      }
    }
    return null;
  }

  state = {
    education: { GPA: "", SAT: "", ACT: "", GradMY: "" },
    hitter: {
      Handedness: "",
      HighSchoolBattingAverage: "",
      ExtraBaseHits: "",
      RBIs: "",
      OnBasePercentage: "",
      StolenBases: ""
    },
    pitcher: { ERA: "", InningsPitched: "", Strikeouts: "", Walks: "" },
    collegeStats: {
      Division: "",
      Conference: "",
      AverageGameWon: "",
      YearsInPlayoffs: "",
      AverageAcceptanceRate: "",
      ConferenceChampionshipPast10Yrs: "",
      PreviousSeasonRecord: ""
    },
    advocates: { YearsAtSchoolOrg: "", Title: "" },
    coachesStats: {
      Division: "",
      Conference: "",
      AverageGameWon: "",
      YearsInPlayoffs: "",
      Roles: "",
      ConferenceWithin10Yrs: ""
    },
    baseballPositions: { Name: "" },

    baseballPositionsList: "",
    createStat: false,
    loading: true,
    catchError: false,

    //controls toggle btn icon
    educationCollapse: false,
    hitterCollapse: false,
    pitcherCollapse: false,
    collegeStatsCollapse: false,
    advocatesCollapse: false,
    coachesStatsCollapse: false,
    baseballPositionDisabled: false,

    //true/public mode
    isPrivate: false,
    educationDisabled: true,
    hitterDisabled: true,
    pitcherDisabled: true,
    collegeStatsDisabled: true,
    advocatesDisabled: true,
    coachesStatsDisabled: true,
    baseballPositionDisabled: true
  };

  ///////////////////////////// Refs for <ValidationMessage/> ////////////////////////////////
  //Education
  gpa = React.createRef();
  sat = React.createRef();
  act = React.createRef();
  gradMY = React.createRef();

  //Hitter
  handednessHitter = React.createRef();
  extraBaseHits = React.createRef();
  rbi = React.createRef();
  onBasePercentage = React.createRef();
  highSchoolBattingAverage = React.createRef();
  stolenBases = React.createRef();

  //Pitcher
  handednessPitcher = React.createRef();
  era = React.createRef();
  inningsPitched = React.createRef();
  strikeouts = React.createRef();
  walks = React.createRef();

  //College
  divisionCollegeStats = React.createRef();
  conferenceCollegeStats = React.createRef();
  ConferenceChampionshipPast10Yrs = React.createRef();
  AverageAcceptanceRate = React.createRef();
  YearsInPlayoffs = React.createRef();
  AverageGameWon = React.createRef();

  //Advocates
  yearsAtSchoolOrg = React.createRef();
  title = React.createRef();

  //Coaches
  divisionCoachesStats = React.createRef();
  conferenceCoachesStats = React.createRef();
  averageGameWon = React.createRef();
  yearsInPlayoffs = React.createRef();
  roles = React.createRef();
  conferenceWithin10Yrs = React.createRef();

  //Position
  name = React.createRef();
  ///////////////////////////////////////////////////////////////////////////////////////////

  //CSS for loading screen
  loading = {
    fontSize: "3em"
  };

  disabledForms = () => {
    this.setState({
      educationDisabled: true,
      hitterDisabled: true,
      pitcherDisabled: true,
      collegeStatsDisabled: true,
      advocatesDisabled: true,
      coachesStatsDisabled: true,
      baseballPositionDisabled: true
    });
  };

  // ajax for update
  submitPersonalStats = e => {
    e.preventDefault();
    this.disabledForms();
    let data = { UserId: this.state.userId };
    if (this.state.userTypeId == 1) {
      data = {
        ...data,
        Education: {
          GPA: !this.state.education.GPA ? null : this.state.education.GPA,
          SAT: !this.state.education.SAT ? null : this.state.education.SAT,
          ACT: !this.state.education.ACT ? null : this.state.education.ACT,
          GradMY: !this.state.education.GradMY
            ? null
            : this.state.education.GradMY
        }
      };
    }
    if (this.state.userTypeId == 1) {
      data = {
        ...data,
        Hitter: {
          ...this.state.hitter,
          HighSchoolBattingAverage: !this.state.hitter.HighSchoolBattingAverage
            ? null
            : this.state.hitter.HighSchoolBattingAverage,
          ExtraBaseHits: !this.state.hitter.ExtraBaseHits
            ? null
            : this.state.hitter.ExtraBaseHits,
          RBIs: !this.state.hitter.RBIs ? null : this.state.hitter.RBIs,
          OnBasePercentage: !this.state.hitter.OnBasePercentage
            ? null
            : this.state.hitter.OnBasePercentage,
          StolenBases: !this.state.hitter.StolenBases
            ? null
            : this.state.hitter.StolenBases
        }
      };
    }
    if (this.state.userTypeId == 1) {
      data = {
        ...data,
        Pitcher: {
          ...this.state.pitcher,
          ERA: !this.state.pitcher.ERA ? null : this.state.pitcher.ERA,
          InningsPitcher: !this.state.pitcher.InningsPitched
            ? null
            : this.state.pitcher.InningsPitched,
          Strikeouts: !this.state.pitcher.Strikeouts
            ? null
            : this.state.pitcher.Strikeouts,
          Walks: !this.state.pitcher.Walks ? null : this.state.pitcher.Walks
        }
      };
    }
    if (this.state.userTypeId == 2) {
      data = {
        ...data,
        CoachesStats: this.state.coachesStats
      };
    }
    if (this.state.userTypeId == 3) {
      data = {
        ...data,
        Advocates: {
          ...this.state.advocates,
          YearsAtSchoolOrg: !this.state.advocates.YearsAtSchoolOrg
            ? null
            : this.state.advocates.YearsAtSchoolOrg
        }
      };
    }
    if (this.state.userTypeId == 4) {
      data = {
        ...data,
        CollegeStats: {
          ...this.state.collegeStats,
          AverageGameWon: !this.state.collegeStats.AverageGameWon
            ? null
            : this.state.collegeStats.AverageGameWon,
          YearsInPlayoffs: !this.state.collegeStats.YearsInPlayoffs
            ? null
            : this.state.collegeStats.YearsInPlayoffs,
          AverageAcceptanceRate: !this.state.collegeStats.AverageAcceptanceRate
            ? null
            : this.state.collegeStats.AverageAcceptanceRate,
          ConferenceChampionshipPast10Yrs: !this.state.collegeStats
            .ConferenceChampionshipPast10Yrs
            ? null
            : this.state.collegeStats.ConferenceChampionshipPast10Yrs
        }
      };
    }
    if (this.state.userTypeId == 1) {
      data = {
        ...data,
        BaseballPosition: {
          Name: !this.state.baseballPositions.Name
            ? null
            : this.state.baseballPositions.Name
        }
      };
    }
    let userId = parseInt(this.props.userId);
    let jsonData = JSON.stringify(data);
    personalStats_Update({
      UserId: userId,
      StatsJson: jsonData
    });
  };

  // ajax for create
  submitCreateStat = e => {
    e.preventDefault();
    let newRequest = {
      UserId: parseInt(this.props.userId)
    };
    let statsJson = JSON.stringify(newRequest);
    personalStats_Create({
      StatsJson: statsJson
    }).then(this.getPersonalStats());
  };

  // isPrivate edit/save btns
  editBtn = formToEnable => {
    if (this.state[formToEnable]) {
      return (
        <button
          type="button"
          className="btn"
          onClick={e => {
            e.preventDefault(), this.setState({ [formToEnable]: false });
          }}
        >
          <i className="fa fa-edit" />
        </button>
      );
    } else {
      return (
        <button className="btn">
          <i className="fa fa-save" />
        </button>
      );
    }
  };

  ////////////////////////////// statistics sub-components //////////////////////////////////////
  divisionList = () => {
    return (
      <React.Fragment>
        <option value="DI">DI</option>
        <option value="DII">DII</option>
        <option value="DIII">DIII</option>
        <option value="NAIA">NAIA</option>
      </React.Fragment>
    );
  };

  education = () => {
    if (this.state.userTypeId == 1) {
      return (
        <form onSubmit={this.submitPersonalStats}>
          <div className="panel-primary">
            <div className="panel-heading">
              <div className="pull-left">
                <h3 className="panel-title">Education</h3>
              </div>
              <div className="pull-right">
                {this.state.isPrivate === true &&
                  !this.state.educationCollapse &&
                  this.editBtn("educationDisabled")}
                <button
                  className="btn btn-sm"
                  data-toggle="collapse"
                  data-placement="top"
                  data-target="#education"
                  aria-expanded="true"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      educationCollapse: !this.state.educationCollapse
                    });
                  }}
                >
                  {this.state.educationCollapse ? (
                    <i className="fa fa-angle-up" />
                  ) : (
                    <i className="fa fa-angle-down" />
                  )}
                </button>
              </div>
              <div className="clearfix" />
            </div>

            <div id="education" className="collapse in panel-body">
              <fieldset className="form-hoizontal">
                <div className="inputContainer form-group ">
                  <label className="col-xs-7 control-label mt-5">
                    <b>GPA:</b>
                  </label>
                  <div className="col-xs-3">
                    <input
                      type="number"
                      min="0"
                      max="5.0"
                      step="0.01"
                      ref={this.gpa}
                      className="personalStatsInput form-control mb-5"
                      disabled={this.state.educationDisabled}
                      value={this.state.education.GPA}
                      onChange={e =>
                        this.setState({
                          education: {
                            ...this.state.education,
                            GPA: e.target.value
                          }
                        })
                      }
                    />
                  </div>
                    <PerformanceStatsValidation
                      targetUserId={this.props.userId}
                      isPrivate={this.state.isPrivate}
                      statName="GPA"
                      isPrivate={this.state.isPrivate}
                    />
                </div>
                <div className="validationContainer col-xs-12">
                  <ValidationMessage validationFor={this.gpa} />
                </div>

                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>SAT:</b>
                  </label>
                  <div className="col-xs-3">
                    <input
                      type="number"
                      min="400"
                      max="1600"
                      className="personalStatsInput form-control mb-5"
                      value={this.state.education.SAT}
                      ref={this.sat}
                      disabled={this.state.educationDisabled}
                      onChange={e =>
                        this.setState({
                          education: {
                            ...this.state.education,
                            SAT: e.target.value
                          }
                        })
                      }
                    />
                  </div>

                    <PerformanceStatsValidation
                      targetUserId={this.props.userId}
                      isPrivate={this.state.isPrivate}
                      statName="SAT"
                    />

                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.sat} />
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>ACT:</b>
                  </label>
                  <div className="col-xs-3">
                    <input
                      type="number"
                      min="4"
                      max="144"
                      className="personalStatsInput form-control mb-5"
                      disabled={this.state.educationDisabled}
                      value={this.state.education.ACT}
                      ref={this.act}
                      onChange={e =>
                        this.setState({
                          education: {
                            ...this.state.education,
                            ACT: e.target.value
                          }
                        })
                      }
                    />
                  </div>
                    <PerformanceStatsValidation
                      targetUserId={this.props.userId}
                      isPrivate={this.state.isPrivate}
                      statName="ACT"
                    />
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.act} />
                </div>
                <div className="inputContainer">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Graduation Year-Month:</b>
                  </label>
                  <div className="col-xs-3">
                    {/* {this.state.educationDisabled ? (
                      <span className="spanDisplayStats ml-10">
                        {this.state.education.GradMY}
                      </span>
                    ) : ( */}
                      <input
                        type="month"
                        className="personalStatsInput form-control mb-5"
                        disabled={this.state.educationDisabled}
                        value={this.state.education.GradMY}
                        ref={this.gradMY}
                        onChange={e =>
                          this.setState({
                            education: {
                              ...this.state.education,
                              GradMY: e.target.value
                            }
                          })
                        }
                      />
                    {/* )} */}
                    </div>

                    <PerformanceStatsValidation
                      targetUserId={this.props.userId}
                      isPrivate={this.state.isPrivate}
                      statName="GradMY"
                    />

                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.gradMY} />
                </div>
              </fieldset>
            </div>
          </div>
        </form>
      );
    }
  };

  hitter = () => {
    if (this.state.userTypeId == 1) {
      return (
        <form className="personalStatsForm mt-10" onSubmit={this.submitPersonalStats}>
          <div className="panel-primary">
            <div className="panel-heading">
              <div className="pull-left">
                <h3 className="panel-title">Hitter</h3>
              </div>
              <div className="pull-right">
                {this.state.isPrivate === true &&
                  !this.state.hitterCollapse &&
                  this.editBtn("hitterDisabled")}
                <button
                  className="btn btn-sm"
                  data-toggle="collapse"
                  data-placement="top"
                  data-target="#hitter"
                  aria-expanded="false"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      hitterCollapse: !this.state.hitterCollapse
                    });
                  }}
                >
                  {this.state.hitterCollapse ? (
                    <i className="fa fa-angle-up" />
                  ) : (
                    <i className="fa fa-angle-down" />
                  )}
                </button>
              </div>
              <div className="clearfix" />
            </div>

            <div id="hitter" className="collapse in panel-body">
              <fieldset className="form-hoizontal">
                <div
                  className="inputContainer form-group"
                  disabled={this.state.hitterDisabled}
                >
                  <label className="col-xs-7 control-label mt-5">
                    <b>Handedness:</b>
                  </label>
                  {/* {this.state.hitterDisabled ? (
                    <span className="spanDisplayStats">
                      {this.state.hitter.Handedness}
                    </span>
                  ) : ( */}
                  <div className="col-xs-3">
                    <select
                      className="personalStatsSelect form-control mb-5"
                      disabled={this.state.hitterDisabled}
                      value={this.state.hitter.Handedness}
                      onChange={e =>
                        this.setState({
                          hitter: {
                            ...this.state.hitter,
                            Handedness: e.target.value
                          }
                        })
                      }
                    >
                      <option value="Right">Right</option>
                      <option value="Left">Left</option>
                      <option value="Switch">Switch</option>
                    </select>
                  {/* )} */}
                  </div>
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>High School Batting Average:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step=".001"
                    disabled={this.state.hitterDisabled}
                    className=" personalStatsInput  form-control mb-5"
                    value={this.state.hitter.HighSchoolBattingAverage}
                    ref={this.highSchoolBattingAverage}
                    onChange={e =>
                      this.setState({
                        hitter: {
                          ...this.state.hitter,
                          HighSchoolBattingAverage: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                  <PerformanceStatsValidation
                    targetUserId={this.props.userId}
                    isPrivate={this.state.isPrivate}
                    statName="HighSchoolBattingAverage"
                  />
                </div>
                <div className="validationContainer">
                  <ValidationMessage
                    validationFor={this.highSchoolBattingAverage}
                  />
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Extra Base Hits:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    disabled={this.state.hitterDisabled}
                    className=" personalStatsInput  form-control mb-5"
                    value={this.state.hitter.ExtraBaseHits}
                    ref={this.extraBaseHits}
                    onChange={e =>
                      this.setState({
                        hitter: {
                          ...this.state.hitter,
                          ExtraBaseHits: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                  <PerformanceStatsValidation
                    targetUserId={this.props.userId}
                    isPrivate={this.state.isPrivate}
                    statName="ExtraBaseHits"
                  />
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.extraBaseHits} />
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>RBIs:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    disabled={this.state.hitterDisabled}
                    className=" personalStatsInput  form-control mb-5"
                    ref={this.rbi}
                    value={this.state.hitter.RBIs}
                    onChange={e =>
                      this.setState({
                        hitter: { ...this.state.hitter, RBIs: e.target.value }
                      })
                    }
                  />
                  </div>
                  <PerformanceStatsValidation
                    targetUserId={this.props.userId}
                    isPrivate={this.state.isPrivate}
                    statName="RBIs"
                  />
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.rbi} />
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>On Base Percentage:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    disabled={this.state.hitterDisabled}
                    className=" personalStatsInput  form-control mb-5"
                    ref={this.onBasePercentage}
                    value={this.state.hitter.OnBasePercentage}
                    onChange={e =>
                      this.setState({
                        hitter: {
                          ...this.state.hitter,
                          OnBasePercentage: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                  <PerformanceStatsValidation
                    targetUserId={this.props.userId}
                    isPrivate={this.state.isPrivate}
                    statName="OnBasePercentage"
                  />
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.onBasePercentage} />
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Stolen Bases:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    disabled={this.state.hitterDisabled}
                    className=" personalStatsInput  form-control mb-5"
                    value={this.state.hitter.StolenBases}
                    ref={this.stolenBases}
                    onChange={e =>
                      this.setState({
                        hitter: {
                          ...this.state.hitter,
                          StolenBases: e.target.value
                        }
                      })
                    }
                  />
                  <PerformanceStatsValidation
                    targetUserId={this.props.userId}
                    isPrivate={this.state.isPrivate}
                    statName="StolenBases"
                  />
                  </div>
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.stolenBases} />
                </div>
              </fieldset>
            </div>
          </div>
        </form>
      );
    }
  };

  pitcher = () => {
    if (
      this.state.userTypeId == 1 &&
      this.state.baseballPositions.Name === "Pitcher"
    ) {
      return (
        <form
          className=" personalStatsForm mt-10"
          onSubmit={this.submitPersonalStats}
        >
          <div className="panel-primary">
            <div className="panel-heading">
              <div className="pull-left">
                <h3 className="panel-title">Pitcher</h3>
              </div>
              <div className="pull-right">
                {this.state.isPrivate === true &&
                  !this.state.pitcherCollapse &&
                  this.editBtn("pitcherDisabled")}
                <button
                  className="btn btn-sm"
                  data-toggle="collapse"
                  data-placement="top"
                  data-target="#pitcher"
                  aria-expanded="false"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      pitcherCollapse: !this.state.pitcherCollapse
                    });
                  }}
                >
                  {this.state.pitcherCollapse ? (
                    <i className="fa fa-angle-up" />
                  ) : (
                    <i className="fa fa-angle-down" />
                  )}
                </button>
              </div>
              <div className="clearfix" />
            </div>
            <div id="pitcher" className="collapse in panel-body">
              <fieldset className="form-hoizontal">
                <div
                  className="inputContainer form-group"
                  disabled={this.state.pitcherDisabled}
                >
                  <label className="col-xs-7 control-label mt-5">
                    <b>Handedness:</b>
                  </label>
                  {/* {this.state.pitcherDisabled ? (
                    <span className="spanDisplayStats">
                      {this.state.pitcher.Handedness}
                    </span>
                  ) : ( */}
                  <div className="col-xs-3">
                    <select
                      className="personalStatsSelect form-control mb-5"
                      disabled={this.state.pitcherDisabled}
                      value={this.state.pitcher.Handedness}
                      onChange={e =>
                        this.setState({
                          pitcher: {
                            ...this.state.pitcher,
                            Handedness: e.target.value
                          }
                        })
                      }
                    >
                      <option value="Right">Right</option>
                      <option value="Left">Left</option>
                      <option value="Switch">Switch</option>
                    </select>
                  {/* )} */}
                  </div>
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.handednessPitcher} />
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>ERA:</b>
                  </label>
                  <div className="col-xs-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={this.state.pitcherDisabled}
                      className=" personalStatsInput form-control mb-5"
                      value={this.state.pitcher.ERA}
                      ref={this.era}
                      onChange={e =>
                        this.setState({
                          pitcher: { ...this.state.pitcher, ERA: e.target.value }
                        })
                      }
                    />
                  </div>
                  <PerformanceStatsValidation
                    targetUserId={this.props.userId}
                    isPrivate={this.state.isPrivate}
                    statName="ERA"
                  />
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.era} />
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Innings Pitched:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    disabled={this.state.pitcherDisabled}
                    className=" personalStatsInput form-control mb-5"
                    ref={this.inningsPitched}
                    value={this.state.pitcher.InningsPitched}
                    onChange={e =>
                      this.setState({
                        pitcher: {
                          ...this.state.pitcher,
                          InningsPitched: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                  <PerformanceStatsValidation
                    targetUserId={this.props.userId}
                    isPrivate={this.state.isPrivate}
                    statName="InningsPitched"
                  />
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.inningsPitched} />
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Strikeouts:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    disabled={this.state.pitcherDisabled}
                    className=" personalStatsInput form-control mb-5"
                    ref={this.strikeouts}
                    value={this.state.pitcher.Strikeouts}
                    onChange={e =>
                      this.setState({
                        pitcher: {
                          ...this.state.pitcher,
                          Strikeouts: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                  <PerformanceStatsValidation
                    targetUserId={this.props.userId}
                    isPrivate={this.state.isPrivate}
                    statName="Strikeouts"
                  />
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.strikeouts} />
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Walks:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    disabled={this.state.pitcherDisabled}
                    className=" personalStatsInput form-control mb-5"
                    ref={this.walks}
                    value={this.state.pitcher.Walks}
                    onChange={e =>
                      this.setState({
                        pitcher: {
                          ...this.state.pitcher,
                          Walks: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                  <PerformanceStatsValidation
                    targetUserId={this.props.userId}
                    isPrivate={this.state.isPrivate}
                    statName="Walks"
                  />
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.walks} />
                </div>
              </fieldset>
            </div>
          </div>
        </form>
      );
    }
  };

  collegeStats = () => {
    if (this.state.userTypeId == 4) {
      return (
        <form
          className=" personalStatsForm mt-10"
          onSubmit={this.submitPersonalStats}
          onSubmit={this.submitPersonalStats}
        >
          <div>
            <div className="panel-heading bg-primary">
              <div className="pull-left">
                <h3 className="panel-title">College Statistics</h3>
              </div>
              <div className="pull-right">
                {this.state.isPrivate === true &&
                  !this.state.collegeStatsCollapse &&
                  this.editBtn("collegeStatsDisabled")}
                <button
                  className="btn btn-sm"
                  data-toggle="collapse"
                  data-placement="top"
                  data-target="#collegeStats"
                  aria-expanded="false"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      collegeStatsCollapse: !this.state.collegeStatsCollapse
                    });
                  }}
                >
                  {this.state.collegeStatsCollapse ? (
                    <i className="fa fa-angle-up" />
                  ) : (
                    <i className="fa fa-angle-down" />
                  )}
                </button>
              </div>
              <div className="clearfix" />
            </div>
            <div id="collegeStats" className="collapse in panel-body">
              <fieldset  className="form-hoizontal" disabled={this.state.collegeStatsDisabled}>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Division:</b>
                  </label>
                  {/* {this.state.collegeStatsDisabled ? (
                    <span className="spanDisplayStats">
                      {this.state.collegeStats.Division}
                    </span>
                  ) : ( */}
                  <div className="col-xs-3">
                    <select
                      className="personalStatsSelect form-control mb-5"
                      value={this.state.collegeStats.Division}
                      onChange={e =>
                        this.setState({
                          collegeStats: {
                            ...this.state.collegeStats,
                            Division: e.target.value
                          }
                        })
                      }
                    >
                      {this.divisionList()}
                    </select>
                  {/* )} */}
                  </div>
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Conference:</b>
                  </label>
                  {/* {this.state.collegeStatsDisabled ? (
                    <span className="spanDisplayStats">
                      {this.state.collegeStats.Conference}
                    </span>
                  ) : ( */}
                    <div className="conferenceChooserContainer col-xs-3">
                      <ConferenceChooser
                        value={this.state.collegeStats.Conference}
                        onChange={value =>
                          this.setState({
                            collegeStats: {
                              ...this.state.collegeStats,
                              Conference: value
                            }
                          })
                        }
                      />
                    </div>
                  {/* )} */}
                </div>

                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Average Game Won:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step=".01"
                    disabled={this.state.collegeStatsDisabled}
                    className=" personalStatsInput form-control mb-5"
                    ref={this.AverageGameWon}
                    value={this.state.collegeStats.AverageGameWon}
                    onChange={e =>
                      this.setState({
                        collegeStats: {
                          ...this.state.collegeStats,
                          AverageGameWon: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.AverageGameWon} />
                </div>

                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Years In Playoffs:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    disabled={this.state.collegeStatsDisabled}
                    className=" personalStatsInput form-control mb-5"
                    ref={this.YearsInPlayoffs}
                    value={this.state.collegeStats.YearsInPlayoffs}
                    onChange={e =>
                      this.setState({
                        collegeStats: {
                          ...this.state.collegeStats,
                          YearsInPlayoffs: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.YearsInPlayoffs} />
                </div>

                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Average Acceptance Rate:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step=".01"
                    disabled={this.state.collegeStatsDisabled}
                    className=" personalStatsInput form-control mb-5"
                    ref={this.AverageAcceptanceRate}
                    value={this.state.collegeStats.AverageAcceptanceRate}
                    onChange={e =>
                      this.setState({
                        collegeStats: {
                          ...this.state.collegeStats,
                          AverageAcceptanceRate: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                </div>
                <div className="validationContainer">
                  <ValidationMessage
                    validationFor={this.AverageAcceptanceRate}
                  />
                </div>

                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Conference Championship Past 10Yrs:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    disabled={this.state.collegeStatsDisabled}
                    className=" personalStatsInput form-control mb-5"
                    ref={this.ConferenceChampionshipPast10Yrs}
                    value={
                      this.state.collegeStats.ConferenceChampionshipPast10Yrs
                    }
                    onChange={e =>
                      this.setState({
                        collegeStats: {
                          ...this.state.collegeStats,
                          ConferenceChampionshipPast10Yrs: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                </div>
                <div className="validationContainer">
                  <ValidationMessage
                    validationFor={this.ConferenceChampionshipPast10Yrs}
                  />
                </div>

                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Previous Season Record:</b>
                  </label>
                  {/* {this.state.collegeStatsDisabled ? (
                    <span className="spanDisplayStats">
                      {this.state.collegeStats.PreviousSeasonRecord}
                    </span>
                  ) : ( */}
                  <div className="col-xs-3">
                    <select
                      className="personalStatsSelect  form-control mb-5"
                      value={this.state.collegeStats.PreviousSeasonRecord}
                      onChange={e =>
                        this.setState({
                          collegeStats: {
                            ...this.state.collegeStats,
                            PreviousSeasonRecord: e.target.value
                          }
                        })
                      }
                    >
                      <option value="Tie">Tie</option>
                      <option value="Win">Win</option>
                      <option value="Lost">Lost</option>
                    </select>
                  {/* )} */}
                  </div>
                </div>

                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Average Game Won:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step=".01"
                    disabled={this.state.collegeStatsDisabled}
                    className=" personalStatsInput  form-control mb-5"
                    ref={this.AverageGameWon}
                    value={this.state.collegeStats.AverageGameWon}
                    onChange={e =>
                      this.setState({
                        collegeStats: {
                          ...this.state.collegeStats,
                          AverageGameWon: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.AverageGameWon} />
                </div>

                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Years In Playoffs:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    disabled={this.state.collegeStatsDisabled}
                    className=" personalStatsInput form-control mb-5"
                    ref={this.YearsInPlayoffs}
                    value={this.state.collegeStats.YearsInPlayoffs}
                    onChange={e =>
                      this.setState({
                        collegeStats: {
                          ...this.state.collegeStats,
                          YearsInPlayoffs: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.YearsInPlayoffs} />
                </div>

                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Average Acceptance Rate:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step=".01"
                    disabled={this.state.collegeStatsDisabled}
                    className=" personalStatsInput form-control mb-5"
                    ref={this.AverageAcceptanceRate}
                    value={this.state.collegeStats.AverageAcceptanceRate}
                    onChange={e =>
                      this.setState({
                        collegeStats: {
                          ...this.state.collegeStats,
                          AverageAcceptanceRate: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                </div>
                <div className="validationContainer">
                  <ValidationMessage
                    validationFor={this.AverageAcceptanceRate}
                  />
                </div>

                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Conference Championship Past 10Yrs:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    disabled={this.state.collegeStatsDisabled}
                    className=" personalStatsInput form-control mb-5"
                    ref={this.ConferenceChampionshipPast10Yrs}
                    value={
                      this.state.collegeStats.ConferenceChampionshipPast10Yrs
                    }
                    onChange={e =>
                      this.setState({
                        collegeStats: {
                          ...this.state.collegeStats,
                          ConferenceChampionshipPast10Yrs: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                </div>
                <div className="validationContainer">
                  <ValidationMessage
                    validationFor={this.ConferenceChampionshipPast10Yrs}
                  />
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Previous Season Record:</b>
                  </label>
                  {/* {this.state.collegeStatsDisabled ? (
                    <span className="spanDisplayStats">
                      {this.state.collegeStats.PreviousSeasonRecord}
                    </span>
                  ) : ( */}
                  <div className="col-xs-3">
                    <select
                      className="personalStatsSelect form-control mb-5"
                      value={this.state.collegeStats.PreviousSeasonRecord}
                      onChange={e =>
                        this.setState({
                          collegeStats: {
                            ...this.state.collegeStats,
                            PreviousSeasonRecord: e.target.value
                          }
                        })
                      }
                    >
                      <option value="Tie">Tie</option>
                      <option value="Win">Win</option>
                      <option value="Lost">Lost</option>
                    </select>
                  {/* )} */}
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </form>
      );
    }
  };

  advocates = () => {
    if (this.state.userTypeId == 3) {
      return (
        <form
          className=" personalStatsForm mt-10"
          onSubmit={this.submitPersonalStats}
        >
          <div>
            <div className="panel-heading bg-primary">
              <div className="pull-left">
                <h3 className="panel-title">Advocates</h3>
              </div>
              <div className="pull-right">
                {this.state.isPrivate === true &&
                  !this.state.advocatesCollapse &&
                  this.editBtn("advocatesDisabled")}
                <button
                  className="btn btn-sm"
                  data-toggle="collapse"
                  data-placement="top"
                  data-target="#advocates"
                  aria-expanded="false"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      advocatesCollapse: !this.state.advocatesCollapse
                    });
                  }}
                >
                  {this.state.advocatesCollapse ? (
                    <i className="fa fa-angle-up" />
                  ) : (
                    <i className="fa fa-angle-down" />
                  )}
                </button>
              </div>
              <div className="clearfix" />
            </div>
            <div id="advocates" className="collapse in">
              <fieldset  className="form-hoizontal" disabled={this.state.advocatesDisabled}>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Years at School/Organization:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="number"
                    min="0"
                    step=".01"
                    className=" personalStatsInput  form-control mb-5"
                    ref={this.yearsAtSchoolOrg}
                    value={this.state.advocates.YearsAtSchoolOrg}
                    onChange={e =>
                      this.setState({
                        advocates: {
                          ...this.state.advocates,
                          YearsAtSchoolOrg: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.yearsAtSchoolOrg} />
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Title:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="text"
                    className=" personalStatsInput form-control mb-5"
                    ref={this.title}
                    value={this.state.advocates.Title}
                    onChange={e =>
                      this.setState({
                        advocates: {
                          ...this.state.advocates,
                          Title: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.title} />
                </div>
              </fieldset>
            </div>
          </div>
        </form>
      );
    }
  };

  coachesStats = () => {
    if (this.state.userTypeId == 2) {
      return (
        <form
          className=" personalStatsForm mt-10"
          onSubmit={this.submitPersonalStats}
        >
          <div>
            <div className="panel-heading bg-primary">
              <div className="pull-left">
                <h3 className="panel-title">Coach Statistics</h3>
              </div>
              <div className="pull-right">
                {this.state.isPrivate === true &&
                  !this.state.coachesStatsCollapse &&
                  this.editBtn("coachesStatsDisabled")}
                <button
                  className="btn btn-sm"
                  data-toggle="collapse"
                  data-placement="top"
                  data-target="#coachesStats"
                  aria-expanded="false"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      coachesStatsCollapse: !this.state.coachesStatsCollapse
                    });
                  }}
                >
                  {this.state.coachesStatsCollapse ? (
                    <i className="fa fa-angle-up" />
                  ) : (
                    <i className="fa fa-angle-down" />
                  )}
                </button>
              </div>
              <div className="clearfix" />
            </div>
            <div id="coachesStats" className="collapse in">
              <fieldset className="form-hoizontal" disabled={this.state.coachesStatsDisabled}>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Division:</b>
                  </label>
                  {/* {this.state.coachesStatsDisabled ? (
                    <span className="spanDisplayStats">
                      {this.state.coachesStats.Division}
                    </span>
                  ) : ( */}
                  <div className="col-xs-3">
                    <select
                      className="personalStatsSelect form-control mb-5"
                      value={this.state.coachesStats.Division}
                      onChange={e =>
                        this.setState({
                          coachesStats: {
                            ...this.state.coachesStats,
                            Division: e.target.value
                          }
                        })
                      }
                    >
                      {this.divisionList()}
                    </select>
                    </div>
                  {/* )} */}
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Conference:</b>
                  </label>
                  {/* {this.state.coachesStatsDisabled ? (
                    <span className="spanDisplayStats">
                      {this.state.coachesStats.Conference}
                    </span>
                  ) : ( */}
                    <div className="conferenceChooserContainer col-xs-3">
                      <ConferenceChooser
                        value={this.state.coachesStats.Conference}
                        onChange={value =>
                          this.setState({
                            coachesStats: {
                              ...this.state.coachesStats,
                              Conference: value
                            }
                          })
                        }
                      />
                    </div>
                  {/* )} */}
                </div>
                <div className="inputContainer  form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Average Game Won:</b>
                  </label>
                  <div className="col-xs-3">
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step=".01"
                      className=" personalStatsInput form-control mb-5"
                      ref={this.averageGameWon}
                      value={this.state.coachesStats.AverageGameWon}
                      onChange={e =>
                        this.setState({
                          coachesStats: {
                            ...this.state.coachesStats,
                            AverageGameWon: e.target.value
                          }
                        })
                      }
                    />
                  </div>
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.averageGameWon} />
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Years in Playoffs:</b>
                  </label>
                  <div className="col-xs-3">
                    <input
                      type="number"
                      min="0"
                      step=".01"
                      className=" personalStatsInput form-control mb-5"
                      ref={this.yearsAtSchoolOrg}
                      value={this.state.coachesStats.YearsInPlayoffs}
                      onChange={e =>
                        this.setState({
                          coachesStats: {
                            ...this.state.coachesStats,
                            YearsInPlayoffs: e.target.value
                          }
                        })
                      }
                    />
                  </div>
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.yearsAtSchoolOrg} />
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Roles:</b>
                  </label>
                  <div className="col-xs-3">
                  <input
                    type="text"
                    className=" personalStatsInput form-control mb-5"
                    ref={this.roles}
                    value={this.state.coachesStats.Roles}
                    onChange={e =>
                      this.setState({
                        coachesStats: {
                          ...this.state.coachesStats,
                          Roles: e.target.value
                        }
                      })
                    }
                  />
                  </div>
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.roles} />
                </div>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Conference within 10 Years:</b>
                  </label>
                  {/* {this.state.coachesStatsDisabled ? (
                    <span className="spanDisplayStats">
                      {this.state.coachesStats.ConferenceWithin10Yrs}
                    </span>
                  ) : ( */}
                  <div className="col-xs-3">
                    <select
                      className="personalStatsSelect form-control mb-5"
                      value={this.state.coachesStats.ConferenceWithin10Yrs}
                      onChange={e =>
                        this.setState(
                          {
                            coachesStats: {
                              ...this.state.coachesStats,
                              ConferenceWithin10Yrs: e.target.value
                            }
                          },
                          console.log(
                            this.state.baseballPositions.ConferenceWithin10Yrs
                          )
                        )
                      }
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  {/* )} */}
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </form>
      );
    }
  };

  baseballPositions = () => {
    if (this.state.userTypeId == 1) {
      return (
        <form
          className=" personalStatsForm"
          onSubmit={this.submitPersonalStats}
        >
          <div className="panel-primary">
            <div className="panel-heading">
              <div className="pull-left">
                <h3 className="panel-title">Position</h3>
              </div>
              <div className="pull-right">
                {this.state.isPrivate === true &&
                  !this.state.baseballPositionCollapse &&
                  this.editBtn("baseballPositionDisabled")}
                <button
                  className="btn btn-sm"
                  data-toggle="collapse"
                  data-placement="top"
                  data-target="#baseballPositions"
                  aria-expanded="false"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      baseballPositionCollapse: !this.state
                        .baseballPositionCollapse
                    });
                  }}
                >
                  {this.state.baseballPositionCollapse ? (
                    <i className="fa fa-angle-up" />
                  ) : (
                    <i className="fa fa-angle-down" />
                  )}
                </button>
              </div>
              <div className="clearfix" />
            </div>
            <div id="baseballPositions" className="collapse in panel-body">
              <fieldset  className="form-hoizontal" disabled={this.state.baseballPositionDisabled}>
                <div className="inputContainer form-group">
                  <label className="col-xs-7 control-label mt-5">
                    <b>Position:</b>
                  </label>
                  {/* {this.state.baseballPositionDisabled ? (
                    <span className="spanDisplayStats">
                      {this.state.baseballPositions.Name}
                    </span>
                  ) : ( */}
                  <div className="col-xs-3">
                    <select
                      className="personalStatsSelect form-control mb-5"
                      value={this.state.baseballPositions.Name}
                      onChange={e =>
                        this.setState({
                          baseballPositions: {
                            ...this.state.baseballPositions,
                            Name: e.target.value
                          }
                        })
                      }
                    >
                      <option value="">Select a position</option>
                      {this.state.baseballPositionsList &&
                        this.state.baseballPositionsList.map(el => (
                          <option key={el.id} value={el.name}>
                            {el.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  {/* )} */}
                </div>
                <div className="validationContainer">
                  <ValidationMessage validationFor={this.name} />
                </div>
              </fieldset>
            </div>
          </div>
        </form>
      );
    }
  };

  createStat = () => {
    return (
      <div className="container col-sm-8 col-xs-10 col-md-5 col-lg-4">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <button className="btn " onClick={this.submitCreateStat}>
              <h3 className="panel-title">
                <b>
                  <span className="fa fa-plus" /> Add Statistics Now
                </b>
              </h3>
            </button>
          </div>
          </div>
      </div>
    );
  };

  noStats = () => {
    return (
      <div className="container col-sm-8 col-xs-10  col-md-5 col-lg-4">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h3 className="panel-title">
              <b>No Statistics Available</b>
            </h3>
          </div>
        </div>
      </div>
    );
  };

  render() {
    if (this.state.createStat && this.state.isPrivate === true) {
      return this.createStat();
    }
    if (this.state.createStat && this.state.isPrivate === false) {
      return this.noStats();
    }
    if (this.state.loading || !this.props.currentUser) {
      return (
        <div style={this.loading}>
          <span className="fa fa-spinner fa-spin" />&nbsp;Loading
        </div>
      );
    }
    if (this.state.catchError) {
      return (
        <React.Fragment>
          <div>
            There was an error returning profile statistics from the database.
          </div>
          <div>Please try again later.</div>
        </React.Fragment>
      );
    }
    return (
      <div className="container-fluid">
        <div className="row">
          {this.education()}
          {this.baseballPositions()}
          {this.pitcher()}
          {this.hitter()}
          {this.collegeStats()}
          {this.advocates()}
          {this.coachesStats()}
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  };
}
export default connect(
  mapStateToProps,
  null
)(PersonalStats);
