import React from 'react';
import { Modal, Input, Button, Select, message } from 'antd';
import { sendBulkMessages } from '../../api/messageApi';

const { TextArea } = Input;

const SendMessageModal = ({ 
  visible = false, 
  onCancel = () => {}, 
//   onSend = () => {},
  messageText = '',
  onMessageChange = () => {},
  loading = false,
  selectedMembers = []
}) => {
  const supportedVariables = [
    { label: 'Name', value: '{{name}}' }
  ];

  const handleVariableInsert = () => {
    const newText = messageText + '{{name}}';
    onMessageChange(newText);
  };

  const handleSendMessage = async () => {
    try {
        const response = await sendBulkMessages({
            memberIds: selectedMembers,
            messageBody: messageText,
            type: 'text'
        });

        if (response.success) {
            message.success('Messages sent successfully');
            onCancel(); 
        } else {
            message.error('Failed to send messages');
        }
    } catch (error) {
        message.error('Error sending messages: ' + error.message);
    }
};

  return (
    <Modal
      title="Send Message"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
      className="send-message-modal"
    >
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-sm font-semibold mb-2">Message</div>
          <TextArea
            placeholder="Type your message here..."
            value={messageText}
            onChange={(e) => onMessageChange(e.target.value)}
            rows={6}
            className="w-full"
          />
        </div>

        <div>
          <div className="text-sm font-semibold mb-2">Supported Variables</div>
          <div className="flex gap-2">
            <Select
              className="w-40"
              options={supportedVariables}
              defaultValue="{{name}}"
              placeholder="Select Variable"
            />
            <Button 
              onClick={handleVariableInsert}
              className="bg-white hover:bg-gray-50 border border-gray-300"
              style={{marginLeft:"10px"}}
            >
              Insert Variable
            </Button>
            <Button
              type="primary"
              onClick={handleSendMessage}
              disabled={!messageText.trim() || loading}
              loading={loading}
              className="ml-auto bg-orange-500 hover:bg-orange-600"
              style={{marginLeft:"10px"}}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SendMessageModal;