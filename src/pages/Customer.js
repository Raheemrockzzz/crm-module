import React from "react";
import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Widget from "../components/Widgets";
import { ticketCreation, fetchTicket, ticketUpdation } from "../api/tickets";

// PUT logic
/*
1. Grab the curr ticket: ticket id, all the curr data along with it 
2. Store the curr ticket in a state=> display current ticket details in the modal
3.Grab the new updated values and store in a state
4. fetch the api with the new updated  data
*/

const columns = [
  {
    title: "ID",
    field: "id",
  },
  {
    title: "TITLE",
    field: "title",
  },
  {
    title: "DESCRIPTION",
    field: "description",
  },
  {
    title: "ASSIGNEE",
    field: "assignee",
  },
  {
    title: "PRIORITY",
    field: "ticketPriority",
  },
  {
    title: "STATUS",
    field: "status",
    loopkup: {
      OPEN: "OPEN",
      IN_PROGRESS: "IN_PROGRESS",
      CLOSED: "CLOSED",
    },
  },
];

const Customer = () => {
  // open create a new ticket modal
  const [createTicketModal, setCreateTicketModal] = useState(false);
  // success/ error message from api
  const [message, setMessage] = useState("");
  // store ticket details
  const [ticketDetails, setTicketDetails] = useState([]);
  // ticket count for widgets
  const [ticketStatusCount, setTicketStatusCount] = useState({});
  // store the curr ticket
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({});
  // open the edit ticket modal
  const [ticketUpdationModal, setTicketUpdationModal] = useState(false);
  // update data stored in a state
  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);

  // logout if error =401
  const navigate = useNavigate();
  const logoutFn = () => {
    localStorage.clear();
    navigate("/");
    // window.location.href="/";
  };

  // Get all tickets raised
  // eslint-disable-next-line
  useEffect(() => {
    (async () => {
      fetchTickets();
      // eslint-disable-next-line
    })();
    // eslint-disable-next-line
  }, []); // eslint-disable-next-line


  const fetchTickets = () => {
    fetchTicket()
      .then(function (response) {
        setTicketDetails(response.data);
        updateTicketCount(response.data);
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  };

  // POST API: grab the data from input box and send the data for post api
  const createTicket = (e) => {
    e.preventDefault();

    const data = {
      title: e.target.title.value,
      description: e.target.description.value,
    };

    ticketCreation(data)
      .then(function (response) {
        setMessage("Ticket created successfully");
        setCreateTicketModal(false);
        fetchTickets();
      })
      .catch(function (error) {
        setMessage(error.message);
        if (error.response.status === 400) {
          setMessage(error.response.data.message);
        } else if (error.response.status === 401) {
          logoutFn();
        } else {
          setMessage(error.response.data.message);
        }
      });
  };

  // put api: 2. store data

  const editTicket = (ticketDetail) => {
    // console.log(ticketDetail);
    const ticket = {
      id: ticketDetail.id,
      title: ticketDetail.title,
      description: ticketDetail.description,
      assignee: ticketDetail.assignee,
      reporter: ticketDetail.reporter,
      ticketPriority: ticketDetail.ticketPriority,
      status: ticketDetail.status,
    };

    setSelectedCurrTicket(ticket);
    setTicketUpdationModal(true);
  };

  // 3.  grab the new data
  const onTicketUpdate = (e) => {
    if (e.target.name === "description")
      selectedCurrTicket.description = e.target.value;
    else if (e.target.name === "status")
      selectedCurrTicket.status = e.target.value;

    updateSelectedCurrTicket(Object.assign({}, selectedCurrTicket));
  };

  // 4.   fetch the put api
  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(selectedCurrTicket.id, selectedCurrTicket)
      .then(function (response) {
        console.log("ticket updated successfully");
        setTicketUpdationModal(false);
        fetchTickets();
      })
      .catch(function (error) {
        console.log(error.response.data.message);
      });
  };

  // ticket count for widgets
  const updateTicketCount = (tickets) => {
    const data = {
      open: 0,
      closed: 0,
      progress: 0,
      blocked: 0,
    };

    tickets.forEach((x) => {
      if (x.status === "OPEN") {
        data.open += 1;
      } else if (x.status === "CLOSED") {
        data.closed += 1;
      } else if (x.status === "IN_PROGRESS") {
        data.progress += 1;
      } else {
        data.blocked += 1;
      }
    });

    setTicketStatusCount(Object.assign({}, data));
  };

  return (
    <div className="bg-light vh-100">
      <Sidebar />
      <div className="container pt-5">
        <h3 className="text-center text-success">
          Welcome, {localStorage.getItem("name")}!
        </h3>
        <p className="text-center text-muted">
          Take a look at all your tickets below!
        </p>
        <div className="row">
          <Widget
            color="primary"
            title="OPEN"
            icon="envelope-open"
            ticketCount={ticketStatusCount.open}
            pathColor="darkblue"
          />
          <Widget
            color="warning"
            title="PROGRESS"
            icon="hourglass-split"
            ticketCount={ticketStatusCount.progress}
            pathColor="darkyellow"
          />
          <Widget
            color="success"
            title="CLOSED"
            icon="check2-circle"
            ticketCount={ticketStatusCount.closed}
            pathColor="darkgreen"
          />
          <Widget
            color="secondary"
            title="BLOCKED"
            icon="slash-circle"
            ticketCount={ticketStatusCount.blocked}
            pathColor="darkgrey"
          />
        </div>
        <hr />
        <MaterialTable
          onRowClick={(event, rowData) => editTicket(rowData)}
          title="TICKETS RAISED BY YOU"
          columns={columns}
          data={ticketDetails}
          options={{
            filtering: true,
            headerStyle: {
              backgroundColor: "#288859",
              color: "#fff",
            },
            rowStyle: {
              backgroundColor: "#eee",
            },
            exportMenu: [
              {
                label: "Export Pdf",
                exportFunc: (cols, datas) =>
                  ExportPdf(cols, datas, "Ticket Records"),
              },
              {
                label: "Export Csv",
                exportFunc: (cols, datas) =>
                  ExportCsv(cols, datas, "Ticket Records"),
              },
            ],
          }}
        />
        <hr />
        <p className="lead fw-boder text-darkgreen text-center">{message}</p>
        <h4 className="text-center">Facing any issues? Raise a ticket!</h4>
        <button
          className="btn btn-lg btn-success form-control"
          onClick={() => setCreateTicketModal(true)}
        >
          Raise Ticket
        </button>

        {createTicketModal ? (
          <Modal
            show={createTicketModal}
            backdrop="static"
            centered
            onHide={() => setCreateTicketModal(false)}
          >
            <Modal.Header closeButton> Create a new ticket</Modal.Header>
            <Modal.Body>
              <form onSubmit={createTicket}>
                <div className="input-group m-1">
                  <label className="label lable-md input-group-text">
                    TITLE
                  </label>
                  <input type="text" className="form-control" name="title" />
                </div>
                <div className="input-group m-1">
                  <label className="label lable-md input-group-text">
                    DESCRIPTION
                  </label>
                  <textarea
                    type="text"
                    className="md-textarea form-control"
                    name="description"
                    rows="3"
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => setCreateTicketModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="success" className="m-1" type="submit">
                    Create
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}

        {ticketUpdationModal ? (
          <Modal
            show={ticketUpdationModal}
            backdrop="static"
            centered
            onHide={() => setTicketUpdationModal(false)}
          >
            <Modal.Header closeButton> Update the ticket</Modal.Header>
            <Modal.Body>
              <form onSubmit={updateTicket}>
                <h5 className="card-subtitle lead text-success">
                  ID: {selectedCurrTicket.id}
                </h5>
                <div className="input-group m-1">
                  <label className="label lable-md input-group-text">
                    TITLE
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    disabled
                    value={selectedCurrTicket.title}
                  />
                </div>

                <div className="input-group m-1">
                  <label className="label lable-md input-group-text">
                    Assignee
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="assignee"
                    disabled
                    value={selectedCurrTicket.assignee}
                  />
                </div>

                <div className="input-group m-1">
                  <label className="label lable-md input-group-text">
                    Priority
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="priority"
                    disabled
                    value={selectedCurrTicket.ticketPriority}
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label lable-md input-group-text">
                    DESCRIPTION
                  </label>
                  <textarea
                    type="text"
                    className="md-textarea form-control"
                    name="description"
                    rows="3"
                    value={selectedCurrTicket.description}
                    onChange={onTicketUpdate}
                  />
                </div>
                <div className="input-group m-1">
                  <select
                    name="status"
                    value={selectedCurrTicket.status}
                    className="form-select"
                    onChange={onTicketUpdate}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </div>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={() => setTicketUpdationModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="success" className="m-1" type="submit">
                    Update
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}
      </div>
    </div>
  );
};

export default Customer;
