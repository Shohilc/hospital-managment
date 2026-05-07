import { useApp } from '../context/AppContext';
import { MdCheckCircle, MdError, MdInfo } from 'react-icons/md';

export default function Toast() {
  const { toasts } = useApp();
  const icons = { success: <MdCheckCircle color="var(--green)" />, error: <MdError color="var(--rose)" />, info: <MdInfo color="var(--accent)" /> };

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span style={{ fontSize: 18 }}>{icons[t.type] || icons.info}</span>
          <span style={{ fontSize: 13 }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
