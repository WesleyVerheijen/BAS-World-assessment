import { faClock, faEyeSlash, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { IMessage } from "../api/IMessage";
import { OrderContext } from "../data/OrderContext";
import { putRequest } from "../utils/api";
import '../assets/styles/MessageForm.less';
import { useParams } from "react-router-dom";

enum Period {
    MINUTES = 1,
    HOURS = 2,
    DAYS = 3
}

interface IForm {
    recipient_id: number;
    read_once: boolean;
    expirationPeriod: Period;
    expireAfter: number;
    message: string;
}

const emptyData: IForm = {
    recipient_id: 0,
    read_once: false,
    expirationPeriod: Period.DAYS,
    expireAfter: 1,
    message: ''
}

export const MessageForm: React.FC = () => {
    const { user, sendMessage } = useContext(OrderContext);
    const userId = parseInt(useParams().userId ?? '');
    const [data, setData] = useState<IForm>({ ...emptyData, recipient_id: userId });

    const handleChange = (update: Partial<IForm>) => setData({ ...data, ...update });
    const handleSend = () => {
        const date = new Date();
        data.expirationPeriod === Period.MINUTES ? date.setMinutes(date.getMinutes() + data.expireAfter) : null;
        data.expirationPeriod === Period.HOURS ? date.setHours(date.getHours() + data.expireAfter) : null;
        data.expirationPeriod === Period.DAYS ? date.setDate(date.getDate() + data.expireAfter) : null;

        const message: IMessage = {
            recipient_id: data.recipient_id,
            message: data.message,
            read_once: data.read_once,
            expires_at: !data.read_once ? date : undefined,
            sender_id: (user ?? { id: 0 }).id,
            read: false,
            cipher: ''//encrypt
        };

        sendMessage(message);
        setData({ ...emptyData, recipient_id: userId });
    };

    return (
        <fieldset className="message-form">
            <div className="wrapper">
                <textarea 
                    placeholder="Say anything"
                    onChange={(event) => handleChange({message: event.currentTarget.value})}
                    defaultValue={data.message}
                ></textarea>
                <footer>
                    <div className="settings">
                        <button
                            type="button"
                            onClick={() => handleChange({ read_once: !data.read_once })}
                            disabled={data.read_once}
                        >
                            <FontAwesomeIcon icon={faEyeSlash} />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleChange({ read_once: false })}
                            disabled={!data.read_once}
                        >
                            <FontAwesomeIcon icon={faClock} />
                        </button>
                        <input
                            type="number"
                            onChange={(event) => handleChange({ expireAfter: parseInt(event.currentTarget.value) })}
                            defaultValue={data.expireAfter}
                            className={data.read_once ? 'hide' : ''}
                        />
                        <select
                            onChange={(event) => handleChange({ expirationPeriod: parseInt(event.currentTarget.value) })}
                            value={data.expirationPeriod}
                            className={data.read_once ? 'hide' : ''}
                        >
                            <option value="1">Minutes</option>
                            <option value="2">Hours</option>
                            <option value="3">Days</option>
                        </select>
                    </div>
                    <div className="actions">
                        <button type="button" onClick={handleSend}>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </footer>
            </div>
        </fieldset>
    );
}