import React, { useEffect, useState } from "react";
import MaterialTable from "@material-table/core";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { ExportPdf } from '@material-table/exporters';
import { ExportCsv } from "@material-table/exporters";
import Button from 'react-bootstrap/Button';

import { fetchTicket, ticketUpdation } from "../api/tickets";
import Sidebar from "../components/Sidebar";
import { Modal } from "react-bootstrap";

// PUT logic
/*
1. Grab the curr ticket: ticket id, all the curr data along with it 
2. Store the curr ticket in a state=> display current ticket details in the modal
3.Grab the new updated values and store in a state
4. fetch the api with the new updated  data
*/

// const lookup = { true: "Available", false: "Unavailable" };

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
  const [ticketUpdationModal, setTicketUpdationModal] = useState(false);
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({});

  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);

  const openTicketUpdationModal = () => setTicketUpdationModal(true);
  const closeTicketUpdationModal = () => setTicketUpdationModal(false);

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

  const updateTicketCount = (tickets) => {
    const data = {
      open: 0,
      closed: 0,
      progress: 0,
      blocked: 0
    }

    tickets.forEach(x => {
      if (x.status === "OPEN") {
        data.open += 1;
      }
      else if (x.status === "CLOSED") {
        data.closed += 1;
      }
      else if (x.status === "IN_PROGRESS") {
        data.progress += 1;
      }
      else if (x.status === "BLOCKED") {
        data.blocked += 1;
      }
    })
    setTicketStatusCount(Object.assign({}, data))
  }

  // 2. Store the curr ticket in a state=> display current ticket details in the modal

  const editTicket = (ticketDetail) => {
    const ticket = {
      assignee: ticketDetail.assignee,
      description: ticketDetail.description,
      title: ticketDetail.title,
      id: ticketDetail.id,
      reporter: ticketDetail.reporter,
      status: ticketDetail.status,
      ticketPriority: ticketDetail.ticketPriority,

    }
    console.log("selected ticket", ticketDetail);
    setTicketUpdationModal(true);
    setSelectedCurrTicket(ticket);
  }

  // 3.Grab the new updated values and store in a state

  const onTicketUpdate = (e) => {
    if (e.target.name === "ticketPriority")
      selectedCurrTicket.ticketPriority = e.target.value
    else if (e.target.name === "status")
      selectedCurrTicket.status = e.target.value
    else if (e.target.name === "description")
      selectedCurrTicket.description = e.target.value

    updateSelectedCurrTicket(Object.assign({}, selectedCurrTicket))
  }

  //4. call the api with the new updated data 

  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(selectedCurrTicket.id, selectedCurrTicket).then(function (response) {
      console.log(response);
      // closing the modal
      setTicketUpdationModal(false);
      // fetching the tickets again to update the table and the widgets
      fetchTickets();
    }).catch(function (error) {
      console.log(error);
    })
  }
// console.log(fetchTickets);
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
          // 1.grabbing the specific ticket from the row 
          onRowClick={(event, rowData) => editTicket(rowData)}
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
        / >

        <button onClick={openTicketUpdationModal}>Ticket Update</button>

        {ticketUpdationModal ? (
          <Modal
            show={ticketUpdationModal}
            onHide={closeTicketUpdationModal}
            backdrop="static"
            centered>

            <Modal.Header closeButton>
              <Modal.Title>Update Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* submit the details  and we will call the api */}
              <form onSubmit={updateTicket}>
                <div className="p-1">
                  <h5 className=" card-subtitle mb-2 text-danger"> User ID : {selectedCurrTicket.id} </h5>
                </div>
                <div className="input-group mb-2">
                  {/* if equal lable size required then set height and width  for labelSize */}
                  <label className="label input-group-text label-md">Title</label>
                  <input type="text" disabled value={selectedCurrTicket.title} className="form-control" />
                </div>

                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">Reporter</label>
                  <input type="text" disabled value={selectedCurrTicket.reporter} className="form-control" />
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">Assignee</label>
                  <select name="assignee" className="form-control">
                    <option value="">Raheem</option>
                  </select>
                </div>
                {/* onchange: grabbing the new update values from UI */}
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">Priority</label>
                  <input type="number" value={selectedCurrTicket.ticketPriority} className="form-control" name="ticketPriority" onChange={onTicketUpdate} />
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">Status</label>
                  <select name="status" className="form-select" value={selectedCurrTicket.status} onChange={onTicketUpdate}>
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">Description</label>
                  <textarea type="text" value={selectedCurrTicket.description} className="md-textarea form-control" rows='3' name='description' onChange={onTicketUpdate} />
                </div>
                <div className="d-flex justify-content-end">
                  <Button variant='secondary' className='m-1' onClick={closeTicketUpdationModal}>Cancel</Button>
                  <Button variant='danger' className='m-1' type="submit">Update</Button>

                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}
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