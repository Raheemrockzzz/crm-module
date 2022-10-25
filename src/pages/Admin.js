import React, { useEffect, useState } from "react";
import MaterialTable from "@material-table/core";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { ExportPdf } from '@material-table/exporters';
import { ExportCsv } from "@material-table/exporters";

import { fetchTicket } from "../api/tickets";
import Sidebar from "../components/Sidebar";

const lookup = { true: "Available", false: "Unavailable" };

const columns = [
  { title: "ID", field: "id" },
  { title: "TITLE", field: "title" },
  { title: "DESCRIPTION", field: "description" },
  { title: "REPORTER", field: "reporter" },
  { title: "ASSIGNEE", field: "assignee" },
  { title: "ticketPRIORITY", field: "ticketPriority" },
  {
    title: "STATUS", field: "status",
    lookup: {
      "OPEN": "OPEN",
      "IN_PROGRESS": "IN_PROGRESS",
      "CLOSED": "CLOSED",
      "BLOCKED": "BLOCKED"
    }
  },
];
const userColumns = [
  { title: "ID", field: "id" },
  { title: "NAME", field: "name" },
  { title: "EMAIL", field: "email" },
  { title: "ROLE", field: "role" },
  { title: "STATUS", field: "status" },
];




const Admin = () => {

  const [ticketDetails, setTicketDetails] = useState([]);
  const [ticketStatusCount, setTicketStatusCount] = useState({});
  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = () => {
    fetchTicket().then((response) => {
      setTicketDetails(response.data)
      updateTicketCount(response.data)
    }).catch((error) => {
      console.log(error);
    })
  }

const updateTicketCount = (tickets) =>{
  const data ={
    open: 0,
    closed: 0,
    progress: 0,
    blocked: 0
  }

  tickets.forEach(x=>{
    if(x.status === "OPEN"){
      data.open+=1;
    }
    else if(x.status ==="CLOSED"){
      data.closed+=1;
    }
    else if (x.status === "PROGRESS") {
      data.progress += 1;
    }
    else {
      data.blocked += 1;
    }
  })
  setTicketStatusCount(Object.assign({},data))
} 
  console.log('***', ticketStatusCount);
  return (
    <div className='bg-light vh-100% '>
      <Sidebar />
      {/* welcome text */}
      <div className="container mx-auto px-2">
        <h3 className="text-center text-danger">Welcome, Admin!</h3>
        <p className="text-muted text-center">Take a quick look at your admin start below</p>
      </div>
      {/* Widget starts */}
      <div className="row ms-5 ps-5 m-3 ">
        {/* W1 */}
        <div className="col-xs-12 col-lg-3 col-md-6">
          <div className="card shadow bg-primary bg-opacity-25" style={{ width: 15 + 'rem' }}>
            <h5 className="card-subtitle m-2 text-primary fw-bolder text-center"><i className="bi bi-envelope-open">Open</i></h5>
            <hr />
            <div className="row mb-2 d-flex align-items-center">
              <div className="col text-primary mx-4 fw-bolder display-6">{ticketStatusCount.open}</div>
              <div className="col">
                {/* size of circular bar */}
                <div style={{ width: 40, height: 40 }}>
                  {/* how to use?
              import from top
               value={the count of tickets}
               buildStyle({}): a function that accepts obj. obj takes css styles in key value format. colors can be accepted in hex, rgpa, and text names */}
                  <CircularProgressbar value={ticketStatusCount.open} styles={buildStyles({
                    pathColor: 'darkblue'
                  })} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* W2 */}
        <div className="col-xs-12 col-lg-3 col-md-6 my-1">
          <div className="card shadow bg-warning bg-opacity-25" style={{ width: 15 + 'rem' }}>
            <h5 className="card-subtitle m-2 text-warning fw-bolder text-center"><i className="bi bi-hourglass-split   mx-2">Progress</i></h5>
            <hr />
            <div className="row mb-2 d-flex align-items-center">
              <div className="col text-warning mx-4 fw-bolder display-6">{ticketStatusCount.progress}</div>
              <div className="col">
                <div style={{ width: 40, height: 40 }}>
                  <CircularProgressbar value={ticketStatusCount.progress} styles={buildStyles({
                    pathColor: 'darkgoldenrod'
                  })} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* W3 */}
        <div className="col-xs-12 col-lg-3 col-md-6 my-1 ">
          <div className="card shadow bg-success bg-opacity-25" style={{ width: 15 + 'rem' }}>
            <h5 className="card-subtitle m-2 fw-bolder text-success text-center"><i className="bi bi-check2-circle  mx-2">Closed</i></h5>
            <hr />
            <div className="row mx- mb-2 d-flex align-items-center">
              <div className="col text-success mx-4 fw-bolder display-6">{ticketStatusCount.closed}</div>
              <div className="col">
                <div style={{ width: 40, height: 40 }}>
                  <CircularProgressbar value={ticketStatusCount.closed} styles={buildStyles({
                    pathColor: 'darkgreen'
                  })} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* W4 */}
        <div className="col-xs-12 col-lg-3 col-md-6 my-1">
          <div className="card shadow bg-secondary bg-opacity-25" style={{ width: 15 + 'rem' }}>
            <h5 className="card-subtitle m-2 fw-bolder text-secondary text-center"><i className="bi bi-slash-circle  mx-2">Blocked</i></h5>
            <hr />
            <div className="row mx- mb-2 d-flex align-items-center">
              <div className="col text-secondary mx-4 fw-bolder display-6">{ticketStatusCount.blocked}</div>
              <div className="col">
                <div style={{ width: 40, height: 40 }}>
                  <CircularProgressbar value={ticketStatusCount.blocked} styles={buildStyles({
                    pathColor: 'darkgrey'
                  })} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      {/* widgets end */}
      <div className="container">
        <MaterialTable
          title="Ticket Details"
          columns={columns}
          data={ticketDetails} 
          options={{
            filtering: true,
            headerStyle: {
              backgroundColor: "#d9534f",
              color: "#fff",
            },
            rowStyle: {
              backgroundColor: "#eee",
            },
            exportMenu: [{
              label: 'Export pdf',
              exportFunc: (cols, data) => ExportPdf(cols, data, 'userRecords')
            },
            {
              label: 'Export Csv',
              exportFunc: (cols, data) => ExportCsv(cols, data, 'userRecords')
            }]
          }}
        />
        <hr />
        <MaterialTable
          title="User Details"
          columns={userColumns}
          // data={data}
          options={{
            filtering: true,
            headerStyle: {
              backgroundColor: "#d9534f",
              color: "#fff",
            },
            rowStyle: {
              backgroundColor: "#eee",
            },
            exportMenu: [{
              label: 'Export Pdf',
              exportFunc: (cols, data) => ExportPdf(cols, data, 'userRecords')
            },
            {
              label: 'Export Csv',
              exportFunc: (cols, data) => ExportCsv(cols, data, 'userRecords')
            }]
          }}
        />
      </div>
    </div>
  )
}

export default Admin