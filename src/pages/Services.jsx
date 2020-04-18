import React, { useContext, useState, useCallback, useEffect } from "react";
import { Segment } from "semantic-ui-react";
import "./Services.scss";
import { AppContext } from "../context/AppContext";
import Folder from "../components/Folder";
import AddFolderModal from "../components/AddFolderModal";
import ServiceDetail from "../components/ServiceDetail";
import PopupIcon from "../components/PopupIcon";
import { sortByName } from "../utils";
import produce from "immer";

const Services = () => {
  const { masterJson, setMasterJson } = useContext(AppContext);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentService, setCurrentService] = useState(null);
  const [addFolderModalOpen, setaddFolderModalOpen] = useState(false);
  const [showFolderNameError, setShowFolderNameError] = useState(false);

  const deleteFolder = (folder) => {
    const newFolders = folders.filter((f) => f.name !== folder.name);
    setFolders(newFolders);
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
        (s) => s.name === currentService.name || s.name === updatedService.name
      );
      const updatedFolder = produce(currentFolder, (draft) => {
        if (serviceIndex >= 0) {
          draft.services[serviceIndex] = updatedService;
        } else {
          draft.services.push(updatedService);
        }
      });

      setCurrentFolder(updatedFolder);
      const updatedFolders = produce(folders, (draft) => {
        draft[folderIndex] = updatedFolder;
      });

      setFolders(updatedFolders);
    },
    [currentService, currentFolder, folders]
  );

  return (
    <div className="services-container">
      <div className="main-content">
        <Segment raised size="large" className="folders">
          <h3>Folders</h3>
          <PopupIcon
            text="Add folder"
            icon="add"
            color="blue"
            onClick={() => setaddFolderModalOpen(true)}
          />
          <div className="folder-list">
            {folders.sort(sortByName).map((folder, index) => {
              return (
                <Folder
                  key={index}
                  folder={folder}
                  selected={currentFolder === folder}
                  onClick={() => setCurrentFolder(folder)}
                  onServiceClick={(service) => {
                    setCurrentFolder(folder);
                    setCurrentService(service);
                  }}
                  onAddService={() => {
                    const service = {
                      name: `myService${
                        currentFolder.services
                          ? currentFolder.services.length + 1
                          : 1
                      }`,
                      description: `My service ${
                        currentFolder.services
                          ? currentFolder.services.length + 1
                          : 1
                      }`,
                    };
                    setCurrentService(service);
                    currentFolder.services.push(service);
                  }}
                  onDelete={deleteFolder}
                />
              );
            })}
          </div>
        </Segment>
        <Segment raised size="large" className="services">
          {currentFolder && currentService && (
            <ServiceDetail
              service={currentService}
              path={currentFolder.name}
              onUpdate={(updatedService) => {
                updateFolder(updatedService);
              }}
            />
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
    </div>
  );
};

export default Services;
