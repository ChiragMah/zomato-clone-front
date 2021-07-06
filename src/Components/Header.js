
import React from 'react';
import '../Styles/Header.css'
import {withRouter} from 'react-router-dom';
import Modal from 'react-modal'
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';


const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)'
    }
  };

class Header extends React.Component {
    

    constructor(){
        super();

        this.state = {
            loginModalIsOpen: false,
            userName: undefined,
            isLoggedIn: false,
            loggingInModalIsOpen: false,
            createAccountModalIsOpen: false,
            firstname: undefined,
            email: undefined,
            password: undefined,
            lastname: undefined,
            address: undefined,
            user:[]
        }
    }

 


    handleClick = () => {
        this.props.history.push('/')
    };

    handleLogin = () => {
        this.setState({loginModalIsOpen: true})
    }

    closeLogin = () => {
        this.setState({loginModalIsOpen: false, loggingInModalIsOpen: false, createAccountModalIsOpen: false})
    }

    handleLogout = () => {
      const {isLoggedIn, userName} = this.state

      var x = window.confirm("Are you sure you want to logout?")

      if (x == true) {
        this.setState({isLoggedIn: false, userName: undefined})
      } 

      else {
        this.setState({isLoggedIn: true, userName: userName})
      }
        
    }


    responseGoogle = (response) => {
        console.log(response);
        this.setState({userName: response.profileObj.name, isLoggedIn: true, loginModalIsOpen: false});
        
      }

    responseFacebook = (response) => {
        console.log(response);
        this.setState({userName: response.name, isLoggedIn: true, loginModalIsOpen: false});
        
      }

      handleLoggingIn = () => {
          this.setState({loggingInModalIsOpen: true});

      }

      handleLoginChange = (event, state) => {
        this.setState({ [state] : event.target.value });
    }

      handleSubmit = () => {
        

    const {email,password} = this.state;

    const inputObject= {
      email: email,
      password: password,
   
    }
    
    axios({
      method: 'POST',
      url: 'http://localhost:2022/login',
      headers: {'Content-Type' : 'application/json'},
      data : inputObject
  })
  .then(response =>
     {

      this.setState({
      users: response.data.user[0], isLoggedIn: true, userName: response.data.user[0].firstname, loggingInModalIsOpen: false,loginModalIsOpen: false
  }); alert(response.data.message);
  
}
  )
  .catch(error => {this.setState({users: undefined, userName: undefined}); alert("Incorrect ID or Password, Please try with proper credentials")});

  

}

createAccountButton = () => {
  this.setState ({createAccountModalIsOpen: true, loggingInModalIsOpen: false})
}

createAccount = () => {
const {email, password, firstname, lastname, address} = this.state;

const inputObject = {
  email: email,
  password: password,
  firstname: firstname,
  lastname: lastname,
  address: address
}

axios({
  method: 'POST',
  url: 'http://localhost:2022/adduser',
  headers: {'Content-Type' : 'application/json'},
  data : inputObject
})
.then(response => {this.setState({
  user: response.data.user, firstname: firstname, lastname: lastname, password: password, email: email, address: address, createAccountModalIsOpen: false
}); alert(response.data.message);
}
)
.catch()



}





      

  
       
        
    
