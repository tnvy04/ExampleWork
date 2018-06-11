/*///////////////////////////////////////////////// INFORMATION //////////////////////////////////////////////////////

    <ValidationMessage validationFor={*Object*} validationTrigger={*Bool*} patternMessage={*optionalString*} />

__________________________________________________________________________________________________________________________
        Property                        |            Description
_______________________________________ |_________________________________________________________________________________      
    1) validationFor                    |  Object/pointer to the <input> element.  Use React.createRef() to reference.
                                        |  
----------------------------------------|---------------------------------------------------------------------------------
    2) validationTrigger                |  Boolean value that triggers validation messages.  Recommend the value to be 
       (optional, but recommended for   |  intialized as false within state and triggered (setState to true) with an onClick 
        required <input>)               |  handler. On true, all <ValidationMessage> on the DOM will diplay if input is required.
----------------------------------------|--------------------------------------------------------------------------------
    3) patternMessage  (optional)       |  String message that will display if the pattern attribute was used and does not 
                                        |  match.
_________________________________________________________________________________________________________________________
*/ ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*//////////////////////////////////////////////////// IMPORTANT  ////////////////////////////////////////////////////////
This component only displays validation message(s) and does NOT validate a form before submittal.
It is meant to be used in conjunction with the built-in browser validation for <input> elements. 

So far, only the below attributes/types are supported.  More will be added in time.

    Attributes
        1) min
        2) max
        3) minLength
        4) maxLength
        5) required
        6) pattern

    Types
        1) datetime-local
        2) url
        3) email
    
*/ ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*////////////////////////////////////////////// SETUP - EXAMPLE /////////////////////////////////////////////////////////
Setup with 5 simple required steps and 3 optional steps.  Then it only takes 3 additional steps for each <ValidationMessage>

    import React from 'react';
    import { ValidationMessage } from './Validation';

    class ValidationMessageExample extends React.Component{
        
        // Required 1) Initialize reference
        name = React.createRef();

        state = {
            name: "",

            // Optional 1) Initialize optional trigger and boolean value
            trigger: false,
        }

        render(){
            return(

                // Required 2) Locate onSubmit to <form>
                <form onSubmit="{insert handler here}">

                    <div className="form-group">
                        <label className="control-label">Name <span className="asterisk">*</span>:</label><br/>
                        <input 
                            className='form-control'
                            placeholder="Ex: Joe's Fundraiser"
                            value={this.state.name}
                            onChange={(e) => this.setState({name: e.target.value})}

                            // Required 3) Assign reference to the <input> element
                            ref={this.name}

                            // Required 4) Define browser/built-in validation attributes and type
                            type="text" 
                            maxLength="100"
                            minLength="10"
                            required/>
                
                        <ValidationMessage 
                            // Required 5) Connect the validationFor property with <input> reference.
                            validationFor={this.name} 

                            // Optional 2) Connect the validationTrigger property with the trigger.
                            validationTrigger={this.state.trigger}/>
                    </div>

                    // Note: If you want to add more <ValidationMessage> within <input>, just repreat steps 1, 6, and 7.

                    <button type="submit"
                        className="btn btn-success"

                        //  Optional 3) Set trigger to true to show validation message(s).  These is optional, 
                        //     but important if you have multiple <ValidationMessage> with 'required' attribute and want all of them
                        //     to display at once onClick. If not, <ValidationMessage> will only display onChange. 
                    onClick={()=>this.setState({trigger: true})}
                    >Submit</button>
                </form>
            )
        }
    } export default ValidationMessageExample;

*/ //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React from "react";
import "./Validation.css";

// The components below will be use to insert messages to the 'display' array which will be return from <ValidationMessage/>
function Required(p) {
  if (p.element.validity.valueMissing) {
    return <div className="invalidText">This field is required.</div>;
  }
  return null;
}

function Email(p) {
  if (p.element.validity.typeMismatch) {
    return <div className="invalidText">Email invalid</div>;
  }
  return null;
}

function Min(p) {
  if (p.element.validity.rangeUnderflow) {
    return (
      <div className="invalidText">
        The minimum value is {p.element.getAttribute("min")}.
      </div>
    );
  }
  return null;
}

function Max(p) {
  if (p.element.validity.rangeOverflow) {
    return (
      <div className="invalidText">
        The max value is {p.element.getAttribute("max")}.
      </div>
    );
  }
  return null;
}

function MinLength(p) {
  if (p.element.value.length < p.element.getAttribute("minLength")) {
    return (
      <div className="invalidText">
        The minimum length is {p.element.getAttribute("minLength")}.
      </div>
    );
  }
  return null;
}

function MaxLength(p) {
  if (p.element.value.length == p.element.getAttribute("maxLength")) {
    return (
      <div className="invalidText">
        The max length is {p.element.getAttribute("maxLength")}.
      </div>
    );
  }
  return null;
}

function Pattern(p) {
  if (p.element.validity.patternMismatch) {
    if (p.patternMessage) {
      return <div className="invalidText">{p.patternMessage}</div>;
    }
    return <div className="invalidText">Input pattern does not match.</div>;
  }
  return null;
}

function URL(p) {
  if (p.element.validity.typeMismatch) {
    return (
      <div className="invalidText">
        Invalid URL. URL must include "http(s)://"
      </div>
    );
  }
  return null;
}

/////// NOT WORKING! Still needs work.
function DateTimeLocal(p) {
  console.log(!!p.element.validity.valid);
  if (p.element.validity.badInput) {
    return (
      <div className="invalidText">
        Date-Time format invalid (Ex: 01/01/2001 12:30 PM).
      </div>
    );
  }
  return null;
}

// The component takes an <input> element.  Then checks for associated attributes and validity
export function ValidationMessage(p) {
  const element = p.validationFor.current;

  // element always initialize as null upon render so this if statement safe guards against the initialization
  if (!element) {
    return null;
  }

  // checks if the client has input something or if the trigger is true and the <input> element is "required"
  if (
    element.value.length > 1 ||
    (p.validationTrigger && element.hasAttribute("required"))
  ) {
    // this manages the CSS of valid or invalid <input>s
    if (element.validity.valid) {
      element.classList.remove("error-border");
    } else {
      element.classList.add("error-border");
    }

    // array that will return to the DOM
    let display = [];

    // if attributes are present in the element, then push the associated component to the array
    if (element.hasAttribute("required")) {
      display.push(<Required element={element} key={display.length} />);
    }
    if (element.hasAttribute("maxLength")) {
      display.push(<MaxLength element={element} key={display.length} />);
    }
    if (element.hasAttribute("minLength")) {
      display.push(<MinLength element={element} key={display.length} />);
    }
    if (element.hasAttribute("min")) {
      display.push(<Min element={element} key={display.length} />);
    }
    if (element.hasAttribute("max")) {
      display.push(<Max element={element} key={display.length} />);
    }
    if (element.getAttribute("type") === "url") {
      display.push(<URL element={element} key={display.length} />);
    }
    if (element.getAttribute("type") === "email") {
      display.push(<Email element={element} key={display.length} />);
    }
    if (element.hasAttribute("pattern")) {
      display.push(
        <Pattern
          element={element}
          key={display.length}
          patternMessage={p.patternMessage}
        />
      );
    }
    if (element.getAttribute("type") === "datetime-local") {
      display.push(<DateTimeLocal element={element} key={display.length} />);
    }
    return display;
  }

  // return null if there are no attributes in the provided <input> element.
  return null;
}
