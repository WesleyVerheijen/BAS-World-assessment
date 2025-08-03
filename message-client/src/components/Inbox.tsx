import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { OrderContext, OrderContextType } from "../data/OrderContext";
import { Link } from "react-router-dom";
import '../assets/styles/Inbox.less';

export const Inbox: React.FC = () => {
    const { users, user, loadMessages, messages } = useContext(OrderContext);
    const unread = messages?.reduce((map, message) => ({
        ...map,
        [message.sender_id]: (map[message.sender_id] ?? 0) + (message.read ? 0 : 1)
    }), {});

    console.log(unread);
    

    return (
        <div className="inbox">
            <header>
                <button type="button" onClick={() => loadMessages() }>
                    <FontAwesomeIcon icon={faRefresh} />
                </button>
            </header>
            <aside>
                {(users??[]).sort((a, b) => a.name < b.name ? -1: 1).filter(current => current.id !== user.id).map((user) => (
                    <Link key={user.id} to={`/chat/${user.id}`}>
                        {user.name}
                        {unread[user.id] > 0 ? <span className="badge">{unread[user.id] ?? ''}</span> : <></>}
                    </Link>
                ))}
            </aside>
        </div>
    );
}