    render(){
      const {loginModalIsOpen, isLoggedIn, userName, loggingInModalIsOpen, createAccountModalIsOpen} = this.state;
 

        return(
    <div>
            
        <div className = "redbar">
            
            <div className = "container"> 
                <div className = "row">
                       
                <div className="topredbar">
                            
                            <div onClick = {this.handleClick} style={{display: "inline-block"}}> 
                            <div className="ellipse" >
                               <div className ="e" >  e!  </div>
                            </div>
                            </div>
                            {isLoggedIn ? <div className ="login-create">
                            <button type="button" class="btn btn-link"  id="loginFilter">{userName}</button>
                        <button type="button" className="btn btn-link" id="createFilter" onClick = {this.handleLogout}>Logout</button>
                        </div> 
                        : <div className ="login-create">
                        <button type="button" class="btn btn-link"  id="loginFilter" onClick={this.handleLogin}>Login</button>
                    <button type="button" className="btn btn-link" id="createFilter" onClick = {this.createAccountButton}>Create an account</button>
                    </div>  }
                       
                </div>       
                
                </div>
            </div>
            <div>
        
        <Modal
          isOpen={loginModalIsOpen}
    
          style={customStyles}
          >

            <div className ="signin" style ={{display: "inline-block"}}>Sign in</div>
              <div className ="glyphicon glyphicon-remove" style ={{display: "inline-block"}} id="closeICon" onClick = {this.closeLogin}></div>
              <div  className ="full-login-modal">
              
              <div>
              <GoogleLogin
                clientId="527468700079-somrem3jv1t62q5b4nqq8kuvcpi9da51.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={this.responseGoogle}
                onFailure={this.responseGoogle}
                cookiePolicy={'single_host_origin'}
                className="googleButton"
                />
                </div>
                <div>
                <FacebookLogin
                    appId="318634626359158"
                    textButton = "Login with Facebook"
                    fields="name,email,picture"
                    callback={this.responseFacebook}
                    
                     />
                   </div>
                <div>
                <button type="button" className="btn btn-outline-danger loginModalCss"  onClick = {this.handleLoggingIn}>Login with your account</button>
                <div>
                
                <Modal
                        isOpen={loggingInModalIsOpen}
                    
                        style={customStyles}
                        >
                          <div className ="signin" style ={{display: "inline-block"}}>Login</div>
                            <div className ="glyphicon glyphicon-remove" id="closeICon" onClick = {this.closeLogin}></div>
                        <div className = "loginForm">
 
                            
                              <hr style={{"margin-top": "-20px"}}/>
  <div class="form-group loginForm-details ">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" className="form-control loginForm-input" id="exampleInputEmail1" name ="email" aria-describedby="emailHelp" placeholder="Enter email" onChange = {(event) => this.handleLoginChange(event,'email')}/>
    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
  <div class="form-group loginForm-details">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" className="form-control loginForm-input" id="exampleInputPassword1" name ="password" placeholder="Password" onChange = {(event) => this.handleLoginChange(event,'password')}/>
  </div>

<button type="submit" className="btn btn-danger submitButton" onClick = {this.handleSubmit}>Submit</button>

<hr/>
<div className ="signup">Don't have an account? <br/> <button type="button" className="btn btn-link signup-button" onClick = {this.createAccountButton}>Create one now!</button></div>
</div>
                                {/* <div>
                                <div>Enter Email</div>
                                <input type='text' placeholder='Fill your email here'  name = "email" onChange = {(event) => this.handleLoginChange(event,'email')}/> 
                                <div>Enter Password</div>
                                <input type='password' placeholder='Fill your password here'  name = "password" onChange = {(event) => this.handleLoginChange(event,'password')}/> 
                                <div>
                                <button type="button" class="btn btn-outline-danger" onClick = {this.handleSubmit}>Submit</button>
                                </div>
                                </div>
                                */}
                                
                            
                            

              </Modal>
                </div>
                </div>

                </div>
                <hr className="signup-line"/>
                <div className ="signup">Don't have an account? <br/> <button type="button" class="btn btn-link signup-button" onClick = {this.createAccountButton}>Create one now!</button></div>
        </Modal>

        <Modal
        isOpen={createAccountModalIsOpen}
    
        style={customStyles}>
          <div className="create-account-div">
          <div className ="signin" style ={{display: "inline-block"}}>Create your account</div>
          <div className ="glyphicon glyphicon-remove" id="closeICon" onClick = {this.closeLogin}></div>
          <hr/>
          <div >
            
          
          
  <div className ="loginForm-details">
    <label for="validationCustom01" class="form-label">First name</label>
    <input type="text" className="form-control loginForm-input" id="validationCustom01" placeholder ="Enter your first name" onChange = {(event) => this.handleLoginChange(event,'firstname')} required/>
    <div class="valid-feedback">
      Looks good!
    </div>
  </div>
  <hr/>
  <div className ="loginForm-details">
    <label for="validationCustom02" className="form-label">Last name</label>
    <input type="text" className="form-control loginForm-input" id="validationCustom02" placeholder ="Enter your last name"onChange = {(event) => this.handleLoginChange(event,'lastname')} required/>
    <div className="valid-feedback">
      Looks good!
    </div>
  </div>

  <hr/>

  <div>
  <div className="form-group loginForm-details">
    <label for="exampleInputEmail1">Email address</label>
    <input type="email" className="form-control loginForm-input" id="exampleInputEmail1" aria-describedby="emailHelp" onChange = {(event) => this.handleLoginChange(event,'email')} placeholder="Enter email"/>
    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
  </div>
<hr/>
  <div className ="loginForm-details">
    <label for="validationDefault02" className="form-label">Password</label>
    <input type="password" className="form-control loginForm-input" id="validationDefault02" placeholder="Enter your password" onChange = {(event) => this.handleLoginChange(event,'password')} required/>
  </div>
<hr/>
  </div>
  <div className ="loginForm-details">
    <label for="validationCustom03" class="form-label">Address</label>
    <input type="text" className="form-control loginForm-input" id="validationCustom03" placeholder="Enter your address" onChange = {(event) => this.handleLoginChange(event,'address')} required/>
    <div className="invalid-feedback">
      Please provide a valid Address.
    </div>
  </div>
<hr/>
  
  

    <div className="form-check loginForm-details">
      <input className="form-check-input" type="checkbox" value="" id="invalidCheck" required/>
      <label className="form-check-label" for="invalidCheck">
        Agree to terms and conditions
      </label>
      <div className="invalid-feedback">
        You must agree before submitting.
      </div>
    </div>
  

    <button class="btn btn-danger submitButton" type="submit" onClick = {this.createAccount}>Submit form</button>
  
               

          </div>
</div>
        </Modal>
      </div>
        </div>
    
    </div>
        )
    }
}

export default withRouter(Header);