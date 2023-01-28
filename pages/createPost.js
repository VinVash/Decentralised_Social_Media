import Form from "../components/Form/Form";
import NewForm from "../components/Form/NewForm";

function LayoutHeader({ children }) {
  return (
    <div className="flex justify-center min-h-screen bg-gray-100 pt-24 pb-8">
      <div className="w-1/2 px-12 py-4 mx-auto bg-white rounded-lg shadow-xl">
        {/*middle wall*/}
        <div className="max-w-md mx-auto space-y-6">
          {/* Component starts here */}
          <h2 className="flex flex-row flex-nowrap items-center my-8">
            <span
              className="flex-grow block border-t border-black"
              aria-hidden="true"
              role="presentation"
            />
            <span className="flex-none block mx-4 px-4 py-2.5 leading-none font-medium uppercase bg-black text-white tracking-widest">
              Create Post
            </span>
            <span
              className="flex-grow block border-t border-black"
              aria-hidden="true"
              role="presentation"
            />
          </h2>
          {/* Component ends here */}
          {children}
        </div>
      </div>
    </div>
  );
}

const createPost = () => {
  return (
    <>
      <LayoutHeader>
        <div className="mt-6 divide-y-2">
          <NewForm />
        </div>
      </LayoutHeader>
    </>
  );
};

export default createPost;
