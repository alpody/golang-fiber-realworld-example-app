import { Button } from "@/modules/common/components/button";
import { fetchCurrentUser } from "@/modules/features/auth/fetch/fetchCurrentUser";
import { FollowButton } from "@/modules/features/profile/components/followButton";
import { fetchProfile } from "@/modules/features/profile/fetch/fetchProfile";
import { getSession } from "@/utils/auth/session";
import { ReactNode } from "react";
import { showEditProfileSettingsButton, showFollowButton } from "./_functions";

type Props = {
  children: ReactNode;
  params: Promise<{
    username: string;
  }>;
};

const Layout = async ({ children, params }: Props) => {
  const profile = await fetchProfile((await params).username);
  const currentUser = (await getSession()) ? await fetchCurrentUser() : undefined;

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              {profile.image && <img src={profile.image} className="user-img" alt="" />}
              <h4>{profile.username}</h4>
              {profile.bio && <p>{profile.bio}</p>}
              {showFollowButton(profile.username, currentUser) && <FollowButton {...profile} color="secondary" />}
              {showEditProfileSettingsButton(profile.username, currentUser) && (
                <Button component="a" href="/settings" className="action-btn" color="secondary">
                  <i className="ion-plus-round"></i> Edit Profile Settings
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
