import UserModel  from "../../../models/UserModel";
import React, {useContext, useEffect, useState} from "react";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import {UserContext} from "../../../Auth/UserContext";
import {GlobalContext} from "../../../Auth/GlobalContext";
import {ThreadViewerUserProfile} from "./ThreadViewerUserProfile";
import {useHistory} from "react-router-dom";
import {FollowingList} from "./FollowingList";
import UserService from "../../../Service/UserService";

export const UserProfile = () => {

  const {globalUserId} = useContext(GlobalContext);

  const {current_user_id, current_user_type} = useContext(UserContext);

  const [user, setUser] = useState<UserModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [isOwner, setisOwner] = useState(false);
  const [totalFollowing, settotalFollowing] = useState(0);
  const [currentState, setcurrentState] = useState<string>('Timeline');

  const [newDp, setnewDp] = useState<any>("");

  const history = useHistory();

  useEffect(() => {
    if (current_user_id == globalUserId){
      setisOwner(true);
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const baseUrl: string = "http://localhost:8080/api";
      const url: string = `${baseUrl}/users/search/findUserByUserId?userId=${globalUserId}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const responseJson = await response.json();
      const responseData = responseJson._embedded.users[0];
      let tempUser: UserModel = {
        userId: responseData.userId,
        userName: responseData.userName,
        email: responseData.email,
        password: responseData.password,
        address: responseData.address,
        phone: responseData.phone,
        userType: responseData.userType,
        picture: responseData.picture
      };
      setUser(tempUser);
      setIsLoading(false);
    };
    fetchProfile().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    })
  }, [user]);



  useEffect(() => {
    const fetchProfile = async () => {
      const baseUrl: string = "http://localhost:8080/api";
      const url: string = `${baseUrl}/followingTables/search/findAllByFollowerId?followerId=${globalUserId}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const responseJson = await response.json();
      const responseData = responseJson.page.totalElements;
      settotalFollowing(responseData);
    };
    fetchProfile().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    })
  }, []);


  if (isLoading) {
    return (
        <SpinnerLoading/>
    )
  }

  if (httpError) {
    return (
        <div className='container m-5'>
          <p>{httpError}</p>
        </div>
    )
  }

  let toggleTimeline  = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (currentState == 'Timeline'){
    setcurrentState("Following")
    }
    else {
    setcurrentState("Timeline")
    }
  }

  function getBase64(file: any) {

    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setnewDp(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error', error);
    }
  }

  let uploadProfilePicture  = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    UserService.dpChanged(current_user_id, newDp).then();
    setnewDp("");
  }

  return (
    <div className="d-flex container-fluid">
      <div className="row">
        <div className="col-lg-2 m-2 ms-0 mt-0 p-1 user-profile-bg">
          <div>
            {newDp!=""?
                <img
                    className="img-fluid p-1 shadow"
                    src={newDp}
                    height='250'
                    alt="Profile Image"
                    loading="eager"
                />
                :
                user?.picture?
                    <img
                        className="img-fluid p-1 shadow"
                        src={user?.picture}
                        height='250'
                        alt="Profile Image"
                        loading="eager"
                    />
                    :
                    <img
                        className="img-fluid p-1 shadow"
                        src={require("./../../../images/Placeholder-images/placeholder-dp.png")}
                        height='250'
                        alt="Profile Image"
                        loading="eager"
                    />

            }

          </div>

          {globalUserId == current_user_id&&
              <div className="d-flex">


                    <div>
                      {newDp==""?
                          <div>
                          <label className="form-label text-white m-1" htmlFor="dpfileinput">
                            <div className="btn btn-dark">Change Your Profile Picture</div>
                          </label>
                          <input type="file" accept="image/png, image/jpg, image/jpeg" className="form-control d-none"
                                 id="dpfileinput"  onChange={(event) => {

                            if (event.target.files){
                              getBase64(event.target.files[0])
                            }
                          }}/>
                          </div>
                          :
                          <div className='mt-1'>
                            <div className="btn btn-danger" onClick={(event) =>{
                              setnewDp("");}}>Discard
                            </div>
                            <div className='btn btn-info ms-2' onClick={uploadProfilePicture}>
                              Submit
                            </div>
                          </div>
                      }
                    </div>


              </div>
          }

          <div className="pt-3">
            <p className="fw-bold fs-4 m-0">{user?.userName}</p>
            <p>@{user?.userId}</p>
          </div>

          


          {currentState=='Following'&&
              <div>
                <a href="#" className="btn btn-outline-dark mb-1" onClick={toggleTimeline}>
                  Timeline
                </a>
              </div>
          }

          {currentState=='Timeline'&&
              <div>
                <a href="#" className="btn btn-outline-dark" onClick={toggleTimeline}>
                  Following {totalFollowing} Doctors
                </a>
              </div>
          }
        </div>
        {currentState == 'Timeline'&&
            <div className="col-lg-9 mt-1">
              <ThreadViewerUserProfile userId={globalUserId}/>
            </div>
        }
        {currentState == 'Following'&&
            <div className="col-lg-9 mt-1">
              <FollowingList/>
            </div>
        }

      </div>
    </div>
  );
};

