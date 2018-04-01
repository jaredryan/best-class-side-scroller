import React, {Component} from 'react';
import Navbar from './Navbar';
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import {connect} from "react-redux";
import {verify} from "../redux/auth";
import Signup from './Signup';
import Login from './Login';
import TodoList from './Todos';
import Profile from './Profile';
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
                    <Route exact path="/" render={()=>{
                        return isAuthenticated ?
                            <Redirect to= "/profile"/> :
                            <Signup {...this.props}/>
                    }}/>
                    <Route path="/login" render={()=>{
                        return isAuthenticated ?
                            <Redirect to= "/profile"/> :
                            <Login {...this.props}/>
                    }}/>
                    <ProtectedRoute path="/todos" component={TodoList}/>
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
