import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../../../../Auth/GlobalContext";
import ThreadViewerModel from "../../../../models/ThreadViewerModel/ThreadViewerModel";
import {SingleThreadCard} from "../../../HomePage/HomeHero/ThreadViewerHomepage/SingleThreadCard";

export const AllSearchBlog = () => {
    const {globalSearchText} = useContext(GlobalContext);
    const [threads, setThreads] = useState<ThreadViewerModel[]>([]);
    const commonVerb:string[] = ["a", "an", "the", "I", "you", "your", "his", "hers", "him", "her", "ours", "as", "at", "by", "to", "for", "from", "in", "into", "of", "onto", "and", "or", "but", "unless", "since", "because", "although", "am", "is", "are", "was", "were",]


    useEffect(() => {
        const fetchDoctor = async () => {
            let searchText = globalSearchText.split(' ');
            let finalSearchText = [];
            for (const word in searchText){
                if (!(commonVerb.includes(searchText[word]))){
                    finalSearchText.push(searchText[word]);
                }
            }
            const baseUrl: string = "http://localhost:8080/api";


            let url = `${baseUrl}/blogs?page=0&size=10000`;
            let response = await fetch(url);
            let responseJson = await response.json();
            let responseData = responseJson.content;

            const loadedThreads: ThreadViewerModel[] = [];

            for (const key in responseData){
                let words = responseData[key].blogBody.split(' ');
                for (const w in finalSearchText){
                    if (words.includes(finalSearchText[w])){
                        let user_id: string = responseData[key].uploaderId;
                        const resp = await fetch(`${baseUrl}/users/search/findUserByUserId?userId=${user_id}`);
                        const respJson = await resp.json();
                        const respData = respJson._embedded.users[0];

                        let current_date: string = responseData[key].blogDateTxt;
                        const topicResp = await fetch(`${baseUrl}/threadTopics/search/findByUploaderIdAndThreadDateTopicTxt?uploaderId=${user_id}&threadDateTopicTxt=${current_date}`);
                        const topicRespJson = await topicResp.json();
                        const topicRespData =  topicRespJson._embedded.blogTopics;
                        let topic_array: string[] = [];
                        for (const topic in topicRespData){
                            topic_array.push(topicRespData[topic].topicTitle);
                        }

                        let tempEle: ThreadViewerModel = {
                            uploaderId: responseData[key].uploaderId,
                            threadTitle: responseData[key].blogTitle,
                            threadBody: responseData[key].blogBody,
                            threadDate: responseData[key].blogDate,
                            threadDateTxt: responseData[key].blogDateTxt,
                            threadTrendView: responseData[key].blogTrendView,
                            userName: responseData[key].uploaderId,
                            userType: respData.userType,
                            userPicture: respData.picture,
                            threadTopics: topic_array
                        };
                        if (!(loadedThreads.includes(tempEle))){
                            loadedThreads.push(tempEle);
                        }
                        break;
                    }
                }
            }
            setThreads(loadedThreads);
        };
        fetchDoctor()
    }, []);
    return (
        <div className="container-fluid m-0 p-0 shadow-sm" style={{background: "#293f41", borderRadius: '0.7rem'}}>
            <div className="d-flex ps-2 mt-1 justify-content-between" style={{background: "#192228", height:'56px', borderTopLeftRadius: '0.7rem', borderTopRightRadius: '0.7rem'}}>
                <div className="text-white">
                    <h1>
                        Blogs
                    </h1>
                </div>
            </div>
            <div className="row justify-content-center mt-md-2 ps-2 pe-2 pb-3 m-2">
                {threads.splice(0,6).map( thread=>
                    <SingleThreadCard thread={thread}/>
                )}
            </div>

        </div>
    );
};

