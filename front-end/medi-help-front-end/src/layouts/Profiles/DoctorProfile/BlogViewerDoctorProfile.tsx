import { SingleBlogCardDoctorProfile } from "./SingleBlogCardDoctorProfile";
import React, {useContext, useEffect, useState} from "react";
import BlogViewerModel from "../../../models/BlogViewerModel/BlogViewerModel";
import {SpinnerLoading} from "../../utils/SpinnerLoading";
import {Pagination} from "../../utils/Pagination";
import {UserContext} from "../../../Auth/UserContext";
import {Link} from "react-router-dom";
import TopicTable from "../../../models/TopicTable";
import {TopicBadge} from "../../utils/TopicBadge";
import BlogServices from "../../../Service/BlogServices";
import BlogPictureService from "../../../Service/BlogPictureService";
import BlogTopicService from "../../../Service/BlogTopicService";

export const BlogViewerDoctorProfile: React.FC<{userId: string}> = (props) => {

  const {isAuthorised, current_user_id} = useContext(UserContext);

  const [blogs, setBlogs] = useState<BlogViewerModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [BlogsPerPage] = useState(15);
  const [totalAmountOfBlogs, setTotalAmountOfBlogs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categorySelection, setCategorySelection] = useState('Trending');
  const [searchUrl, setSearchUrl] = useState(`&sort=blogTrendView,desc`);
  const [postOpen, setpostOpen] = useState('false')

  const [textTitle, settextTitle] = useState("");
  const [textBody, settextBody] = useState("");
  const [imgArray, setimgArray] = useState<any[]>([]);
  const [topicTable, settopicTable] = useState<TopicTable[]>([]);
  const [selectedTopic, setselectedTopic] = useState<string[]>([]);



  useEffect(() => {
    const fetchTopic = async () => {
      const baseUrl: string = "http://localhost:8080/api";

      const url: string = `${baseUrl}/topicTables`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const responseJson = await response.json();

      const responseData = responseJson._embedded.topicTables;

      const loadedTopics: TopicTable[] = [];

      for (const key in responseData) {

        loadedTopics.push({
          topicName: responseData[key].topicName
        });
      }
      settopicTable(loadedTopics);

    };
    fetchTopic().catch((error: any) => {
      setHttpError(error.message);
    })
  }, []);


  useEffect(() => {
    const fetchBlogs = async () => {
      const baseUrl: string = "http://localhost:8080/api";

      const url: string = `${baseUrl}/blogs/search/findAllByUploaderId?uploaderId=${props.userId}&page=${currentPage-1}&size=${BlogsPerPage}${searchUrl}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const responseJson = await response.json();

      const responseData = responseJson._embedded.blogs;

      setTotalAmountOfBlogs(responseJson.totalElements);
      setTotalPages(responseJson.totalPages);

      const loadedBlogs: BlogViewerModel[] = [];

      for (const key in responseData) {

        let user_id: string = responseData[key].uploaderId;
        const resp = await fetch(`${baseUrl}/users/search/findUserByUserId?userId=${user_id}`);
        const respJson = await resp.json();
        const respData = respJson._embedded.users[0];

        let current_date: string = responseData[key].blogDateTxt;
        const topicResp = await fetch(`${baseUrl}/blogTopics/search/findByUploaderIdAndBlogDateTopicTxt?uploaderId=${user_id}&blogDateTopicTxt=${current_date}`);
        const topicRespJson = await topicResp.json();
        const topicRespData =  topicRespJson._embedded.blogTopics;
        let topic_array: string[] = [];
        for (const topic in topicRespData){
          topic_array.push(topicRespData[topic].topicTitle);
        }

        loadedBlogs.push({
          uploaderId: responseData[key].uploaderId,
          blogTitle: responseData[key].blogTitle,
          blogBody: responseData[key].blogBody,
          blogDate: responseData[key].blogDate,
          blogDateTxt: responseData[key].blogDateTxt,
          blogTrendView: responseData[key].blogTrendView,
          userName: responseData[key].uploaderId,
          userType: respData.userType,
          userPicture: respData.picture,
          blogTopics: topic_array
        });
      }

      setBlogs(loadedBlogs);
      setIsLoading(false);
    };
    fetchBlogs().catch((error: any) => {
      setHttpError(error.message);
    })
    // window.scrollTo(0, 0);
  }, [currentPage, searchUrl, blogs]);

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

  const indexOfLastBook: number = currentPage * BlogsPerPage;
  const indexOfFirstBook: number = indexOfLastBook - BlogsPerPage;
  let lastItem = BlogsPerPage * currentPage <= totalAmountOfBlogs ?
      BlogsPerPage * currentPage : totalAmountOfBlogs;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);



  const categoryField = (value: string) => {
    if (value === 'Newest First') {
      setCategorySelection(value);
      setSearchUrl(`&sort=blogDate,desc`);
    }
    else if (value === 'Oldest First') {
      setCategorySelection(value);
      setSearchUrl(`&sort=blogDate`);
    }
    else if (value === 'Most Voted') {
      setCategorySelection(value);
      setSearchUrl(`&sort=blogUpvote,desc`);
    }
    else if (value === 'Most Viewed') {
      setCategorySelection(value);
      setSearchUrl(`&sort=blogView,desc`);
    }
    else {
      setCategorySelection('Trending');
      setSearchUrl(`&sort=blogTrendView,desc`);
    }
  }

  const CreateBlogClicked = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setpostOpen('true');
  }
  const DiscardClicked = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setpostOpen('false');
    setimgArray([]);
    settextTitle("");
    settextBody("");
    setselectedTopic([]);
  }

  const TitleChanged = (event: React.MouseEvent<HTMLInputElement>) => {
    settextTitle(event.currentTarget.value);
  }

  const BodyChanged = (event: React.MouseEvent<HTMLTextAreaElement>) => {
    settextBody(event.currentTarget.value);
  }

  const topicSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if(event.target.value != "default"){
      if (!(event.target.value in selectedTopic) && selectedTopic.length<3){
        let tempArray: string[] = [];
        for (const val in selectedTopic){
          tempArray.push(selectedTopic[val]);
        }
        tempArray.push(event.target.value);
        setselectedTopic(tempArray);
      }
    }
  }

  const postClicked = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    let date = new Date().toJSON()
    if (textTitle.length>4 && textBody.length>5 && topicSelected.length>0) {
      let blog = {
        "uploaderId": current_user_id,
        "blogTitle": textTitle,
        "blogBody": textBody,
        "blogDate": date,
        "blogDateTxt": date,
        "blogView": 0,
        "blogTrendView": 0,
        "blogUpvote": 0,
        "blogDownvote": 0
      }
      BlogServices.postBlog(blog).then();
      if (imgArray.length>0) {
        for (const key in imgArray) {
          let blogPicture = {
            "uploaderId": current_user_id,
            "blogDate": date,
            "blogDateTxt": date,
            "blogSinglePicture": imgArray[key]
          }
          BlogPictureService.createBlogPicture(blogPicture).then();
        }
      }
      for(const key in selectedTopic){
        let blogTopic = {
          "uploaderId" : current_user_id,
          "blogDateTopic" : date,
          "blogDateTopicTxt": date,
          "topicTitle": selectedTopic[key]
        }
        BlogTopicService.createBlogTopic(blogTopic).then();
      }
      setimgArray([]);
      settextTitle("");
      settextBody("");
      setselectedTopic([]);
      setpostOpen('false');

    }
  }

  function getBase64(file: any) {
    let tempImg: any = [];
    for(let i in imgArray) {
      tempImg.push(imgArray[i]);
    }
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      tempImg.push(reader.result);
      setimgArray(tempImg);
    };
    reader.onerror = function (error) {
      console.log('Error', error);
    }
  }





  return (
      <div className={"home-thread-bg shadow"}>
        <div className="container-fluid">
          <div className="d-flex justify-content-between">
              <div className='dropdown p-2'>
                <button className='btn bg-white dropdown-toggle' type='button'
                        id='dropdownMenuButton1' data-bs-toggle='dropdown'
                        aria-expanded='false'>
                  {categorySelection}
                </button>
                <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                  <li onClick={() => categoryField('Trending')}>
                    <a className='dropdown-item' href='#'>
                      Trending
                    </a>
                  </li>
                  <li onClick={() => categoryField('Newest First')}>
                    <a className='dropdown-item' href='#'>
                      Newest First
                    </a>
                  </li>
                  <li onClick={() => categoryField('Oldest First')}>
                    <a className='dropdown-item' href='#'>
                      Oldest First
                    </a>
                  </li>
                  <li onClick={() => categoryField('Most Voted')}>
                    <a className='dropdown-item' href='#'>
                      Most Voted
                    </a>
                  </li>
                  <li onClick={() => categoryField('Most Viewed')}>
                    <a className='dropdown-item' href='#'>
                      Most Viewed
                    </a>
                  </li>
                </ul>
              </div>
            <div className="pt-2">
              <h4 className="fw-bold">Blogs</h4>
            </div>
            <div className="p-2">
              {isAuthorised=='false'?
                  <Link type="button" className="btn btn-md btn-outline-dark" to='/login'>
                    Sign in
                  </Link>
                  :
                  props.userId === current_user_id ?
                    postOpen === 'true'?
                        <div>
                          <button type="button" className="btn btn-md btn-outline-danger me-3" onClick={DiscardClicked}>
                            Discard
                          </button>
                          <button type="button" className="btn btn-md btn-outline-success" onClick={postClicked}>
                            Post
                          </button>
                        </div>
                        :

                        <button type="button" className="btn btn-md btn-outline-dark" onClick={CreateBlogClicked}>
                          Create Blog
                        </button>
                      :
                      <span></span>
              }

            </div>
          </div>
        </div>

        {postOpen === 'true'&&
            <div className="card m-2 shadow">
              <div className="mb-3 ms-1 mt-1 me-1">
                <input className="form-control shadow fw-bold" id="textTitle" maxLength={250} placeholder="Title" onInput={TitleChanged}/>
              </div>
              <div className="mb-1 ms-1 me-1">
                <textarea className="form-control shadow" id="textBody" maxLength={60000} rows={7} placeholder="Your Question" onInput={BodyChanged}></textarea>
              </div>

              <div className="d-flex">

                {imgArray.length>0 &&
                    imgArray.map(ig => (
                        <div>
                            <img className='m-1' src={ig} alt="Thread Image" height={60} width={60}/>
                        </div>
                      ))
                }


                {imgArray.length<=2&&
                  <div>
                  <label className="form-label text-white m-1" htmlFor="customFile1">
                    <div className="add-image"></div>
                  </label>
                  <input type="file" accept="image/png, image/jpg, image/jpeg" className="form-control d-none"
                         id="customFile1"  onChange={(event) => {

                           if (event.target.files){
                             getBase64(event.target.files[0])
                           }
                  }}/>
                </div>}

              </div>

              <div className="d-flex card-body p-0">
                {selectedTopic.length<3&&
                <div className='mb-1 ms-1'>
                      <select className="form-select shadow" id="typeSelect" onChange={topicSelected}>
                        <option selected value='default'> Select at least one Topic</option>
                        {topicTable.map(topic => (
                            <option value={topic.topicName}>{topic.topicName}</option>
                        ))}
                      </select>
                </div>
                }
                {selectedTopic.length>0&&
                    selectedTopic.map(topic => (
                        <span className="m-1">
                            <TopicBadge topic={topic}/>
                        </span>
                    ))
                }
              </div>
            </div>
        }


        <div>
          {blogs.map(blog => (
              <SingleBlogCardDoctorProfile blog={blog}/>
          ))}
        </div>
        {totalPages>1 &&
            <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
        }
      </div>
  );
};
