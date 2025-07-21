import React, { useState, useRef, useEffect } from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  Share2,
  Copy,
  Check,
  MessageSquareText,
  Send,
  X
} from "lucide-react";

const ShareButton = ({ postUrl }) => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef(null);

  const encodedUrl = encodeURIComponent(postUrl);

  const platforms = [
    {
      name: "WhatsApp",
      icon: <MessageSquareText className="w-5 h-5 mr-2" />,
      url: `https://wa.me/?text=${encodedUrl}`,
    },
    {
      name: "Twitter",
      icon: <Twitter className="w-5 h-5 mr-2" />,
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}`,
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-5 h-5 mr-2" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5 mr-2" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: "Telegram",
      icon: <Send className="w-5 h-5 mr-2" />,
      url: `https://t.me/share/url?url=${encodedUrl}`,
    },
  ];

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    };
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
        className="flex items-center px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <Share2 className="w-4 h-4 mr-1" />
        Share
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-900 rounded-xl w-full max-w-md p-6 relative mx-4"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-center text-gray-800 dark:text-white">
              Share This Post
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {platforms.map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  onClick={(e) => {
                    e.stopPropagation();
                }}
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  {platform.icon}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {platform.name}
                  </span>
                </a>
              ))}
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard();
                }}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-200">Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareButton;

