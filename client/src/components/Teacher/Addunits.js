import { Link } from "react-router-dom";
import TeacherSidebar from "./sidebar";
function AddUnit(){
    return(
        <div className='container  mt-4'>
            <div className='row'>
                <aside className="col-md-2">
                    <TeacherSidebar/>
                </aside>
                <section className="col-md-9">
                    <div className='card'>
                        <h5 className='class-header'> Add Units </h5>
                        <div className='card-body'>
                            <form>
                                <div className="mb-3">
                                    <label for='title' className="form-label">Title</label>
                                    <input type="text" id="title" className="form-control"/>
                                </div>
                                <div className="mb-3">
                                    <label for='title' className="form-label">Description</label>
                                    <textarea className="form-control" id="title" ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label for='video' className="form-label"> Unit Videos</label>
                                    <div className="col-sm-10">
                                        <input type="file" className="form-control" id="inputVedio"/>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label for='title' className="form-label">Importance Areas</label>
                                    <textarea className="form-control" id="title" ></textarea>
                                </div>
                                <hr/>
                                <button className='btn btn-warning'> Add Unit </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>

    )
}
export default AddUnit;