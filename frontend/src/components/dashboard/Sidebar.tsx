import React from "react";
import { Inbox, Star, Send, FileText, Archive, Trash2 } from "lucide-react";
import type { Mailbox } from "../../types";

interface SidebarProps {
  mailboxes: Mailbox[];
  selectedMailbox: Mailbox | null;
  onSelectMailbox: (mailbox: Mailbox) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  inbox: Inbox,
  star: Star,
  send: Send,
  draft: FileText,
  archive: Archive,
  trash: Trash2,
};

const Sidebar: React.FC<SidebarProps> = ({
  mailboxes,
  selectedMailbox,
  onSelectMailbox,
}) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          Mailboxes
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {mailboxes.map((mailbox) => {
          const Icon = iconMap[mailbox.icon] || Inbox;
          const isSelected = selectedMailbox?.id === mailbox.id;

          return (
            <button
              key={mailbox.id}
              onClick={() => onSelectMailbox(mailbox)}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-lg mb-1 transition-colors
                ${
                  isSelected
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 ${
                    isSelected ? "text-primary-600" : "text-gray-500"
                  }`}
                />
                <span
                  className={`font-medium ${
                    isSelected ? "text-primary-900" : ""
                  }`}
                >
                  {mailbox.name}
                </span>
              </div>
              {mailbox.unreadCount > 0 && (
                <span
                  className={`
                    px-2 py-0.5 text-xs font-semibold rounded-full
                    ${
                      isSelected
                        ? "bg-primary-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }
                  `}
                >
                  {mailbox.unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
