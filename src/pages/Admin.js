import React, { useEffect, useState } from "react";
import MaterialTable from "@material-table/core";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { ExportPdf } from "@material-table/exporters";
import { ExportCsv } from "@material-table/exporters";
import Button from "react-bootstrap/Button";
import Widget from "../components/Widgets";

import { fetchTicket, ticketUpdation } from "../api/tickets";
import Sidebar from "../components/Sidebar";
import { Modal } from "react-bootstrap";
import { getAllUser, userUpdation } from "../api/user";

/*
TASKS:
create a common component for widgets
GET API for users: userid
create a fucntion getAllUsers()=>fetch the api=>store the array of objects in state =>user details 
pass the userdetails in material table 
*/

// PUT API for users : userid, updated new data -> change of status
/*
1. Grab the curr user using onRowClick
2. create a funciton and then we need to store the details of the user -> open a modal
3. Modal will show all the curr details -> print all user details in the user modal
4. Grab the new updated value and store it in a state
5. Fetch the api ->userId, updated data -> log the response 
*/

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
  { title: "PRIORITY", field: "ticketPriority" },
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
const userColumns = [
  { title: "ID", field: "userId" },
  { title: "NAME", field: "name" },
  { title: "EMAIL", field: "email" },
  { title: "ROLE", field: "userTypes" },
  {
    title: "STATUS",
    field: "userStatus",
    lookup: {
      APPROVED: "APPROVED",
      REJECTED: "REJECTED",
      PENDING: "PENDING",
    },
  },
];

