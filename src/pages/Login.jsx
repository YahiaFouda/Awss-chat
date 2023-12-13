import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/Authorization";
import { db } from "../firebase";
import { Alert } from "react-bootstrap";


import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import {loginApi} from '../network/network'
import Loading from "../shared/loader/Loader";

const Login = () => {
  const dispatch = useDispatch();
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorState, updateErrorState] = useState(false);

  const navigate = useNavigate();
  const setUserFBData = async (adminId, name) => {
	try {
		await setDoc(doc(db, "admins", adminId.toString()), {
			adminId, name
		  });
		  } catch (error) {
	}
		
	};

  const handleSubmit = async (e) => {
	e.preventDefault();
	 try {
		setLoading(true);
      const body = {
				userName: e.target[0].value,
				password: e.target[1].value
			};
			setTimeout(()=>{
				loginApi(
					body,
					(success) => {
						
						if (success.success) {
							const { id, fullName } = success.data;
							dispatch(login(success.data));
							setUserFBData(id, fullName);
							updateErrorState(null);
							setLoading(false);
							navigate("/")
							
						} else {
							updateErrorState(success.data.message);
							setLoading(false);
						}
					},
					(fail) => console.log(fail),
					false
				);
			},1000)
     
     
    } catch (err) {
		setLoading(false);
      setErr(true);
    }
  ;
  
  }
  return (
	<>
	{loading&&<Loading/>}
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">AWSS Chat</span>
        <span className="title">Login</span>
        {errorState && (
				<Alert variant={"danger"} className="text-center">
					{errorState}
				</Alert>
			)}
        <form onSubmit={handleSubmit}>
          <input  placeholder="username" />
          <input type="password" placeholder="password" />
          <button>Sign in</button>
          {err && <span>Something went wrong</span>}
        </form>
      </div>
    </div>
	</>
  );
};

export default Login;
