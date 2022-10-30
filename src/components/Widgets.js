import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

const Widget = ({color, title, icon, ticketCount, pathColor}) =>{

    return(

        <div className="col-xs-12 col-lg-3 col-md-6">
            <div className={`card shadow bg-${color} bg-opacity-25`} style={{ width: 15 + 'rem' }}>
                <h5 className={`card-subtitle m-2 fw-bolder text-center text-${color} `}><i className={`bi bi-${icon}`}>{title}</i></h5>
                <hr />
                <div className="row mb-2 d-flex align-items-center">
                    <div className={`col text-${color} mx-4 fw-bolder display-6`}>{ticketCount}</div>
                    <div className="col">
                        {/* size of circular bar */}
                        <div style={{ width: 40, height: 40 }}>
                            {/* how to use?
              import from top
               value={the count of tickets}
               buildStyle({}): a function that accepts obj. obj takes css styles in key value format. colors can be accepted in hex, rgpa, and text names */}
                            <CircularProgressbar value={ticketCount} styles={buildStyles({
                                pathColor: `${pathColor}`
                            })} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Widget;