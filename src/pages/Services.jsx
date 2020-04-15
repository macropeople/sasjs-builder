import React, { useContext, useState, useCallback, useEffect } from "react";
import { Header, Segment, Icon, Message, Card, Popup } from "semantic-ui-react";
import "./Services.scss";
import { AppContext } from "../context/appContext";
import Folder from "../components/Folder";
import AddFolderModal from "../components/AddFolderModal";
import ServiceModal from "../components/ServiceModal";
import PopupIcon from "../components/PopupIcon";

const Services = () => {
  const { masterJson, setMasterJson } = useContext(AppContext);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentService, setCurrentService] = useState(null);
  const [addFolderModalOpen, setaddFolderModalOpen] = useState(false);
  const [showFolderNameError, setShowFolderNameError] = useState(false);

  const deleteFolder = (folder) => {
    const newFolders = folders.filter((f) => f.name !== folder.name);
    setMasterJson({ ...masterJson, folders: newFolders });
    setCurrentFolder(null);
  };

  useEffect(() => {
    setFolders(masterJson.folders ? masterJson.folders : []);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setMasterJson({ ...masterJson, folders });
    // eslint-disable-next-line
  }, [folders]);

  const updateFolder = useCallback(
    (updatedService) => {
      const folderIndex = folders.indexOf(currentFolder);
      const serviceIndex = currentFolder.services.findIndex(
        (s) => s.name === currentService.name
      );
      const updatedFolder = {
        ...currentFolder,
        services: [...currentFolder.services],
      };
      if (serviceIndex >= 0) {
        updatedFolder.services[serviceIndex] = updatedService;
      } else {
        updatedFolder.services.push(updatedService);
      }
      setCurrentFolder(updatedFolder);
      const updatedFolders = [...folders];
      updatedFolders[folderIndex] = updatedFolder;
      setFolders(updatedFolders);
    },
    [currentService, currentFolder, folders]
  );

  return (
    <div className="services-container">
      <Header as="h1">Services</Header>
      <div className="main-content">
        <Segment raised size="huge" className="folders">
          <h3>Folders</h3>
          <PopupIcon
            text="Add folder"
            icon="add"
            color="blue"
            onClick={() => setaddFolderModalOpen(true)}
          />
          <div className="folder-list">
            {folders.map((folder, index) => {
              return (
                <Folder
                  key={index}
                  folder={folder}
                  selected={currentFolder === folder}
                  onClick={() => setCurrentFolder(folder)}
                  onDelete={deleteFolder}
                />
              );
            })}
          </div>
        </Segment>
        <Segment raised size="large" className="services">
          <h3>Services</h3>
          {currentFolder && (
            <Popup
              inverted
              content="Add service"
              trigger={
                <Icon
                  name="add"
                  color="blue"
                  onClick={() =>
                    setCurrentService({
                      name: "My Service",
                      description: "My service",
                    })
                  }
                />
              }
            />
          )}
          {!currentFolder && (
            <Message info>
              <Message.Header>No folder selected</Message.Header>
              Please select a folder from the sidebar to display services here.
            </Message>
          )}
          {currentFolder && (
            <Card.Group>
              {currentFolder.services.map((service, index) => {
                return (
                  <Card key={index} onClick={() => setCurrentService(service)}>
                    <Card.Header>{service.name}</Card.Header>
                    <Card.Description>{service.description}</Card.Description>
                  </Card>
                );
              })}
            </Card.Group>
          )}
        </Segment>
      </div>
      <AddFolderModal
        isOpen={addFolderModalOpen}
        showFolderNameError={showFolderNameError}
        onCancel={() => setaddFolderModalOpen(false)}
        onAddFolder={(newFolderName) => {
          const folderExists = folders.some((f) => f.name === newFolderName);
          if (!folderExists) {
            const newFolder = { name: newFolderName, services: [] };
            setFolders([...folders, newFolder]);
            setCurrentFolder(newFolder);
            setaddFolderModalOpen(false);
          } else {
            setShowFolderNameError(true);
          }
        }}
      />
      {currentFolder && currentService && (
        <ServiceModal
          service={currentService}
          path={currentFolder.name}
          onClose={() => setCurrentService(null)}
          onUpdate={updateFolder}
        />
      )}
    </div>
  );
};

export default Services;
