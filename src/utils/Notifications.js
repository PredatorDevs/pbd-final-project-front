import { ExclamationCircleOutlined } from '@ant-design/icons';
import { notification, Modal } from 'antd';

export const customNot = (type = 'success', message = 'Título', descrip = 'Descripción') => {
  notification[type]({
    message: message,
    description: descrip,
    duration: 3
  });
};

export const customConfirm = async (
  message = 'Título',
  descrip = 'Descripción',
  deleteConfirm = false,
  okText = 'OK'
) => {
  const { confirm } = Modal;
  
  let selected = false;
  
  confirm({
    title: message,
    icon: <ExclamationCircleOutlined />,
    content: descrip,
    okText: okText,
    okType: deleteConfirm ? 'primary' : 'danger',
    onOk() { selected = true; },
    onCancel() { selected = false; },
  });

  return selected;
}