const Admin = () => {
  const [ticketDetails, setTicketDetails] = useState([]);
  const [ticketStatusCount, setTicketStatusCount] = useState({});
  const [ticketUpdationModal, setTicketUpdationModal] = useState(false);
  const [selectedCurrTicket, setSelectedCurrTicket] = useState({});
  
  const [message, setMessage] = useState("");
  
  const updateSelectedCurrTicket = (data) => setSelectedCurrTicket(data);

  // const closeTicketUpdationModal = () => setTicketUpdationModal(false);
  // const openTicketUpdationModal = () => setTicketUpdationModal(true);


  // get api and store data for the user
  const [userDetails, setUserDetails] = useState([]);
  // open and close the user modal
  const [userUpdationModal, setUserUpdationModal] = useState(false);
  // to store the curr user details and the updated user details
  const [selectedCurrUser, setSelectedCurrUser] = useState({});
  

  const updateSelecteCurrUser = (data) => setSelectedCurrUser(data);

  // const openUserUpdationModal = () => setUserUpdationModal(true);
  const closeUserUpdationModal = () => setUserUpdationModal(false);

  useEffect(() => {
    fetchTickets();
    getAllUsers();
    // eslint-disable-next-line
  }, []);

  const fetchTickets = () => {
    fetchTicket()
      .then((response) => {
        setTicketDetails(response.data);
        updateTicketCount(response.data);
      })
      .catch((error) => {
        setMessage(error.response.data.message);
      });
  };

  const getAllUsers = () => {
    getAllUser()
      .then(function (response) {
        setUserDetails(response.data);
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  };

  console.log("***", userDetails);

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
      } else if (x.status === "BLOCKED") {
        data.blocked += 1;
      }
    });
    setTicketStatusCount(Object.assign({}, data));
  };

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
    };
    console.log("selected ticket", ticketDetail);
    setTicketUpdationModal(true);
    // openTicketUpdationModal();
    // ticketUpdationModal(true);
    setSelectedCurrTicket(ticket);
  };

  const editUser = (userDetail) => {
    const user = {
      userId: userDetail.userId,
      name: userDetail.name,
      email: userDetail.email,
      userTypes: userDetail.userTypes,
      userStatus: userDetail.userStatus,
    };
    console.log("selected user", userDetail);
    setUserUpdationModal(true);
    setSelectedCurrUser(user);
  };

  // 3.Grab the new updated values and store in a state

  const onTicketUpdate = (e) => {
    if (e.target.name === "ticketPriority")
      selectedCurrTicket.ticketPriority = e.target.value;
    else if (e.target.name === "status")
      selectedCurrTicket.status = e.target.value;
    else if (e.target.name === "description")
      selectedCurrTicket.description = e.target.value;

    updateSelectedCurrTicket(Object.assign({}, selectedCurrTicket));
  };

  const onUserUpdate = (e) => {
    if (e.target.name === "userStatus")
      selectedCurrUser.userStatus = e.target.value;

    updateSelecteCurrUser(Object.assign({}, selectedCurrUser));
  };

  //4. call the api with the new updated data

  const updateTicket = (e) => {
    e.preventDefault();
    ticketUpdation(selectedCurrTicket.id, selectedCurrTicket)
      .then(function (response) {
        // closing the modal
        setTicketUpdationModal(false);
        // fetching the tickets again to update the table and the widgets
        fetchTickets();
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  };

  const updateUser = (e) => {
    e.preventDefault();
    userUpdation(selectedCurrUser.userId, selectedCurrUser)
      .then(function (response) {
        console.log(response);
        setUserUpdationModal(false);
        getAllUsers();
      })
      .catch(function (error) {
        setMessage(error.response.data.message);
      });
  };
  // console.log(fetchTickets);
  return (
    <div className="bg-light vh-100% ">
      <Sidebar />
      {/* welcome text */}
      <div className="container mx-auto px-2">
        <h3 className="text-center text-danger">Welcome, Admin!</h3>
        <p className="text-muted text-center">
          Take a quick look at your admin start below
        </p>
      </div>
      {/* Widget starts */}
      <div className="row ms-5 ps-5 m-3 ">
        {/* W1 */}
        {/* {color, title, icon, ticketCount, pathColor} */}
        <Widget
          color="primary"
          title="OPEN"
          icon="envelope"
          ticketCount={ticketStatusCount.open}
          pathColor="darkblue"
        />

        {/* W2 */}
        <Widget
          color="warning"
          title="PROGRESS"
          icon="hourglass-split"
          ticketCount={ticketStatusCount.progress}
          pathColor="darkgoldenrod"
        />

        {/* W3 */}
        <Widget
          color="success"
          title="CLOSED"
          icon="check2-circle"
          ticketCount={ticketStatusCount.closed}
          pathColor="darkgreen"
        />

        {/* W4 */}
        <Widget
          color="secondary"
          title="BLOCKED"
          icon="slash-circle"
          ticketCount={ticketStatusCount.blocked}
          pathColor="darkgrey"
        />
      </div>
      {/* widgets end */}

      <div className="text-center">
        <h5 className="text-info">{message}</h5>
      </div>

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
            exportMenu: [
              {
                label: "Export pdf",
                exportFunc: (cols, data) =>
                  ExportPdf(cols, data, "userRecords"),
              },
              {
                label: "Export Csv",
                exportFunc: (cols, datas) =>
                  ExportCsv(cols, datas, "userRecords"),
              },
            ],
          }}
        />

        {ticketUpdationModal ? (
          <Modal
            show={ticketUpdationModal}
            onHide={()=>setTicketUpdationModal(false)}
            backdrop="static"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Update Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* submit the details  and we will call the api */}
              <form onSubmit={updateTicket}>
                <div className="p-1">
                  <h5 className=" card-subtitle mb-2 text-danger">
                    {" "}
                    User ID : {selectedCurrTicket.id}{" "}
                  </h5>
                </div>
                <div className="input-group mb-2">
                  {/* if equal lable size required then set height and width  for labelSize */}
                  <label className="label input-group-text label-md">
                    Title
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedCurrTicket.title}
                    className="form-control"
                  />
                </div>

                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Reporter
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedCurrTicket.reporter}
                    className="form-control"
                  />
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Assignee
                  </label>
                  <select name="assignee" className="form-control">
                    <option value="">Raheem</option>
                  </select>
                </div>
                {/* onchange: grabbing the new update values from UI */}
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Priority
                  </label>
                  <input
                    type="number"
                    value={selectedCurrTicket.ticketPriority}
                    className="form-control"
                    name="ticketPriority"
                    onChange={onTicketUpdate}
                  />
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Status
                  </label>
                  <select
                    name="status"
                    className="form-select"
                    value={selectedCurrTicket.status}
                    onChange={onTicketUpdate}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Description
                  </label>
                  <textarea
                    type="text"
                    value={selectedCurrTicket.description}
                    className="md-textarea form-control"
                    rows="3"
                    name="description"
                    onChange={onTicketUpdate}
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={()=>setTicketUpdationModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="danger" className="m-1" type="submit">
                    Update
                  </Button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        ) : null}
        <hr />
       
        <MaterialTable
          onRowClick={(event, rowData) => editUser(rowData)}
          title="User Details"
          columns={userColumns}
          data={userDetails}
          options={{
            filtering: true,
            headerStyle: {
              backgroundColor: "#d9534f",
              color: "#fff",
            },
            rowStyle: {
              backgroundColor: "#eee",
            },
            exportMenu: [
              {
                label: "Export Pdf",
                exportFunc: (cols, data) =>
                  ExportPdf(cols, data, "userRecords"),
              },
              {
                label: "Export Csv",
                exportFunc: (cols, data) =>
                  ExportCsv(cols, data, "userRecords"),
              },
            ],
          }}
        />
        {/* <button
          className="btn btn-danger m-1"
          onClick={() => openUserUpdationModal(true)}
        >
          Update user details
        </button> */}
        {userUpdationModal ? (
          <Modal
            show={userUpdationModal}
            onHide={closeUserUpdationModal}
            backdrop="static"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Update USER DETAILS</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* submit the details  and we will call the api */}
              <form onSubmit={updateUser}>
                <div className="p-1">
                  <h5 className=" card-subtitle mb-2 text-danger">
                    User ID :{selectedCurrUser.userId}
                  </h5>
                </div>
                <div className="input-group mb-2">
                  {/* if equal lable size required then set height and width  for labelSize */}
                  <label className="label input-group-text label-md">
                    Name
                  </label>
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    value={selectedCurrUser.name}
                  />
                </div>

                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Email
                  </label>
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    value={selectedCurrUser.email}
                  />
                </div>
                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Role
                  </label>
                  <input
                    type="text"
                    disabled
                    className="form-control"
                    value={selectedCurrUser.userTypes}
                  />
                </div>
                {/* onchange: grabbing the new updates values from UI */}

                <div className="input-group mb-2">
                  <label className="label input-group-text label-md">
                    Status
                  </label>
                  <select
                    name="userStatus"
                    className="form-select"
                    value={selectedCurrUser.userStatus}
                    onChange={onUserUpdate}
                  >
                    <option value="APPROVED">APPROVED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    className="m-1"
                    onClick={closeUserUpdationModal}
                  >
                    Cancel
                  </Button>
                  <Button variant="danger" className="m-1" type="submit">
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

export default Admin;
