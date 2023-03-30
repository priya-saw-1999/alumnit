import AlumnITLogo from "../images/alumnit_logo.svg";
import Navbar from "../component/Navbar.jsx";
import PostCard from "../component/PostCard";
import CommunityPostButton from "../component/CommunityPostButton";
import UserProfile from "../component/UserProfle";
import "./Community.css";
import { useState, useContext, useEffect } from "react";
import Popup from "reactjs-popup";
import ProfileEditForm from "../component/ProfileEditForm";
import CurrentUserContext from "../context/LoggedInUser/CurrentUserContext";
import CommunityPostsContext from "../context/CommunityPost/CommunityPostsContext";
import MentorCard from "../component/MentorCard/MentorCard.jsx";

const Community = (props) => {
  const currentUser = useContext(CurrentUserContext);
  // const [postArray, setPostArray] = useState([]);
  const { CommunityPostList, updateCommunityPostList } = useContext(CommunityPostsContext);
  const [randomProfiles, setRandomProfiles] = useState([]);

  const profile = {
    id: "63f1e38f0666421fed18d222",
    profileImg:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600",
    fullName: "Lokesh Patil",
    title: "It Student",
    experiences: [
      {
        organization: "TataConsultancyServices",
        role: "AssistantSystemEngineer",
      },
      {
        organization: "TataConsultancyServices",
        role: "AssistantSystemEngineer",
      },
    ],
    skills: [
      "Python(ProgrammingLanguage)",
      "HTML",
      "CascadingStyleSheets(CSS)",
      "HTML5",
      "Bootstrap",
    ],
    education: [],
    certifications: ["SalesforceCertifiedPlatformDeveloperI", "GestureControlledRobot"],
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const postsResponse = await fetch("http://localhost:3001/community/getAllPosts", {
        method: "GET",
        credentials: "include",
      });
      if (postsResponse.status === 200) {
        const resJson = await postsResponse.json();
        console.log(resJson);
        updateCommunityPostList(resJson);
        console.log("Post Array:", CommunityPostList);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchRandomProfiles = async () => {
      const response = await fetch("http://127.0.0.1:5000/getRandomProfiles");
      const resJson = await response.json();
      const temp_recommendedProfiles = [];
      resJson.forEach((userProfile) => {
        let experiences = [];
        for (let i = 0; i < userProfile.experiences.length / 2; i += 2) {
          experiences.push({
            org: userProfile.experiences[i],
            role: userProfile.experiences[i + 1],
          });
        }
        const profile = {
          id: userProfile._id,
          profileImg:
            "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600",
          fullName: userProfile.fullName,
          title: userProfile.title,
          skills: userProfile.skills,
          certifications: userProfile.certifications,
          experiences: experiences,
        };
        temp_recommendedProfiles.push(profile);
      });
      setRandomProfiles(temp_recommendedProfiles);
    };

    fetchRandomProfiles();
  }, []);

  return (
    <div className="Community">
      <Navbar shadowNavbar={true} />

      <div className="communityContainer">
        <div className="communityPostContainer">
          {currentUser.state ? (
            <CommunityPostButton ProfilePicture={currentUser.state.User.ProfilePicture} />
          ) : (
            <h4>Login To Post</h4>
          )}

          {CommunityPostList.map((post) => (
            <PostCard
              profileImage={post.ProfilePicture}
              username={post.Username}
              description={post.TextContent}
              postImage={post.ImageContent}
            />
          ))}
        </div>
        <div className="alumniProfileContainer">
          <center>
            <h5>Find Your Mentor</h5>
          </center>
          <div className="flex-container">
            {randomProfiles.map((randomProfile) => (
              <MentorCard profile={randomProfile} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
