import React, { useState } from 'react';
import { Modal, Input, Button, Select, message } from 'antd';
import '../../assets/scss/viewCommon.scss';

const { TextArea } = Input;

const GroupMessageModal = ({ 
  visible = false, 
  onCancel = () => {}, 
  onSend = () => {}, 
  selectedGroups = [],
  onGroupSelect = () => {}, 
  messageText = '',
  onMessageChange = () => {},
  loading = false,
}) => {
  const [groups, setGroups] = useState([]);
  const [fetchingGroups, setFetchingGroups] = useState(false);

  const fetchGroups = async () => {
    setFetchingGroups(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_MESSAGE_SERVICE_URL}/list-groups`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      const data = await response.json();
      setGroups(data.groups || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      message.error('Failed to fetch groups');
    } finally {
      setFetchingGroups(false);
    }
  };

  const handleGroupSelect = (selectedValues) => {
    if (selectedValues.length > 5) {
      message.warning('Maximum 5 groups can be selected');
      return;
    }
    onGroupSelect(selectedValues);
  };

  return (
    <Modal
      title="Send Message to Groups"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
      className="group-message-modal"
      bodyStyle={{ padding: 0 }}
    >
      <div className="group-message-modal__body">
        <div className="group-message-modal__container">
          <div>
            <Button
              type="primary"
              onClick={fetchGroups}
              loading={fetchingGroups}
              className="bg-blue-500 hover:bg-blue-600 h-6 text-xs px-3 group-message-modal__fetch-button"
            >
              Fetch Groups
            </Button>
          </div>

          {/* <div className="group-message-modal__selected-groups">
            {selectedGroups.map((groupId) => {
              const group = groups.find(g => g.id === groupId);
              return (
                <div key={groupId} className="group-message-modal__group-tag">
                  {group ? group.name : groupId}
                </div>
              );
            })}
          </div> */}

          <div className="group-message-modal__groups-list">
            <Select
              mode="multiple"
              placeholder="Select groups"
              value={selectedGroups}
              onChange={handleGroupSelect}
              style={{ width: '100%' }}
              className="text-xs"
              options={groups.map(group => ({
                value: group.id,
                label: group.name
              }))}
              maxTagCount={5}
              maxTagPlaceholder={(omitted) => `+${omitted} more`}
            />
          </div>

          <div>
            <div className="group-message-modal__message-label">Message</div>
            <TextArea
              placeholder="Message to be sent"
              value={messageText}
              onChange={(e) => onMessageChange(e.target.value)}
              rows={3}
              className="group-message-modal__message-input"
            />
          </div>

          <div className="group-message-modal__send-button-container">
            <Button
              type="primary"
              onClick={onSend}
              disabled={
                !Array.isArray(selectedGroups) || selectedGroups.length === 0 || !messageText.trim() || loading
              }
              loading={loading}
              className="bg-blue-500 hover:bg-blue-600 h-8 text-xs px-4"
            >
              Send to Groups
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GroupMessageModal;