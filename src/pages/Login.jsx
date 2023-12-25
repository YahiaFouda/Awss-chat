import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/Authorization";
import { db } from "../firebase";
import { Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { loginApi } from "../network/network";
import Loading from "../shared/loader/Loader";

const Login = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const setUserFBData = async (adminId, name) => {
    try {
      await setDoc(doc(db, "admins", adminId.toString()), {
        adminId,
        name,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const body = {
        userName: data.username,
        password: data.password,
      };
      setTimeout(() => {
        loginApi(
          body,
          (success) => {
            if (success.success) {
              const { id, fullName } = success.data;
              dispatch(login(success.data));
              setUserFBData(id, fullName);
              setErrorState(null);
              setLoading(false);
              navigate("/home");
            } else {
              setErrorState(success.data.message);
              setLoading(false);
            }
          },
          (fail) => console.log(fail),
          false,
        );
      }, 1000);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className='formContainer'>
        <div className='formWrapper'>
          <span className='logo'>AWSS Chat</span>
          <span className='title'>Login</span>
          {errorState && (
            <Alert variant={"danger"} className='text-center'>
              {errorState}
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("username", { required: true })}
              placeholder='Username'
            />
            {errors.username && (
              <span className='error'>Username is required</span>
            )}

            <input
              {...register("password", { required: true })}
              type='password'
              placeholder='Password'
            />
            {errors.password && (
              <span className='error'>Password is required</span>
            )}

            <button type='submit'>Sign in</button>
            {errorState && <span>Something went wrong</span>}
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
