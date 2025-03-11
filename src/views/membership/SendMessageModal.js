import React, { useRef, useEffect } from 'react';
import { Modal, Input, Button, Select, message } from 'antd';
import { sendBulkMessages } from '../../api/messageApi';
import '../../assets/scss/viewCommon.scss';

const { TextArea } = Input;

const SendMessageModal = ({ 
  visible = false, 
  onCancel = () => {}, 
  messageText = '',
  onMessageChange = () => {},
  loading = false,
  selectedMembers = []
}) => {
  const textAreaRef = useRef(null);
  const lastSelectionRef = useRef({ start: 0, end: 0 });
  
  const supportedVariables = [
    { label: 'Name', value: '{{name}}' }
  ];

  const handleVariableInsert = () => {
    const newText = messageText + '{{name}}';
    onMessageChange(newText);
  };

  const findVariables = (text) => {
    const variableRegex = /\{\{name\}\}/g;
    return [...text.matchAll(variableRegex)].map(match => ({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0]
    }));
  };

  const handleTextChange = (e) => {

    const input = e.target;
    const newValue = e.target.value;
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;

    lastSelectionRef.current = { start: selectionStart, end: selectionEnd };

    if (newValue.length < messageText.length) {
      const variables = findVariables(messageText);

      for (const variable of variables) {
        if (selectionStart === variable.end && selectionStart === selectionEnd) {

          const beforeVar = messageText.substring(0, variable.start);
          const afterVar = messageText.substring(variable.end);
          const updatedText = beforeVar + afterVar;
          onMessageChange(updatedText);
          
          setTimeout(() => {
            input.selectionStart = variable.start;
            input.selectionEnd = variable.start;
          }, 0);
          return;
        }

        if (selectionStart === variable.start && selectionStart === selectionEnd) {
          const beforeVar = messageText.substring(0, variable.start);
          const afterVar = messageText.substring(variable.end);
          const updatedText = beforeVar + afterVar;
          onMessageChange(updatedText);
          
          setTimeout(() => {
            input.selectionStart = variable.start;
            input.selectionEnd = variable.start;
          }, 0);
          return;
        }
        
        const deletedCharPos = selectionStart;
        if (deletedCharPos > variable.start && deletedCharPos < variable.end) {
          const beforeVar = messageText.substring(0, variable.start);
          const afterVar = messageText.substring(variable.end);
          const updatedText = beforeVar + afterVar;
          onMessageChange(updatedText);
          
          setTimeout(() => {
            input.selectionStart = variable.start;
            input.selectionEnd = variable.start;
          }, 0);
          return;
        }
      }
    }
    
    const lastChar = newValue.length > messageText.length 
      ? newValue.charAt(selectionStart - 1) 
      : null;
      
    if (lastChar === '{' || lastChar === '}') {
      const filteredValue = newValue.substring(0, selectionStart - 1) + 
                            newValue.substring(selectionStart);
      
      onMessageChange(filteredValue);

      setTimeout(() => {
        input.selectionStart = selectionStart - 1;
        input.selectionEnd = selectionEnd - 1;
      }, 0);
      return;
    }
    
    onMessageChange(newValue);
  };

  const handleSendMessage = async () => {
    try {
        const response = await sendBulkMessages({
            memberIds: selectedMembers,
            messageBody: messageText,
            type: 'text'
        });

        if (response.status === true || response.code === 201) {
            message.success('Messages sent successfully');
            onCancel(); 
        } else {
            message.error('Failed to send messages');
        }
    } catch (error) {
        message.error('Error sending messages: ' + error.message);
    }
  };

  useEffect(() => {
    if (visible && textAreaRef.current) {
      setTimeout(() => {
        textAreaRef.current.focus();
      }, 100);
    }
  }, [visible]);

  return (
    <Modal
      title="Send Message"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={500}
      className="group-message-modal"
    >
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-sm font-semibold mb-2 send-message-label">Message</div>
          <TextArea
            ref={textAreaRef}
            placeholder="Type your message here..."
            value={messageText}
            onChange={handleTextChange}  
            rows={6}
            className="w-full"
          />
        </div>

        <div>
          <div className="text-sm font-semibold mb-2 supportedVariables">Supported Variables</div>
          <div className="flex gap-5">
            <Select
              className="w-40"
              options={supportedVariables}
              defaultValue="{{name}}"
              placeholder="Select Variable"
            />
            <Button 
              onClick={handleVariableInsert}
              className="variable-insert-btn bg-white hover:bg-gray-50 border border-gray-300 insertVariables"
            >
              Insert Variable
            </Button>
            <Button
              type="primary"
              onClick={handleSendMessage}
              disabled={!messageText.trim() || loading}
              loading={loading}
              className="send-btn ml-auto bg-orange-500 hover:bg-orange-600 sendMemberMessage"
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