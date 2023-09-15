import { SingleThreadCard } from "./SingleThreadCard";
import { HomePageThreadPagination } from "./HomePageThreadPagination";

export const ThreadViewerHomepage = () => {
  return (
    <div className={"home-thread-bg shadow"}>
      <div className="container-fluid">
        <div className="d-flex justify-content-between">
          <div className="p-2">
            <select
              className="form-select form-select-md"
              aria-label="Default select example"
            >
              <option selected>Trending</option>
              <option value="1">Newest First</option>
              <option value="2">Oldest First</option>
              <option value="3">Most Voted</option>
              <option value="3">Most Viewed</option>
            </select>
          </div>
          <div className="pt-2">
            <h4 className="fw-bold">Threads</h4>
          </div>
          <div className="p-2">
            <a type="button" className="btn btn-md btn-outline-dark" href="#">
              Create Thread
            </a>
          </div>
        </div>
      </div>

      <div className="container d-flex align-items-center ">
        <div className="row">
          <SingleThreadCard />
          <SingleThreadCard />
          <SingleThreadCard />
          <SingleThreadCard />
          <SingleThreadCard />
          <SingleThreadCard />
        </div>
      </div>

      <HomePageThreadPagination />
    </div>
  );
};