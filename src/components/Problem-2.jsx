import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { Modal } from "bootstrap"; 

const ContactModal = ({
  closeModal,
  loadContacts,
  contacts,
  onlyEven,
  searchTerm,
  setSearchTerm,
  setOnlyEven,
  openContactDetailsModal,
}) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const modalElement = document.getElementById("contactModal");
    const bootstrapModal = new Modal(modalElement, {
      backdrop: "static", 
      keyboard: false, 
    });
    bootstrapModal.show();

    return () => {
      bootstrapModal.hide(); 
    };
  }, []); 

  return (
    <div
      className="modal"
      tabIndex="-1"
      id="contactModal"
      aria-labelledby="contactModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="contactModalLabel">
              Contacts
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body">
            <div>
              <label>
                Only Even
                <input
                  type="checkbox"
                  checked={onlyEven}
                  onChange={() => setOnlyEven(!onlyEven)}
                />
              </label>
            </div>
            <ul className="list-group">
              {contacts.map((contact) => (
                <li key={contact.id} className="list-group-item">
                  <button
                    className="btn btn-link"
                    onClick={() => openContactDetailsModal(contact)}
                  >
                    {contact.id} : {contact.country.name}
                  </button>
                </li>
              ))}
            </ul>
            {loading && <p>Loading...</p>}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
            >
              All Contacts
            </button>
            <button
              type="button"
              className="btn btn-warning"
            >
              US Contacts
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactDetailsModal = ({ closeModal, contact }) => {
  useEffect(() => {
    const modalElement = document.getElementById("contactDetailsModal");
    const bootstrapModal = new Modal(modalElement, {
      backdrop: "static", 
      keyboard: false, 
    });
    bootstrapModal.show();

    return () => {
      bootstrapModal.hide(); 
    };
  }, []); 

  return (
    <div
      className="modal"
      tabIndex="-1"
      id="contactDetailsModal"
      aria-labelledby="contactDetailsModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="contactDetailsModalLabel">
              Contact Details
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body">
            <p>Id: {contact.id}</p>
            <p>Phone: {contact.phone}</p>
            <p>Country ID: {contact.country.id}</p>
            <p>Country Name: {contact.country.name}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Problem2 = () => {
  const [modalType, setModalType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyEven, setOnlyEven] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const closeModal = () => {
    setModalType(null);
    setSearchTerm("");
    setOnlyEven(false);
    setContacts([]);
    setPage(1);
    setSelectedContact(null);
  };

  const openModal = (type) => {
    setModalType(type);
  };

  const openContactDetailsModal = (contact) => {
    setSelectedContact(contact);
  };

  const loadContacts = async () => {
    try {
      setLoading(true);
      const apiEndpoint =
        modalType === "A"
          ? "https://contact.mediusware.com/api/contacts/"
          : "https://contact.mediusware.com/api/country-contacts/United%20States/";

      const response = await fetch(`${apiEndpoint}`);
      const responseData = await response.json();

      if (Array.isArray(responseData.results)) {
        let filteredContacts = responseData.results;

        if (onlyEven) {
       
          filteredContacts = filteredContacts.filter(
            (contact) => contact.id % 2 === 0
          );
        }

        setContacts((prevContacts) => [...prevContacts, ...filteredContacts]);
        setPage((prevPage) => prevPage + 1);
      } else {
        console.error("Invalid data format received from the API");
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalType) {
      setContacts([]);
      setPage(1);
      loadContacts();
    }
  }, [modalType, searchTerm, onlyEven]);

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <h4 className="text-center text-uppercase mb-5">Problem-2</h4>

        <div className="d-flex justify-content-center gap-3">
          <button
            className="btn btn-lg btn-outline-primary"
            type="button"
            onClick={() => openModal("A")}
          >
            All Contacts
          </button>
          <button
            className="btn btn-lg btn-outline-warning"
            type="button"
            onClick={() => openModal("B")}
          >
            US Contacts
          </button>
        </div>
      </div>

      {modalType && (
        <ContactModal
          closeModal={closeModal}
          loadContacts={loadContacts}
          contacts={contacts}
          onlyEven={onlyEven}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm} 
          setOnlyEven={setOnlyEven} 
          openContactDetailsModal={openContactDetailsModal}
        />
      )}

      {selectedContact && (
        <ContactDetailsModal
          closeModal={() => setSelectedContact(null)}
          contact={selectedContact}
        />
      )}
    </div>
  );
};

export default Problem2;
