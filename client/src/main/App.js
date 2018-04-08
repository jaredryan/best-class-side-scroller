import React, {Component} from 'react';
import Navbar from './Navbar';
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import {connect} from "react-redux";
import {verify} from "../redux/auth";
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';
import Reset from './Reset';
import ForgotPassword from "./ForgotPassword";
import Game from './Game';
import Title from './Title';
import ProtectedRoute from "./ProtectedRoute";

class App extends Component {
    componentDidMount(){
        this.props.verify();
    }

    render() {
        const isAuthenticated = this.props.user.isAuthenticated
        return (
            <div>
                <Navbar/>
                <Switch>
                    <Route exact path="/" component={Title}/>
                    <Route path="/signup" render={()=>{
                        return isAuthenticated ?
                            <Redirect to= "/game"/> :
                            <Signup {...this.props}/>
                    }}/>
                    <Route path="/login" render={()=>{
                        return isAuthenticated ?
                            <Redirect to= "/game"/> :
                            <Login {...this.props}/>
                    }}/>
                    <Route path="/forgot" render={()=>{
                        return isAuthenticated ?
                            <Redirect to= "/game"/> :
                            <ForgotPassword {...this.props}/>
                    }}/>
                    <Route path="/reset" render={()=>{
                        return isAuthenticated ?
                            <Redirect to= "/game"/> :
                            <Reset {...this.props}/>
                    }}/>
                    <ProtectedRoute path="/game" component={Game}/>
                    <ProtectedRoute path="/profile" component={Profile}/>
                </Switch>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state;
}

export default withRouter(connect(mapStateToProps, {verify})(App));
