import React from 'react';
import { Routes as Switch, Route } from 'react-router-dom';
import Header from './header';
import Home from './home';
import About from './about';
import Footer from './footer';
import UnitDetail from './unitDetail';
import TeacherDetail from './teacherdetails';

import Login from './User/login';
import Register from './User/register';
import Dashboard from './User/dashboard';
import TeacherDashboard from './Teacher/dashboard';
import MyUnits from './User/MyUnits';
import TeacherMyUnits from './Teacher/TeUnits';
import FavouriteUnits from './User/favouriteunits';
import RecommendedUnits from './User/recommendedunits';
import ProfileSetting from './User/profilesetting';
import TeacherProfileSetting from './Teacher/teprofilesetting';

import ChangePassword from './User/changepassword';
import TeChangePassword from './Teacher/techangepassword';
import AddUnit from './Teacher/Addunits';
import MyUsers from './Teacher/myusers';
import StudentPerformance from './Teacher/studentperformance';

import TeacherLogin from './Teacher/login';
import TeacherRegister from './Teacher/register';
import MyResults from './User/myresults';
import PerformanceTrend from './User/performancetrend';
import AllUnits from './allunits';
import PopularUnits from './popularunits';
import FeatuedTeachers from './featuredteachers';
import CategoryUnits from './unitscategory';
import AddAssignment from './Teacher/AddAssignment';
import MyMoodle from './User/MyMoodle';
import TeacherSubmissions from './Teacher/TeacherSubmissions';


function Main() {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route path="/" element={<Home />}/>
        <Route path="/about" element={<About />}/>
        <Route path="/detail/:unit_id" element={<UnitDetail/>}/>
        <Route path="/teacher-detail/:teacher_id" element={<TeacherDetail/>}/>

        <Route path="/user-login" element={<Login/>}/>

        <Route path="/user-register" element={<Register/>}/>
        <Route path="/user-dashboard" element={<Dashboard/>}/>
        <Route path="/teacher-dashboard" element={<TeacherDashboard/>}/>

        <Route path="/my-units" element={<MyUnits/>}/>
        <Route path="/te-units" element={<TeacherMyUnits/>}/>
        <Route path="/all-units" element={<AllUnits/>}/>


        <Route path="/favourite-units" element={<FavouriteUnits/>}/>
        <Route path="/recommended-units" element={<RecommendedUnits/>}/>
        <Route path="/profile-setting" element={<ProfileSetting/>}/>
        <Route path="/te-profile-setting" element={<TeacherProfileSetting/>}/>
        <Route path="/my-results" element={<MyResults/>}/>

        <Route path="/change-password" element={<ChangePassword/>}/>
        <Route path="/te-change-password" element={<TeChangePassword/>}/>

        <Route path="/teacher-register" element={<TeacherRegister/>}/>
        <Route path="/teacher-login" element={< TeacherLogin/>}/>
        <Route path="/add-units" element={< AddUnit/>}/>
        <Route path="/add-assignment" element={< AddAssignment/>}/>
        

        <Route path="/my-users" element={< MyUsers/>}/>
        <Route path="/student-performance" element={< StudentPerformance/>}/>
        <Route path="/my-performance" element={< PerformanceTrend/>}/>
        <Route path="/popular-units" element={< PopularUnits/>}/>
        <Route path="/featured-teachers" element={< FeatuedTeachers/>}/>
        <Route path="/category/Introduction" element={< CategoryUnits/>}/>
        <Route path="/my-assignment" element={<MyMoodle />}/>
        <Route path="/assignment-submited" element={< TeacherSubmissions/>}/>


      </Switch>
      <Footer />
    </div>
  );
}

export default Main;
