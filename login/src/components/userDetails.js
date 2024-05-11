import React, { Component } from "react";

export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: "",
    };
  }
  
  componentDidMount() {
    fetch("http://localhost:5000/userData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userData");
        this.setState({ userData: data.data });
      });
  }

  render() {
    return (
      <div className="auth-wrapper">
       <div className="auth-inner">
        Name:<h1>{this.state.userData.fname}</h1>
        Email:<h1>{this.state.userData.email}</h1>
      </div>
    </div>
    );
  }
}
