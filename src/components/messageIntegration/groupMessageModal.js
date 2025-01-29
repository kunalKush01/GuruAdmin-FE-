import React, { useState } from 'react';
import { Modal, Input, Button, List, Checkbox, message } from 'antd';
import { Tag } from 'antd';

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

  const handleGroupCheck = (group) => {
    if (selectedGroups.includes(group.id)) {
      onGroupSelect(selectedGroups.filter(g => g !== group.id));
    } else if (selectedGroups.length < 5) {
      onGroupSelect([...selectedGroups, group.id]);
    } else {
      message.warning('Maximum 5 groups can be selected');
    }
  };

  const getGroupName = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    return group ? group.name : groupId;
  };

  return (
    <Modal
      title="Send Message to Groups"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={400}
      bodyStyle={{
        padding: '16px',
        maxHeight: '80vh',
        overflow: 'auto',
        borderRadius: '8px',
      }}
    >
      <div className="flex flex-col gap-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            {/* <div className="text-sm font-semibold">Select Groups (Max 5)</div> */}
            <Button
              type="primary"
              onClick={fetchGroups}
              loading={fetchingGroups}
              className="bg-blue-500 hover:bg-blue-600 h-6 text-xs px-3"
              style={{ padding: "10px", marginLeft:"70px", marginTop:"-60px" }}
            >
              Fetch Groups
            </Button>
          </div>
        </div>

        <div className="p-1 border rounded-md min-h-[28px] flex flex-wrap gap-1 items-center bg-gray-50">
          {Array.isArray(selectedGroups) && selectedGroups.length > 0 ? (
            selectedGroups.map((groupId) => (
              <Tag
                key={groupId}
                closable
                onClose={() =>
                  onGroupSelect(selectedGroups.filter((g) => g !== groupId))
                }
                className="text-xs px-1 py-0 m-0 leading-none"
              >
                {getGroupName(groupId)}
              </Tag>
            ))
          ) : (
            <span className="text-gray-400 text-xs">Select Groups (Max 5)</span>
          )}
        </div>

        <div className="border rounded-md" style={{ height: '100px', overflowY: 'auto' }}>
          <List
            size="small"
            dataSource={groups}
            renderItem={(group) => (
              <List.Item className="hover:bg-gray-50 px-2 py-0.5">
                <Checkbox
                  checked={Array.isArray(selectedGroups) && selectedGroups.includes(group.id)}
                  onChange={() => handleGroupCheck(group)}
                  className="text-xs"
                >
                  <span className="text-xs">{group.name}</span>
                </Checkbox>
              </List.Item>
            )}
          />
        </div>
        <div>
          <div className="mb-1 text-sm font-bold" style={{ padding: "10px", marginLeft:"-10px" }}>Message</div>
          <TextArea
            placeholder="Message to be sent"
            value={messageText}
            onChange={(e) => onMessageChange(e.target.value)}
            rows={3}
            className="w-full text-xs"
            style={{ marginTop:"-20px" }}
          />
        </div>

        <div className="flex justify-end mt-10" style={{ padding: "10px", marginLeft:"50px" }}>
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
    </Modal>
  );
};

export default GroupMessageModal;