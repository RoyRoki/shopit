import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context';
import LogoutComponent from '../components/LogoutComponent';
import UserInfo from '../components/user/UserInfo';
import { request } from '../helper/AxiosHelper';
import { urls } from '../util/URLS';
import { userHeroDiv } from '../util/HERODIV';
import EditUserDetails from '../components/user/EditUserDetails';
import ToggleButton from '../components/ToggleButton';
import UserHome from '../components/user/UserHome'
import { userPath } from '../util/PATHVALUE';
import { Outlet, replace, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserDetails } from '../features/user/UserDetailsSlice';

export const UserPage = ({ pathVal }) => {
      const { auth } = useContext(AuthContext);
      const dispatch = useDispatch();
      const { userDto, loading, error } = useSelector((state) => state.userDetails);
      const navigate = useNavigate();

      const [heroDiv, setHeroDiv] = useState(userHeroDiv.home);

      const handlePathVal = () => {
            if(pathVal === userPath.home) {
                  setHeroDiv(userHeroDiv.home);
            } else if(pathVal === userPath.edit) {
                  setHeroDiv(userHeroDiv.editUser);
            }
      }
      
      const onCompleteUserDetailsUpdate = async () => {
            dispatch(fetchUserDetails());
            navigate("/user/home", replace);
      }

      useEffect(() => {
            handlePathVal();
            dispatch(fetchUserDetails());
      }, [pathVal, dispatch]);

      const showEditDetails = (toggle) => {
            
            if(toggle === false) {
                  navigate("/user/home", replace);
            }
            if(toggle === true) {                  
                  navigate("/user/edit", replace)
            }
      }
      
      
      return (
            <>
                  <h1>{auth.profileMode} home </h1>
                  {userDto !== null && (
                        
                        <div>
                              <UserInfo userDto={userDto} />
                              <div>
                                    <ToggleButton
                                          toggle={heroDiv === userHeroDiv.home}
                                          setToggle={(toggle) => navigate("/home", replace)}
                                          forTrueText={'🛖'}
                                          forFalseText={'🏕️'}
                                    />
                                    <ToggleButton
                                          toggle={heroDiv === userHeroDiv.editUser}
                                          setToggle={showEditDetails}
                                          forTrueText={'✖️ cancel'}
                                          forFalseText={'🪄 Edit'}
                                    />
                              </div>

                              <div>
                                    {heroDiv === userHeroDiv.home && (
                                          <UserHome userDto={userDto}/>
                                    )}
                                    {heroDiv === userHeroDiv.editUser && (
                                          <EditUserDetails userDto={userDto} onComplete={onCompleteUserDetailsUpdate}/>
                                    )}
                              </div>
                        </div>
                  )}
                  <LogoutComponent />
            </>
      );
};

