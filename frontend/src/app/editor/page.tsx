import { CreateArticleEditor } from "@/modules/features/article/components/articleEditor";

const Page = () => (
  <div className="editor-page">
    <div className="container page">
      <div className="row">
        <div className="col-md-10 offset-md-1 col-xs-12">
          <CreateArticleEditor />
        </div>
      </div>
    </div>
  </div>
);

export default Page;
