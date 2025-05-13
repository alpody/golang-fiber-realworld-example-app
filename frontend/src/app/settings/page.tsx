import { LogoutButton } from "@/modules/features/auth/components/logoutButton";
import { fetchCurrentUser } from "@/modules/features/auth/fetch/fetchCurrentUser";
import { Suspense } from "react";
import { SettingsForm } from "./_components";

const Page = async () => {
  const user = fetchCurrentUser();

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            <Suspense fallback={<p>⌛Loading...</p>}>
              <SettingsForm user={user} />
            </Suspense>
            <hr />
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
