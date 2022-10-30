import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import MaterialTable from "@material-table/core";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import Widget from "../components/Widgets";
import { Modal, ModalHeader, Button } from "react-bootstrap";
import { fetchTicket, ticketUpdation } from "../api/tickets";

/*
Engineer signup -> contact admin to put them in approved state -> login
*/
/*
1. Grab the ticket
2. Store the data
3. grab the updated data and store in a state
4. fetch the update api
*/

const columns = [
  {
    title: "ID",
    field: "id",
  },
  {
    title: "TITLE",
    field: "tile",
  },
  {
    title: "REPORTER",
    field: "reporter",
  },
  {
    title: "DESCRIPTION",
    field: "description",
  },
  {
    title: "PRIORITY",
    field: "ticketPriority",
  },
  {
    title: "STATUS",
    field: "status",
    lookup: {
      OPEN: "OPEN",
      IN_PROGRESS: "IN_PROGRESS",
      CLOSED: "CLOSED",
      BLOCKED: "BLOCKED",
    },
  },
];

const Engineer = () => {
  // toggle modal
  const [ticketUpdationModal, setTicketUpdationModal] = useState(false);
  // store list of tickets
  const [ticketDetails, setTicketDetails] = useState([]);
  // for widgets
  const [ticketStatusCount, setTicketStatusCount] = useState({});
  // message from api to display to the user
  const [message, setMessage] = useState("");
  // store selected curr ticket
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({});
// store the selected curr ticket update/ new data
  const updateSelectedCurrTicket = (data) =>setSelectedCurrTicket(data)
// close modal
  const closeTicketUpdationModal = ()=>setTicketUpdationModal(false);

  useEffect(() => {
    (async () => {
      fetchTickets();
    })();
  }, []);

  // get all tickets list
  const fetchTickets = () => {
    fetchTicket()
      .then(function (res) {
        setTicketDetails(res.data);
        updateTicketCount(res.data);
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  };

  // update ticketCount on widget
  const updateTicketCount = (tickets) => {
    const data = {
      open: 0,
      pending: 0,
      closed: 0,
      blocked: 0,
    };

    tickets.forEach((ticket) => {
      if (ticket.status === "OPEN") data.open += 1;
      else if (ticket.status === "IN_PROGRESS") data.pending += 1;
      else if (ticket.status === "CLOSED") data.closed += 1;
      else if (ticket.status === "BLOCKED") data.blocked += 1;
    });

    setTicketStatusCount(Object.assign({}, data));
  };

  // store the current ticket details
  const editTicket = (ticketDetail) => {
    const ticket = {
      id: ticketDetail.id,
      title: ticketDetail.title,
      description: ticketDetail.description,
      priority: ticketDetail.ticketPriority,
      reporter: ticketDetail.reporter,
      assignee: ticketDetail.assignee,
      status: ticketDetail.status,
    };
    setTicketUpdationModal(true);
    setSelectedCurrTicket(ticket);
  };

  // grab the updated new data and store it in a state
  const onTicketUpdate = (e) => {
    if (e.target.name === "priority")
      selectedCurrTicket.priority = e.target.value;
    else if (e.target.name === "description")
      selectedCurrTicket.description = e.target.value;
    else if (e.target.name === "status")
      selectedCurrTicket.status = e.target.value;

      updateSelectedCurrTicket(Object.assign({}, selectedCurrTicket));
  };

// fetch put api with updated details
const updateTicket = (e)=>{

  e.preventDefault();
  ticketUpdation(selectedCurrTicket.id, selectedCurrTicket).then(function (res){
    setMessage("ticket updated successfully");
    fetchTickets()
    closeTicketUpdationModal()
  }).catch(function (error){
    setMessage(error.response.data.message);
  })

}

  return (
    <div className="bg-light vh-100">
      <Sidebar />
      <div className="container py-5">
        <h3 className="text-center text-primary">
          {" "}
          Welcome {localStorage.getItem("name")}
        </h3>
        <p className="lead text-muted text-center">
          Take a quick look at your engineer stats below!
        </p>
        {/* Widget starts  : props : color, title, icon, ticketCount, pathColor*/}
        <div className="row">
          <Widget
            color="primary"
            title="OPEN"
            icon="envelope-open"
            ticketCount={ticketStatusCount.open}
            pathColour="darkblue"
          />
          <Widget
            color="warning"
            title="PROGRESS"
            icon="hourglass-split"
            ticketCount={ticketStatusCount.pending}
            pathColour="yellow"
          />
          <Widget
            color="success"
            title="CLOSED"
            icon="check2-circle"
            ticketCount={ticketStatusCount.closed}
            pathColour="darkgreen"
          />
          <Widget
            color="secondary"
            title="BLOCKED"
            icon="slash-circle"
            ticketCount={ticketStatusCount.blocked}
            pathColour="darkgrey"
          />
        </div>
        <hr />
        <h4 className="text-primary text-center">{message}</h4>
        <MaterialTable
          onRowClick={(event, rowData) => editTicket(rowData)}
          columns={columns}
          title="TICKET ASSIGNED TO YOU"
          options={{
            exportMenu: [
              {
                label: "Export Pdf",
                exportFunc: (cols, data) =>
                  ExportPdf(cols, data, "Ticket Records"),
              },
              {
                label: "Export Csv",
                exportFunc: (cols, data) =>
                  ExportCsv(cols, data, "Ticket Records"),
              },
            ],
            headerStyle: {
              backgroundColor: "darkblue",
              color: "#fff",
            },
            rowStyle: {
              backgroundColor: "lightblue",
            },
          }}
        />
        
        {ticketUpdationModal ? (
          <Modal
            show={ticketUpdationModal}
            data={ticketDetails}
            onHide={() => setTicketUpdationModal(false)}
            backdrop="static"
            centered
          >
            <ModalHeader closeButton>
              <Modal.Title> UPDATE TICKET</Modal.Title>
            </ModalHeader>
            <Modal.Body>
              <form onSubmit={updateTicket}>
                <div className="p-1">
                  <h5 className="text-primary"> ID:{selectedCurrTicket.id}</h5>
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    TITLE
                  </label>
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    value={selectedCurrTicket.title}
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    REPORTER
                  </label>
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    value={selectedCurrTicket.reporter}
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    PRIORITY
                  </label>
                  <input
                    type="text"
                    name="priority"
                    onChange={onTicketUpdate}
                    className="form-control"
                    value={selectedCurrTicket.ticketPriority}
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    DESCRIPTION
                  </label>
                  <input
                    type="text"
                    name="description"
                    className="form-control"
                    value={selectedCurrTicket.description}
                    onChange={onTicketUpdate}
                  />
                </div>
                <div className="input-group m-1">
                  <label className="label label-md input-group-text">
                    STATUS
                  </label>
                  <select
                    className="form-select"
                    value={selectedCurrTicket.status}
                    name="status"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={closeTicketUpdationModal}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" className="m-1" type="submit">
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

export default Engineer;
