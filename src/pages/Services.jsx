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
  const [currentFolderIndex, setCurrentFolderIndex] = useState(-1);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(-1);
  const [addFolderModalOpen, setaddFolderModalOpen] = useState(false);
  const [showFolderNameError, setShowFolderNameError] = useState(false);

  const deleteFolder = (folder) => {
    const newFolders = folders.filter((f) => f.name !== folder.name);
    setFolders(newFolders);
    setCurrentFolderIndex(-1);
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
      const updatedFolder = produce(folders[currentFolderIndex], (draft) => {
        if (currentServiceIndex >= 0) {
          draft.services[currentServiceIndex] = updatedService;
        } else {
          draft.services.push(updatedService);
        }
      });

      const updatedFolders = produce(folders, (draft) => {
        draft[currentFolderIndex] = updatedFolder;
      });

      setFolders(updatedFolders);
    },
    [currentServiceIndex, currentFolderIndex, folders]
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
                  selected={currentFolderIndex === index}
                  selectedServiceIndex={currentServiceIndex}
                  onClick={() => setCurrentFolderIndex(index)}
                  onServiceClick={(serviceIndex) => {
                    setCurrentFolderIndex(index);
                    setCurrentServiceIndex(serviceIndex);
                  }}
                  onAddService={() => {
                    const service = {
                      name: `myService${
                        currentFolderIndex >= 0 &&
                        folders[currentFolderIndex].services
                          ? folders[currentFolderIndex].services.length + 1
                          : 1
                      }`,
                      description: `My service ${
                        currentFolderIndex >= 0 &&
                        folders[currentFolderIndex].services
                          ? folders[currentFolderIndex].services.length + 1
                          : 1
                      }`,
                    };
                    setCurrentServiceIndex(
                      folders[currentFolderIndex].services.length
                    );
                    const newFolders = produce(folders, (draft) => {
                      draft[currentFolderIndex].services.push(service);
                    });
                    setFolders(newFolders);
                  }}
                  onDelete={deleteFolder}
                />
              );
            })}
          </div>
        </Segment>
        <Segment raised size="large" className="services">
          {!!folders.length &&
            currentFolderIndex >= 0 &&
            currentServiceIndex >= 0 &&
            !!folders[currentFolderIndex].services.length &&
            !!folders[currentFolderIndex].services[currentServiceIndex] && (
              <ServiceDetail
                service={
                  folders[currentFolderIndex].services[currentServiceIndex]
                }
                path={folders[currentFolderIndex].name}
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
            const newFolders = produce(folders, (draft) => {
              draft.push(newFolder);
            });
            setCurrentFolderIndex(newFolders.length - 1);
            setFolders(newFolders);
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
