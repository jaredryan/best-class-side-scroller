import React from 'react';
import Todo from "./Todo";
import { connect } from "react-redux";
import { editTodo, deleteTodo } from "../../redux/todos";

class TodoContainer extends React.Component {

    handleCompleted(e){
        this.props.editTodo(this.props.todo._id, {completed: e.target.checked})
    }

    handleRemove(){
        console.log(this.props)
        this.props.deleteTodo(this.props.todo._id);
    }

    render() {
        return (
            <Todo
            handleCompleted={this.handleCompleted.bind(this)}
            handleRemove={this.handleRemove.bind(this)}
                todo={this.props.todo}
                id={this.props.id}
                {...this.state}/>
        )
    }
}

export default connect(null,{ editTodo, deleteTodo })(TodoContainer);
